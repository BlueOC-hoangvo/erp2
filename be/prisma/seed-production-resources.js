const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Production Resources...');

  // 1. Tạo Work Centers
  const workCenters = await Promise.all([
    prisma.workCenter.create({
      data: {
        code: 'WC001',
        name: 'Cutting Department',
        description: 'Fabric cutting operations',
        location: 'Building A, Floor 1',
        capacityPerHour: 50,
        efficiencyFactor: 85.00,
        workingHoursStart: new Date('1970-01-01T08:00:00'),
        workingHoursEnd: new Date('1970-01-01T17:00:00'),
      },
    }),
    prisma.workCenter.create({
      data: {
        code: 'WC002',
        name: 'Sewing Department',
        description: 'Garment assembly and sewing',
        location: 'Building A, Floor 2',
        capacityPerHour: 30,
        efficiencyFactor: 80.00,
        workingHoursStart: new Date('1970-01-01T08:00:00'),
        workingHoursEnd: new Date('1970-01-01T17:00:00'),
      },
    }),
    prisma.workCenter.create({
      data: {
        code: 'WC003',
        name: 'Finishing Department',
        description: 'Quality control and packaging',
        location: 'Building B, Floor 1',
        capacityPerHour: 40,
        efficiencyFactor: 90.00,
        workingHoursStart: new Date('1970-01-01T08:00:00'),
        workingHoursEnd: new Date('1970-01-01T17:00:00'),
      },
    }),
  ]);

  console.log('✅ Created Work Centers:', workCenters.length);

  // 2. Tạo Machines
  const machines = await Promise.all([
    // Machines for Cutting Department
    prisma.machine.create({
      data: {
        workCenterId: workCenters[0].id,
        code: 'CUT001',
        name: 'Automatic Cutting Machine #1',
        serialNumber: 'CUT2024001',
        manufacturer: 'Lectra',
        model: 'Vector iX9',
        purchaseDate: new Date('2024-01-15'),
        warrantyExpiry: new Date('2027-01-15'),
        status: 'ACTIVE',
        capacityPerHour: 50,
        setupTimeMinutes: 30,
        cycleTimeMinutes: 2.5,
        oeeTarget: 85.00,
        location: 'Station A1',
      },
    }),
    prisma.machine.create({
      data: {
        workCenterId: workCenters[0].id,
        code: 'CUT002',
        name: 'Manual Cutting Table #1',
        serialNumber: 'MAN2024002',
        manufacturer: 'Gerber',
        model: 'DC330',
        purchaseDate: new Date('2024-02-10'),
        warrantyExpiry: new Date('2027-02-10'),
        status: 'ACTIVE',
        capacityPerHour: 25,
        setupTimeMinutes: 15,
        cycleTimeMinutes: 5.0,
        oeeTarget: 75.00,
        location: 'Station A2',
      },
    }),

    // Machines for Sewing Department
    prisma.machine.create({
      data: {
        workCenterId: workCenters[1].id,
        code: 'SEW001',
        name: 'Industrial Sewing Machine #1',
        serialNumber: 'SEW2024001',
        manufacturer: 'Juki',
        model: 'DDL-8700-7',
        purchaseDate: new Date('2024-01-20'),
        warrantyExpiry: new Date('2027-01-20'),
        status: 'ACTIVE',
        capacityPerHour: 100,
        setupTimeMinutes: 10,
        cycleTimeMinutes: 1.2,
        oeeTarget: 90.00,
        location: 'Station B1',
      },
    }),
    prisma.machine.create({
      data: {
        workCenterId: workCenters[1].id,
        code: 'SEW002',
        name: 'Overlock Machine #1',
        serialNumber: 'SEW2024002',
        manufacturer: 'Brother',
        model: 'BASS-4250N',
        purchaseDate: new Date('2024-02-05'),
        warrantyExpiry: new Date('2027-02-05'),
        status: 'MAINTENANCE',
        capacityPerHour: 80,
        setupTimeMinutes: 15,
        cycleTimeMinutes: 1.5,
        oeeTarget: 85.00,
        location: 'Station B2',
      },
    }),

    // Machine for Finishing Department
    prisma.machine.create({
      data: {
        workCenterId: workCenters[2].id,
        code: 'FIN001',
        name: 'Quality Inspection Station #1',
        serialNumber: 'FIN2024001',
        manufacturer: 'Eton',
        model: 'QIS-Pro',
        purchaseDate: new Date('2024-01-25'),
        warrantyExpiry: new Date('2027-01-25'),
        status: 'ACTIVE',
        capacityPerHour: 60,
        setupTimeMinutes: 5,
        cycleTimeMinutes: 1.0,
        oeeTarget: 95.00,
        location: 'Station C1',
      },
    }),
  ]);

  console.log('✅ Created Machines:', machines.length);

  // 3. Tạo Machine Maintenance schedules
  const maintenances = await Promise.all([
    prisma.machineMaintenance.create({
      data: {
        machineId: machines[1].id, // Manual Cutting Table #1
        maintenanceType: 'PREVENTIVE',
        description: 'Monthly blade replacement and calibration',
        scheduledDate: new Date('2024-12-30T09:00:00'),
        scheduledDurationHours: 2.0,
        cost: 150.00,
        technician: 'Nguyễn Văn An',
        status: 'SCHEDULED',
      },
    }),
    prisma.machineMaintenance.create({
      data: {
        machineId: machines[3].id, // Overlock Machine #1
        maintenanceType: 'CORRECTIVE',
        description: 'Repair thread tension mechanism',
        scheduledDate: new Date('2024-12-28T14:00:00'),
        scheduledDurationHours: 4.0,
        cost: 300.00,
        technician: 'Trần Thị Bình',
        status: 'IN_PROGRESS',
        actualStartTime: new Date('2024-12-27T10:00:00'),
      },
    }),
    prisma.machineMaintenance.create({
      data: {
        machineId: machines[0].id, // Automatic Cutting Machine #1
        maintenanceType: 'PREVENTIVE',
        description: 'Quarterly maintenance check',
        scheduledDate: new Date('2024-12-31T08:00:00'),
        scheduledDurationHours: 3.0,
        cost: 500.00,
        technician: 'Lê Văn Cường',
        status: 'SCHEDULED',
      },
    }),
  ]);

  console.log('✅ Created Machine Maintenances:', maintenances.length);

  // 4. Tạo Production Calendar for next 30 days
  const today = new Date();
  const calendarEntries = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayOfWeek = date.getDay();
    let dayType = 'WORKING';
    let isWorkingDay = true;
    let workingHours = 8.0;
    let shift1Hours = 8.0;

    // Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayType = 'WEEKEND';
      isWorkingDay = false;
      workingHours = 0.0;
      shift1Hours = 0.0;
    }

    // New Year holiday
    if (i === 1) { // Tomorrow
      dayType = 'HOLIDAY';
      isWorkingDay = false;
      workingHours = 0.0;
      shift1Hours = 0.0;
    }

    calendarEntries.push(
      prisma.productionCalendar.create({
        data: {
          date: date,
          dayType,
          description: isWorkingDay ? 'Regular working day' : `${dayType} day`,
          isWorkingDay,
          workingHours,
          shift1Hours,
        },
      })
    );
  }

  await Promise.all(calendarEntries);
  console.log('✅ Created Production Calendar:', calendarEntries.length);

  // 5. Tạo Resource Capacity for next week
  const capacityEntries = [];
  const startDate = new Date();
  startDate.setDate(today.getDate() + 1); // Tomorrow

  for (let day = 0; day < 7; day++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + day);
    
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const availableHours = isWeekend ? 0 : 8;

    for (const wc of workCenters) {
      capacityEntries.push(
        prisma.resourceCapacity.create({
          data: {
            workCenterId: wc.id,
            date: date,
            shift: 'DAY',
            plannedCapacityHours: availableHours,
            availableCapacityHours: availableHours,
            efficiencyPercent: wc.efficiencyFactor,
          },
        })
      );
    }
  }

  await Promise.all(capacityEntries);
  console.log('✅ Created Resource Capacities:', capacityEntries.length);

  // 6. Tạo Resource Allocations (sample production scheduling)
  const productionOrders = await prisma.productionOrder.findMany();
  
  if (productionOrders.length > 0) {
    const allocations = await Promise.all([
      prisma.resourceAllocation.create({
        data: {
          productionOrderId: productionOrders[0].id,
          workCenterId: workCenters[0].id,
          machineId: machines[0].id,
          allocationDate: new Date('2024-12-30'),
          startTime: new Date('1970-01-01T08:00:00'),
          endTime: new Date('1970-01-01T12:00:00'),
          plannedHours: 4.0,
          quantityPlanned: 200.0,
          status: 'PLANNED',
          notes: 'Cutting fabric for style ABC123',
        },
      }),
      prisma.resourceAllocation.create({
        data: {
          productionOrderId: productionOrders[0].id,
          workCenterId: workCenters[1].id,
          machineId: machines[2].id,
          allocationDate: new Date('2024-12-30'),
          startTime: new Date('1970-01-01T13:00:00'),
          endTime: new Date('1970-01-01T17:00:00'),
          plannedHours: 4.0,
          quantityPlanned: 200.0,
          status: 'PLANNED',
          notes: 'Sewing components for style ABC123',
        },
      }),
    ]);

    console.log('✅ Created Resource Allocations:', allocations.length);
  }

  console.log('🎉 Production Resources seeding completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   • Work Centers: ${workCenters.length}`);
  console.log(`   • Machines: ${machines.length}`);
  console.log(`   • Maintenances: ${maintenances.length}`);
  console.log(`   • Calendar Entries: ${calendarEntries.length}`);
  console.log(`   • Capacity Plans: ${capacityEntries.length}`);
  if (productionOrders.length > 0) {
    console.log(`   • Resource Allocations: ${allocations.length}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
