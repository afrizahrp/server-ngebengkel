import {
  PrismaClient,
  DetailTypeEnum,
  MasterRecordStatusEnum,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Service Order seed...');

  // Check if company exists
  const company = await prisma.sys_Company.findFirst({
    where: { name: { contains: 'Bengkel' } },
  });

  if (!company) {
    console.log('❌ Company not found. Please run main seed first.');
    return;
  }

  console.log(`✅ Found company: ${company.name}`);

  // Check if we need to create document numbering for Service Order
  const docNumber = await prisma.sys_DocumentNumber.findUnique({
    where: {
      company_id_counterCode: {
        company_id: company.id,
        counterCode: 'SO',
      },
    },
  });

  if (!docNumber) {
    await prisma.sys_DocumentNumber.create({
      data: {
        company_id: company.id,
        branch_id: 'BR001',
        counterCode: 'SO',
        description: 'Service Order',
        module: 'SERVICE',
        prefix: 'SO',
        delimiter: '/',
        includeYear: true,
        includeMonth: true,
        startNumber: 1,
        currentNumber: 0,
        sequenceLength: 5,
        resetAt: 'MONTH',
        format: '{CODE}/{YYYY}/{MM}/{SEQ}',
        sampleOutput: 'SO/2025/10/00001',
        iStatus: MasterRecordStatusEnum.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('✅ Created Service Order document numbering');
  }

  // Create dummy customer and vehicle if not exists
  let customer = await prisma.cmf_Customer.findFirst({
    where: {
      company_id: company.id,
      name: { contains: 'Test Customer' },
    },
  });

  if (!customer) {
    customer = await prisma.cmf_Customer.create({
      data: {
        company_id: company.id,
        branch_id: 'BR001',
        id: 'CUST-001',
        name: 'Test Customer',
        mobile1: '081234567890',
        email: 'testcustomer@example.com',
        iStatus: MasterRecordStatusEnum.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('✅ Created test customer');
  }

  // Create vehicle type, brand, and model if not exist
  let vehicleType = await prisma.wks_VehicleType.findUnique({
    where: { id: 'VT001' },
  });

  if (!vehicleType) {
    vehicleType = await prisma.wks_VehicleType.create({
      data: {
        id: 'VT001',
        name: 'Mobil',
        iStatus: MasterRecordStatusEnum.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  let vehicleBrand = await prisma.wks_VehicleBrand.findFirst({
    where: {
      vehicleType_id: 'VT001',
      name: 'Toyota',
    },
  });

  if (!vehicleBrand) {
    vehicleBrand = await prisma.wks_VehicleBrand.create({
      data: {
        id: 'BRAND-001',
        vehicleType_id: 'VT001',
        name: 'Toyota',
        iStatus: MasterRecordStatusEnum.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  let vehicleModel = await prisma.wks_VehicleModel.findFirst({
    where: {
      vehicleType_id: 'VT001',
      brand_id: vehicleBrand.id,
      name: 'Avanza',
    },
  });

  if (!vehicleModel) {
    vehicleModel = await prisma.wks_VehicleModel.create({
      data: {
        id: 'MODEL-001',
        vehicleType_id: 'VT001',
        brand_id: vehicleBrand.id,
        name: 'Avanza',
        iStatus: MasterRecordStatusEnum.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // Create customer vehicle
  let customerVehicle = await prisma.cmf_CustomerVehicle.findFirst({
    where: {
      company_id: company.id,
      customer_id: customer.id,
      licensePlate: 'B 1234 XYZ',
    },
  });

  if (!customerVehicle) {
    customerVehicle = await prisma.cmf_CustomerVehicle.create({
      data: {
        company_id: company.id,
        branch_id: 'BR001',
        customer_id: customer.id,
        id: 'VEH-001',
        vehicleType_id: 'VT001',
        brand_id: vehicleBrand.id,
        model_id: vehicleModel.id,
        licensePlate: 'B 1234 XYZ',
        vehicleYear: 2020,
        color: 'Silver',
        currentOdometer: 50000,
        iStatus: MasterRecordStatusEnum.Active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('✅ Created test vehicle');
  }

  // Check if service order already exists
  const existingOrder = await prisma.wks_ServiceOrder.findFirst({
    where: {
      company_id: company.id,
      orderNumber: 'SO/2025/10/00001',
    },
  });

  if (existingOrder) {
    console.log('✅ Service Order already exists, skipping...');
    return;
  }

  // Create a service order
  const serviceOrder = await prisma.wks_ServiceOrder.create({
    data: {
      id: 'SO001',
      orderNumber: 'SO/2025/10/00001',
      orderDate: new Date(),
      company_id: company.id,
      branch_id: 'BR001',
      customer_id: customer.id,
      customerVehicle_id: customerVehicle.id,
      vehicle_customer_id: customer.id,
      odometerIn: 50000,
      fuelLevel: 'HALF',
      vehicleConditionNotes: 'Kendaraan masih bersih, tidak ada goresan',
      customerComplaint: 'Mesin agak kasar, rem bunyi',
      serviceRequest: 'Perlu ganti oli dan kampas rem',
      priority: 'NORMAL',
      orderStatus: 'CONFIRMED',
      paymentStatus: 'UNPAID',
      serviceCost: 350000,
      partsCost: 1065000,
      totalAmount: 1415000,
      iStatus: MasterRecordStatusEnum.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Created service order:', serviceOrder.orderNumber);

  // Create service order details
  const details = [
    {
      id: 'SOD001',
      serviceOrder_id: serviceOrder.id,
      company_id: company.id,
      branch_id: 'BR001',
      lineNumber: 1,
      detailType: DetailTypeEnum.SERVICE,
      serviceName: 'Ganti Oli Mesin',
      serviceDescription: 'Ganti oli mesin mobil',
      quantity: 1,
      unitPrice: 150000,
      subtotal: 150000,
      iStatus: MasterRecordStatusEnum.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'SOD002',
      serviceOrder_id: serviceOrder.id,
      company_id: company.id,
      branch_id: 'BR001',
      lineNumber: 2,
      detailType: DetailTypeEnum.PART,
      partName: 'Shell Helix HX7 5W-30 4L',
      quantity: 1,
      unitPrice: 350000,
      subtotal: 350000,
      iStatus: MasterRecordStatusEnum.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'SOD003',
      serviceOrder_id: serviceOrder.id,
      company_id: company.id,
      branch_id: 'BR001',
      lineNumber: 3,
      detailType: DetailTypeEnum.PART,
      partName: 'Filter Oli Toyota',
      quantity: 1,
      unitPrice: 65000,
      subtotal: 65000,
      iStatus: MasterRecordStatusEnum.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'SOD004',
      serviceOrder_id: serviceOrder.id,
      company_id: company.id,
      branch_id: 'BR001',
      lineNumber: 4,
      detailType: DetailTypeEnum.SERVICE,
      serviceName: 'Ganti Kampas Rem',
      serviceDescription: 'Ganti kampas rem depan',
      quantity: 1,
      unitPrice: 200000,
      subtotal: 200000,
      iStatus: MasterRecordStatusEnum.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'SOD005',
      serviceOrder_id: serviceOrder.id,
      company_id: company.id,
      branch_id: 'BR001',
      lineNumber: 5,
      detailType: DetailTypeEnum.PART,
      partName: 'Kampas Rem Depan Avanza',
      quantity: 2,
      unitPrice: 325000,
      subtotal: 650000,
      iStatus: MasterRecordStatusEnum.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await prisma.wks_ServiceOrderDetail.createMany({
    data: details,
  });

  console.log(`✅ Created ${details.length} service order details`);

  console.log('✅ Service Order seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
