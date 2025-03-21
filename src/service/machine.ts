import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { CreateMachineRequest, Machine, getMachineByIdResponse } from '../types/machine';
import { getKPIidPerStatus } from './kpi';
import type { Machine_Status, Productie_Status } from '@prisma/client';

// Wat je wilt dat je krijgt als je een machine
const SELECT_MACHINE = {
  id: true,
  product_id: true,
  code: true,
  locatie: true,
  status: true,
  product_informatie: true,
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
  onderhouden: {
    select: {
      id: true,
      technieker: {
        select: {
          id: true,
          voornaam: true,
          naam: true,
        },
      },
      datum: true,
      starttijdstip: true,
      eindtijdstip: true,
      reden: true,
      status: true,
      opmerkingen: true,
    },
  },
};

export const getAllMachines = async (): Promise<Machine[]> => {
  try {
    const machines = await prisma.machine.findMany({
      select: { ...SELECT_MACHINE },
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

export const createMachine = async (data: CreateMachineRequest): Promise<Machine> => {
  try {
    // Check if the technieker exists
    const technieker = await prisma.gebruiker.findUnique({
      where: { id: data.technieker_gebruiker_id },
      select: { rol: true },
    });

    if (!technieker) {
      throw new Error('Technieker does not exist.');
    }

    if (technieker.rol !== 'TECHNIEKER') {
      throw new Error('The gebruiker is not a valid TECHNIEKER.');
    }

    // Create the machine
    const machine = await prisma.machine.create({
      data: {
        site_id: data.site_id,
        product_id: data.product_id,
        technieker_gebruiker_id: data.technieker_gebruiker_id,
        code: data.code,
        locatie: data.locatie,
        status: data.status as Machine_Status,
        productie_status: data.productie_status as Productie_Status,
        product_informatie: data.product_informatie,
      },
      include: {
        site: {
          include: {
            verantwoordelijke: true, // Ensure this field is included
          },
        },
        technieker: {
          select: {
            id: true,
            naam: true,
            voornaam: true,
          },
        },
        product: true,
      },
    });

    return machine;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getMachineById = async (id: number): Promise<getMachineByIdResponse> => {
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

export const updateMachineById = async (id: number,
  { site_id, product_id, technieker_gebruiker_id, code, locatie, status, productie_status }: any) => {

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

    // Remove site_id from update data if it shouldn't be updated
    const updateData: any = {
      product_id,
      technieker_gebruiker_id,
      code,
      locatie,
      status,
      productie_status,
    };

    if (site_id !== undefined) {
      updateData.site_id = site_id;  // Only include site_id if it's provided
    }

    const machine = await prisma.machine.update({
      where: { id },
      data: updateData,
      select: SELECT_MACHINE,
    });

    if (previousMachine.status !== status) {
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

export const updateMachineKPIs = async () => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Laatste 5 onderhoudsbeurten

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
      kpi_id: getKPIidPerStatus('SITE_GEZONDHEID'),
      datum: today,
      waarde: falend === 0 ? '1' : (gezond / falend),
      site_id: site_id,
    }));

    await prisma.kPIWaarde.createMany({
      data: kpiDataPerSite,
      skipDuplicates: true,
    });

    // Algemene gezondheid alle sites
    const totaalGezond = kpiDataPerSite.reduce((sum, { waarde }) => sum + parseFloat(String(waarde)), 0);
    const totaalSites = kpiDataPerSite.length;
    const algemeneGezondheid = totaalSites === 0 ? '0' : (totaalGezond / totaalSites).toFixed(2);

    await prisma.kPIWaarde.create({
      data: {
        kpi: {
          connect: {
            id: getKPIidPerStatus('ALGEMENE_GEZONDHEID'),
          },
        },
        datum: today,
        waarde: algemeneGezondheid,
        site_id: null,
      },
    });

    // Machines per status
    const machinesPerStatus = await prisma.machine.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const KPI_data_machinesPerStatus = machinesPerStatus.map((statusgroep) => ({
      kpi_id: getKPIidPerStatus(statusgroep.status),
      datum: today,
      waarde: statusgroep._count.id.toString(),
      site_id: null,
    }));

    await prisma.kPIWaarde.createMany({
      data: KPI_data_machinesPerStatus,
      skipDuplicates: true,
    });

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
      kpi_id: getKPIidPerStatus('AANKOMEND_ONDERHOUD'),
      datum: today,
      waarde: onderhoudIds.join(','),
    }];

    await prisma.kPIWaarde.createMany({
      data: aankomendeOnderhoudsbeurtenKPIData,
      skipDuplicates: true,
    });

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
        kpi_id: getKPIidPerStatus(productieStatus),
        datum: today,
        waarde: ids.join(','),
        site_id: null,
      }),
    );

    await prisma.kPIWaarde.createMany({
      data: KPI_data_machinesPerProductieStatus,
      skipDuplicates: true,
    });

  } catch (error) {
    console.error(`Fout bij het updaten van machine KPI's: ${error}`);
  }
};

