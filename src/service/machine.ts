import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
//import roles from '../core/roles';        nodig voor authenticatie/autorisatie later
import type { Machine } from '../types/machine';
import { getKPIidPerStatus } from './kpi';

export const getAllMachines = async (page = 0, limit = 0): Promise<{ items: Machine[], total: number }> => {
  try {
    let machines;
    if (page === 0 || limit === 0) {
      machines = await prisma.machine.findMany(
        {
          include: {
            Onderhoud: true,
            product: true,
            site: true,
            technieker: true,
          },
        });
    } else {
      const skip = (page - 1) * limit;
      machines = await prisma.machine.findMany({
        skip: skip,
        take: limit,
        include: {
          Onderhoud: true,
          product: true,
          site: true,
          technieker: true,
        },
      });
    }

    const total = await prisma.machine.count();

    if (!machines.length) {
      throw ServiceError.notFound('Geen machines gevonden.');
    }

    return {
      items: machines.map((machine) => ({
        id: machine.id,
        site_id: machine.site.id,
        product_id: machine.product.id,
        technieker_gebruiker_id: machine.technieker.id,
        code: machine.code,
        locatie: machine.locatie,
        status: machine.status,
        productie_status: machine.productie_status,
      })),
      total,
    };
  } catch (error) {

    if (error instanceof ServiceError) {
      throw error;
    }
    throw handleDBError(error);
  }
};

export const getMachineById = async (id: number) => {

  try {
    const machine = await prisma.machine.findUnique({
      where: { id },
      include: {
        Onderhoud: true,
        product: true,
        site: true,
        technieker: true,
      },
    });

    if (!machine) {
      throw ServiceError.notFound('Machine niet gevonden');
    }

    return {
      id: machine.id,
      site_id: machine.site.id,
      product_id: machine.product.id,
      technieker_gebruiker_id: machine.technieker.id,
      code: machine.code,
      locatie: machine.locatie,
      status: machine.status,
      productie_status: machine.productie_status,
    };
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

    const machine = await prisma.machine.update(
      {
        where: { id },
        data: { site_id, product_id, technieker_gebruiker_id, code, locatie, status, productie_status },
      },
    );

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
      waarde: falend === 0 ? '1' : (gezond / falend).toFixed(2),
      site_id: site_id,
    }));

    await prisma.kPIWaarde.createMany({
      data: kpiDataPerSite,
      skipDuplicates: true,
    });

    // Algemene gezondheid alle sites
    const totaalGezond = kpiDataPerSite.reduce((sum, { waarde }) => sum + parseFloat(waarde), 0);
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
      acc[machine.productie_status].push(machine.id);
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

