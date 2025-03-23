import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import { getKPIid } from './kpi';
import { Machine_Status, Productie_Status } from '@prisma/client';
import type { Machine, MachineCreateInput, MachineUpdateInput } from '../types/machine';
import { getLogger } from '../core/logging';

// Gegevens voor een machine die we willen ophalen
const SELECT_MACHINE = {
  id: true,
  code: true,
  status: true,
  status_sinds: true,
  aantal_goede_producten: true,
  aantal_slechte_producten: true,
  limiet_voor_onderhoud: true,
  locatie: true,
  productie_status: true,
  technieker: {
    select: {
      id: true,
      voornaam: true,
      naam: true,
    },
  },
  site: {
    select: {
      id: true,
      naam: true,
      verantwoordelijke: true,
    },
  },
  product: {
    select: {
      id: true,
      naam: true,
      product_informatie: true,
    },
  },
  onderhouden: {
    select: {
      id: true,
      machine_id: true,
      datum: true,
      starttijdstip: true,
      eindtijdstip: true,
      reden: true,
      status: true,
      opmerkingen: true,
      technieker: {
        select: {
          id: true,
          voornaam: true,
          naam: true,
        },
      },
    },
  },
};

export const getAllMachines = async (): Promise<Machine[]> => {
  try {
    const machines = await prisma.machine.findMany({
      select: SELECT_MACHINE,
    });

    if (!machines.length) {
      throw ServiceError.notFound('Geen machines gevonden.');
    }

    return machines;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw handleDBError(error);
  }
};

export const createMachine = async (data: MachineCreateInput): Promise<Machine> => {
  try {

    getLogger().info(`Creating machine with code ${data.code}`);
    // Check if the technieker/user exists 
    const technieker = await prisma.gebruiker.findUnique({
      where: { id: data.technieker_id },
      select: { rol: true },
    });

    if (!technieker) {
      throw new Error('Technieker does not exist.');
    }

    // if user/technieker is not a valid TECHNIEKER:
    if (technieker.rol !== 'TECHNIEKER') {
      throw new Error('The gebruiker is not a valid TECHNIEKER.');
    }

    // Create the machine
    const machine = await prisma.machine.create({
      data: {
        code: data.code,
        locatie: data.locatie,
        status: Machine_Status.DRAAIT,
        status_sinds: new Date(),
        productie_status: Productie_Status.GEZOND,
        aantal_goede_producten: 0,
        aantal_slechte_producten: 0,
        limiet_voor_onderhoud: data.limiet_voor_onderhoud,
        technieker: {
          connect: { id: data.technieker_id },
        },
        site: {
          connect: { id: data.site_id },
        },
        product: {
          connect: { id: data.product.id },
        },
      },
      select: SELECT_MACHINE,
    });

    return machine;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getMachineById = async (id: number) => {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id },
      select: SELECT_MACHINE,
    });

    if (!machine) {
      throw ServiceError.notFound('Machine niet gevonden');
    }

    return machine;  // This will return the machine with technieker and site included
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateMachineById = async (id: number, changes: MachineUpdateInput) => {
  // Assuming this function exists elsewhere in your codebase
  updateMachineKPIs();

  try {
    const previousMachine = await prisma.machine.findUnique({
      where: { id },
      select: {
        status: true,
      },
    });

    if (!previousMachine) {
      throw ServiceError.notFound('Machine niet gevonden');
    }

    const {
      code,
      locatie,
      technieker_id,
      site_id,
      product,
      limiet_voor_onderhoud,
      status,
      productie_status,
    } = changes;

    // Prepare update data with only defined fields
    const updateData: any = {};

    if (code !== undefined) updateData.code = code;
    if (locatie !== undefined) updateData.locatie = locatie;
    if (limiet_voor_onderhoud !== undefined) updateData.limiet_voor_onderhoud = limiet_voor_onderhoud;
    if (status !== undefined) updateData.status = status as Machine_Status;
    if (productie_status !== undefined) updateData.productie_status = productie_status;

    if (technieker_id !== undefined) {
      updateData.technieker = {
        connect: { id: technieker_id },
      };
    }

    if (site_id !== undefined) {
      updateData.site = {
        connect: { id: site_id },
      };
    }

    if (product !== undefined) {
      updateData.product = {
        connect: {
          id: product.id,
        },
      };
    }

    if (status !== undefined && previousMachine.status !== status) {
      updateData.status_sinds = new Date();
    }

    const machine = await prisma.machine.update({
      where: { id },
      data: updateData, // Use the prepared updateData object here
      select: SELECT_MACHINE,
    });

    // Create notification if status changed
    if (status !== undefined && previousMachine.status !== status) {
      await prisma.notificatie.create({
        data: {
          bericht: `Machine ${machine.id} ${machine.status}`,
        },
      });
    }

    return machine;
  } catch (error) {
    throw handleDBError(error);
  }
};

async function safeCreateKPIWaarden(data: any) {
  let retries = 3;
  while (retries > 0) {
    try {
      await prisma.kPIWaarde.createMany({
        data,
        skipDuplicates: true,
      });
      return;
    } catch (error: any) {
      if (error.code === 'P2034' || error.message.includes('write conflict')) {
        retries--;
        console.warn(`Retrying transaction... (${3 - retries}/3)`);
        await new Promise((res) => setTimeout(res, 100));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Transaction failed after 3 retries');
}

export const updateMachineKPIs = async () => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.kPIWaarde.deleteMany({});

    // Productiegraad per site
    const productieDataPerSite = await prisma.machine.groupBy({
      by: ['site_id'],
      _sum: {
        aantal_goede_producten: true,
        aantal_slechte_producten: true,
      },
    });

    const kpiDataProductiegraad = productieDataPerSite.map(({ site_id, _sum }) => {
      const goedeProducten = _sum.aantal_goede_producten || 0;
      const slechteProducten = _sum.aantal_slechte_producten || 0;
      const totaalProducten = goedeProducten + slechteProducten;

      const productiegraad = totaalProducten === 0 ? 0 : goedeProducten / totaalProducten;

      return {
        site_id,
        productiegraad,
      };
    });

    const kpiDataHoogLaag = [...kpiDataProductiegraad]
      .sort((a, b) => b.productiegraad - a.productiegraad)
      .map(({ site_id, productiegraad }) => ({
        kpi_id: getKPIid('PRODUCTIEGRAADHOOGLAAG'),
        datum: today,
        waarde: productiegraad.toFixed(2),
        site_id: String(site_id),
      }));

    const kpiDataLaagHoog = [...kpiDataProductiegraad]
      .sort((a, b) => a.productiegraad - b.productiegraad)
      .map(({ site_id, productiegraad }) => ({
        kpi_id: getKPIid('PRODUCTIEGRAADLAAGHOOG'),
        datum: today,
        waarde: productiegraad.toFixed(2),
        site_id: String(site_id),
      }));

    await safeCreateKPIWaarden([...kpiDataHoogLaag, ...kpiDataLaagHoog]);

    //Algemene gezondheid per site
    const machinesPerSite = await prisma.machine.groupBy({
      by: ['site_id', 'productie_status'],
      _count: { id: true },
    });

    const siteHealthData: Record<number, { gezond: number; falend: number }> = {};

    machinesPerSite.forEach(({ site_id, productie_status, _count }) => {
      if (!siteHealthData[site_id]) {
        siteHealthData[site_id] = { gezond: 0, falend: 0 };
      }

      if (productie_status === 'GEZOND') {
        siteHealthData[site_id].gezond += _count.id;
      } else if (productie_status === 'FALEND' || productie_status === 'NOOD_ONDERHOUD') {
        siteHealthData[site_id].falend += _count.id;
      }
    });

    const kpiDataPerSite = Object.entries(siteHealthData).map(([site_id, { gezond, falend }]) => ({
      kpi_id: getKPIid('SITE_GEZONDHEID'),
      datum: today,
      waarde: ((gezond / (gezond + falend)) * 100).toFixed(2),
      site_id: site_id,
    }));

    await safeCreateKPIWaarden(kpiDataPerSite);

    // Algemene gezondheid alle sites
    const totaalGezond = kpiDataPerSite.reduce((sum, { waarde }) => sum + parseFloat(String(waarde)), 0);
    const totaalSites = kpiDataPerSite.length;
    const algemeneGezondheid = totaalSites === 0 ? '0' : (totaalGezond / totaalSites).toFixed(2);

    const KPI_data_algemeneGezondheid = {
      kpi_id: getKPIid('ALGEMENE_GEZONDHEID'),
      datum: today,
      waarde: algemeneGezondheid,
      site_id: null,
    };

    await safeCreateKPIWaarden(KPI_data_algemeneGezondheid);

    // Machines per status
    const machinesPerStatus = await prisma.machine.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const KPI_data_machinesPerStatus = machinesPerStatus.map((statusgroep) => ({
      kpi_id: getKPIid(statusgroep.status),
      datum: today,
      waarde: statusgroep._count.id.toString(),
      site_id: null,
    }));

    await safeCreateKPIWaarden(KPI_data_machinesPerStatus);

    // Aankomende onderhoudsbeurten
    const aankomendeOnderhoudsbeurten = await prisma.onderhoud.findMany({
      where: {
        datum: {
          gt: today,
        },
      },
    });

    const onderhoudIds = aankomendeOnderhoudsbeurten.map((onderhoud) => onderhoud.id);

    const aankomendeOnderhoudsbeurtenKPIData = [{
      kpi_id: getKPIid('AANKOMEND_ONDERHOUD'),
      datum: today,
      waarde: onderhoudIds.join(','),
    }];
    await safeCreateKPIWaarden(aankomendeOnderhoudsbeurtenKPIData);

    // Laatste 5 onderhoudsbeurten
    const laatsteOnderhouden = await prisma.onderhoud.findMany({
      select: {
        id: true,
      },
      orderBy: {
        datum: 'desc',
      },
      take: 5,
    });

    const laatsteOnderhoudIds = laatsteOnderhouden.map((onderhoud) => onderhoud.id);

    const laatste5OnderhoudenKPIData = [{
      kpi_id: getKPIid('LAATSTEONDERHOUDEN'),
      datum: today,
      waarde: laatsteOnderhoudIds.join(','),
    }];

    await safeCreateKPIWaarden(laatste5OnderhoudenKPIData);

    //Machines per productiestatus
    const machinesPerProductieStatus = await prisma.machine.findMany({
      select: {
        productie_status: true,
        id: true,
      },
      orderBy: {
        status: 'asc',
      },
    });

    const machinesPerProductieStatusGrouped = machinesPerProductieStatus.reduce((acc, machine) => {
      if (!acc[machine.productie_status]) {
        acc[machine.productie_status] = [];
      }
      acc[machine.productie_status]?.push(machine.id);
      return acc;
    }, {} as Record<string, number[]>);

    const KPI_data_machinesPerProductieStatus = Object.entries(machinesPerProductieStatusGrouped).map(
      ([productieStatus, ids]) => ({
        kpi_id: getKPIid(productieStatus),
        datum: today,
        waarde: ids.join(','),
        site_id: null,
      }),
    );

    await safeCreateKPIWaarden(KPI_data_machinesPerProductieStatus);

  } catch (error) {
    console.error(`Fout bij het updaten van machine KPI's: ${error}`);
  }
};

