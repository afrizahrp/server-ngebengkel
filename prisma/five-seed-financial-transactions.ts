import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting financial transactions seed...');
  console.log('📦 Seeding: ARM (AR Invoice, Payment), APM (AP Invoice, Payment), ACC (GL)');

  const company_id = 'NGB';
  const branch_id = 'MAIN';
  const createdBy = 'SEEDER';

  // Check if company exists
  const company = await prisma.sys_Company.findUnique({
    where: { id: company_id },
  });

  if (!company) {
    console.log('❌ Company not found. Please create company first.');
    return;
  }

  console.log(`✅ Found company: ${company.name}`);

  // Check if branch exists
  const branches = await prisma.sys_Branch.findMany({
    where: { id: branch_id, company_id },
  });

  const branch = branches.length > 0 ? branches[0] : null;

  if (!branch) {
    console.log('❌ Branch not found. Please create branch first.');
    return;
  }

  console.log(`✅ Found branch: ${branch.name}`);

  // Use transaction to ensure all or nothing
  await prisma.$transaction(
    async (tx) => {
      let seedCount = 0;

      // ============================================================
      // 1. SEED MASTER DATA YANG DIPERLUKAN
      // ============================================================
      console.log('\n📦 Creating transaction master data...');

      // PaymentMethod (selalu upsert karena bisa sudah ada dari seed lain)
      const paymentMethods = await Promise.all([
        tx.cmf_PaymentMethod.upsert({
          where: { id: 'PM001' },
          update: {},
          create: {
            id: 'PM001',
            name: 'Tunai',
            methodType: 'CASH',
            requireBankAccount: false,
            requireReference: false,
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.cmf_PaymentMethod.upsert({
          where: { id: 'PM002' },
          update: {},
          create: {
            id: 'PM002',
            name: 'Transfer Bank',
            methodType: 'BANK',
            requireBankAccount: true,
            requireReference: true,
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.cmf_PaymentMethod.upsert({
          where: { id: 'PM003' },
          update: {},
          create: {
            id: 'PM003',
            name: 'QRIS',
            methodType: 'QRIS',
            requireBankAccount: false,
            requireReference: true,
            seq: 3,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
      ]);
      seedCount += paymentMethods.length;
      console.log(`   ✅ Created ${paymentMethods.length} payment methods`);

      // COA (Chart of Accounts)
      const coas = await Promise.all([
        tx.acc_COA.upsert({
          where: { company_id_id: { company_id, id: '1-1000' } },
          update: {},
          create: {
            id: '1-1000',
            accountCode: '1-1000',
            accountName: 'Kas',
            accountType: 'ASSET',
            accountGroup: 'Current Asset',
            normalBalance: 'DEBIT',
            level: 1,
            isHeader: false,
            isCash: true,
            isActive: true,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.acc_COA.upsert({
          where: { company_id_id: { company_id, id: '1-2000' } },
          update: {},
          create: {
            id: '1-2000',
            accountCode: '1-2000',
            accountName: 'Bank BCA',
            accountType: 'ASSET',
            accountGroup: 'Current Asset',
            normalBalance: 'DEBIT',
            level: 1,
            isHeader: false,
            isBank: true,
            isActive: true,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.acc_COA.upsert({
          where: { company_id_id: { company_id, id: '4-1000' } },
          update: {},
          create: {
            id: '4-1000',
            accountCode: '4-1000',
            accountName: 'Pendapatan Service',
            accountType: 'REVENUE',
            accountGroup: 'Revenue',
            normalBalance: 'CREDIT',
            level: 1,
            isHeader: false,
            isActive: true,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.acc_COA.upsert({
          where: { company_id_id: { company_id, id: '1-3000' } },
          update: {},
          create: {
            id: '1-3000',
            accountCode: '1-3000',
            accountName: 'Piutang Usaha',
            accountType: 'ASSET',
            accountGroup: 'Current Asset',
            normalBalance: 'DEBIT',
            level: 1,
            isHeader: false,
            isAR: true,
            isActive: true,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.acc_COA.upsert({
          where: { company_id_id: { company_id, id: '2-1000' } },
          update: {},
          create: {
            id: '2-1000',
            accountCode: '2-1000',
            accountName: 'Hutang Usaha',
            accountType: 'LIABILITY',
            accountGroup: 'Current Liability',
            normalBalance: 'CREDIT',
            level: 1,
            isHeader: false,
            isAP: true,
            isActive: true,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += coas.length;
      console.log(`   ✅ Created ${coas.length} COAs`);

      // BankAccount
      const bankAccounts = await Promise.all([
        tx.acc_BankAccount.upsert({
          where: { company_id_id: { company_id, id: 'BNK001' } },
          update: {},
          create: {
            id: 'BNK001',
            coa_id: '1-2000',
            bankName: 'BCA',
            branchName: 'Cabang Jakarta Selatan',
            accountNumber: '1234567890',
            accountName: 'Ngebengkel Utama',
            currency: 'IDR',
            isDefault: true,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += bankAccounts.length;
      console.log(`   ✅ Created ${bankAccounts.length} bank accounts`);

      // TaxScheme
      const taxSchemes = await Promise.all([
        tx.cmf_TaxScheme.upsert({
          where: { company_id_id: { company_id, id: 'T1' } },
          update: {},
          create: {
            id: 'T1',
            schemeCode: 'T1',
            name: 'PPN 11%',
            taxType: 'SALES',
            category: 'VAT',
            isInclusive: false,
            defaultRate: 11.0,
            isDefault: true,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += taxSchemes.length;
      console.log(`   ✅ Created ${taxSchemes.length} tax schemes`);

      // ============================================================
      // 2. SEED ARM TRANSACTION (AR Invoice & Payment)
      // ============================================================
      console.log('\n📦 Creating ARM (Accounts Receivable) transactions...');

      // ARM Invoice
      const invoices = await Promise.all([
        tx.arm_Invoice.upsert({
          where: { company_id_id: { company_id, id: 'INV001' } },
          update: {},
          create: {
            id: 'INV001',
            invoiceNumber: 'INV/2025/01/0001',
            invoiceDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            transaction_type: 'INV',
            transaction_class: 'SALES',
            customer_id: 'CUST01',
            customerName: 'Agus Widodo',
            customerPhone: '081111111111',
            customerVehicle_id: 'VH001',
            vehicle_customer_id: 'CUST01',
            vehicleInfo: 'Toyota Avanza 2020 - B 1234 ABC',
            subtotalAmount: 1000000,
            taxPercent: 11,
            taxAmount: 110000,
            totalAmount: 1110000,
            paidAmount: 0,
            outstandingAmount: 1110000,
            invoiceStatus: 'DRAFT',
            paymentStatus: 'UNPAID',
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.arm_Invoice.upsert({
          where: { company_id_id: { company_id, id: 'INV002' } },
          update: {},
          create: {
            id: 'INV002',
            invoiceNumber: 'INV/2025/01/0002',
            invoiceDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
            transaction_type: 'INV',
            transaction_class: 'SALES',
            customer_id: 'CUST02',
            customerName: 'Indah Permata',
            customerPhone: '081111111112',
            customerVehicle_id: 'VH002',
            vehicle_customer_id: 'CUST02',
            vehicleInfo: 'Honda Jazz 2021 - D 5678 DEF',
            subtotalAmount: 1500000,
            taxPercent: 11,
            taxAmount: 165000,
            totalAmount: 1665000,
            paidAmount: 1665000,
            outstandingAmount: 0,
            invoiceStatus: 'APPROVED',
            paymentStatus: 'PAID',
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.arm_Invoice.upsert({
          where: { company_id_id: { company_id, id: 'INV003' } },
          update: {},
          create: {
            id: 'INV003',
            invoiceNumber: 'INV/2025/01/0003',
            invoiceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            transaction_type: 'INV',
            transaction_class: 'SALES',
            customer_id: 'CUST03',
            customerName: 'PT Transportasi Mandiri',
            customerPhone: '081111111113',
            customerVehicle_id: 'VH003',
            vehicle_customer_id: 'CUST03',
            vehicleInfo: 'Toyota Innova 2019 - B 9012 GHI',
            subtotalAmount: 2000000,
            taxPercent: 11,
            taxAmount: 220000,
            totalAmount: 2220000,
            paidAmount: 1000000,
            outstandingAmount: 1220000,
            invoiceStatus: 'APPROVED',
            paymentStatus: 'PARTIAL',
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += invoices.length;
      console.log(`   ✅ Created ${invoices.length} invoices`);

      // ARM Invoice Detail
      const invoiceDetails = await Promise.all([
        tx.arm_InvoiceDetail.upsert({
          where: { company_id_id: { company_id, id: 'IND001' } },
          update: {},
          create: {
            id: 'IND001',
            invoice_id: 'INV001',
            lineNumber: 1,
            itemType: 'SERVICE',
            item_id: 'ST001',
            itemCode: 'ST001',
            itemName: 'Service Berkala',
            quantity: 1,
            uom: 'PCS',
            unitPrice: 1000000,
            subtotal: 1000000,
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.arm_InvoiceDetail.upsert({
          where: { company_id_id: { company_id, id: 'IND002' } },
          update: {},
          create: {
            id: 'IND002',
            invoice_id: 'INV002',
            lineNumber: 1,
            itemType: 'SERVICE',
            item_id: 'ST002',
            itemCode: 'ST002',
            itemName: 'Ganti Oli',
            quantity: 1,
            uom: 'PCS',
            unitPrice: 1500000,
            subtotal: 1500000,
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.arm_InvoiceDetail.upsert({
          where: { company_id_id: { company_id, id: 'IND003' } },
          update: {},
          create: {
            id: 'IND003',
            invoice_id: 'INV003',
            lineNumber: 1,
            itemType: 'SERVICE',
            item_id: 'ST003',
            itemCode: 'ST003',
            itemName: 'Tune Up Mesin',
            quantity: 1,
            uom: 'PCS',
            unitPrice: 2000000,
            subtotal: 2000000,
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += invoiceDetails.length;
      console.log(`   ✅ Created ${invoiceDetails.length} invoice details`);

      // ARM Payment
      const payments = await Promise.all([
        tx.arm_Payment.upsert({
          where: { company_id_id: { company_id, id: 'PAY001' } },
          update: {},
          create: {
            id: 'PAY001',
            paymentNumber: 'PAY/2025/01/0001',
            paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            transaction_type: 'PAY',
            transaction_class: 'SALES',
            invoice_id: 'INV002',
            invoiceNumber: 'INV/2025/01/0002',
            customer_id: 'CUST02',
            customerName: 'Indah Permata',
            paymentMethod_id: 'PM001',
            referenceNumber: 'REF001',
            paymentAmount: 1665000,
            processingFee: 0,
            netAmount: 1665000,
            paymentStatus: 'VERIFIED',
            isPosted: true,
            postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.arm_Payment.upsert({
          where: { company_id_id: { company_id, id: 'PAY002' } },
          update: {},
          create: {
            id: 'PAY002',
            paymentNumber: 'PAY/2025/01/0002',
            paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            transaction_type: 'PAY',
            transaction_class: 'SALES',
            invoice_id: 'INV003',
            invoiceNumber: 'INV/2025/01/0003',
            customer_id: 'CUST03',
            customerName: 'PT Transportasi Mandiri',
            paymentMethod_id: 'PM002',
            referenceNumber: 'TRX1234567890',
            paymentAmount: 1000000,
            processingFee: 0,
            netAmount: 1000000,
            paymentStatus: 'VERIFIED',
            isPosted: true,
            postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.arm_Payment.upsert({
          where: { company_id_id: { company_id, id: 'PAY003' } },
          update: {},
          create: {
            id: 'PAY003',
            paymentNumber: 'PAY/2025/01/0003',
            paymentDate: new Date(),
            transaction_type: 'PAY',
            transaction_class: 'SALES',
            invoice_id: 'INV001',
            invoiceNumber: 'INV/2025/01/0001',
            customer_id: 'CUST01',
            customerName: 'Agus Widodo',
            paymentMethod_id: 'PM003',
            referenceNumber: 'QRIS20250101001',
            paymentAmount: 500000,
            processingFee: 0,
            netAmount: 500000,
            paymentStatus: 'PENDING',
            isPosted: false,
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += payments.length;
      console.log(`   ✅ Created ${payments.length} payments`);

      // ARM Payment Detail
      const paymentDetails = await Promise.all([
        tx.arm_PaymentDetail.upsert({
          where: { company_id_id: { company_id, id: 'PAYD001' } },
          update: {},
          create: {
            id: 'PAYD001',
            payment_id: 'PAY001',
            lineNumber: 1,
            description: 'Pembayaran invoice INV002',
            paymentMethod_id: 'PM001',
            amount: 1665000,
            referenceNumber: 'REF001',
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.arm_PaymentDetail.upsert({
          where: { company_id_id: { company_id, id: 'PAYD002' } },
          update: {},
          create: {
            id: 'PAYD002',
            payment_id: 'PAY002',
            lineNumber: 1,
            description: 'Pembayaran invoice INV003 - Partial',
            paymentMethod_id: 'PM002',
            amount: 1000000,
            referenceNumber: 'TRX1234567890',
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.arm_PaymentDetail.upsert({
          where: { company_id_id: { company_id, id: 'PAYD003' } },
          update: {},
          create: {
            id: 'PAYD003',
            payment_id: 'PAY003',
            lineNumber: 1,
            description: 'Pembayaran invoice INV001 - Partial',
            paymentMethod_id: 'PM003',
            amount: 500000,
            referenceNumber: 'QRIS20250101001',
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += paymentDetails.length;
      console.log(`   ✅ Created ${paymentDetails.length} payment details`);

      // ARM Cash Receipt
      const cashReceipts = await Promise.all([
        tx.arm_CashReceipt.upsert({
          where: { company_id_id: { company_id, id: 'CR001' } },
          update: {},
          create: {
            id: 'CR001',
            receiptNumber: 'CR/2025/01/0001',
            receiptDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            transaction_type: 'CR',
            transaction_class: 'CASH',
            receivedFrom: 'Indah Permata',
            receivedFromType: 'CUSTOMER',
            receivedFrom_id: 'CUST02',
            totalAmount: 1665000,
            receiptStatus: 'APPROVED',
            isPosted: true,
            postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            description: 'Pembayaran Service Ganti Oli',
            transactionStatus: 'POSTED',
            createdBy,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.arm_CashReceipt.upsert({
          where: { company_id_id: { company_id, id: 'CR002' } },
          update: {},
          create: {
            id: 'CR002',
            receiptNumber: 'CR/2025/01/0002',
            receiptDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            transaction_type: 'CR',
            transaction_class: 'CASH',
            receivedFrom: 'PT Transportasi Mandiri',
            receivedFromType: 'CUSTOMER',
            receivedFrom_id: 'CUST03',
            totalAmount: 1000000,
            receiptStatus: 'APPROVED',
            isPosted: true,
            postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            description: 'Pembayaran Tunai Tune Up - Partial',
            transactionStatus: 'POSTED',
            createdBy,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.arm_CashReceipt.upsert({
          where: { company_id_id: { company_id, id: 'CR003' } },
          update: {},
          create: {
            id: 'CR003',
            receiptNumber: 'CR/2025/01/0003',
            receiptDate: new Date(),
            transaction_type: 'CR',
            transaction_class: 'CASH',
            receivedFrom: 'Agus Widodo',
            receivedFromType: 'CUSTOMER',
            receivedFrom_id: 'CUST01',
            totalAmount: 500000,
            receiptStatus: 'DRAFT',
            isPosted: false,
            description: 'Pembayaran Service Berkala - Partial',
            transactionStatus: 'ENTRY',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += cashReceipts.length;
      console.log(`   ✅ Created ${cashReceipts.length} cash receipts`);

      // ============================================================
      // 3. SEED APM TRANSACTION (AP Invoice & Payment)
      // ============================================================
      console.log('\n📦 Creating APM (Accounts Payable) transactions...');

      // APM Invoice
      const apInvoices = await Promise.all([
        tx.apm_Invoice.upsert({
          where: { company_id_id: { company_id, id: 'APINV001' } },
          update: {},
          create: {
            id: 'APINV001',
            invoiceNumber: 'AP-INV/2025/01/0001',
            invoiceDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
            transaction_type: 'APINV',
            transaction_class: 'PURCHASE',
            supplier_id: 'SUP001',
            supplierName: 'CV Sparepart Jaya',
            supplierPhone: '02112345678',
            subtotalAmount: 5000000,
            taxPercent: 11,
            taxAmount: 550000,
            totalAmount: 5550000,
            paidAmount: 0,
            outstandingAmount: 5550000,
            invoiceStatus: 'APPROVED',
            paymentStatus: 'UNPAID',
            isPosted: true,
            postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.apm_Invoice.upsert({
          where: { company_id_id: { company_id, id: 'APINV002' } },
          update: {},
          create: {
            id: 'APINV002',
            invoiceNumber: 'AP-INV/2025/01/0002',
            invoiceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            transaction_type: 'APINV',
            transaction_class: 'PURCHASE',
            supplier_id: 'SUP002',
            supplierName: 'PT Distributor Otomotif',
            supplierPhone: '02187654321',
            subtotalAmount: 3000000,
            taxPercent: 11,
            taxAmount: 330000,
            totalAmount: 3330000,
            paidAmount: 3330000,
            outstandingAmount: 0,
            invoiceStatus: 'APPROVED',
            paymentStatus: 'PAID',
            isPosted: true,
            postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.apm_Invoice.upsert({
          where: { company_id_id: { company_id, id: 'APINV003' } },
          update: {},
          create: {
            id: 'APINV003',
            invoiceNumber: 'AP-INV/2025/01/0003',
            invoiceDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
            transaction_type: 'APINV',
            transaction_class: 'PURCHASE',
            supplier_id: 'SUP003',
            supplierName: 'CV Sumber Teknik',
            supplierPhone: '02155555555',
            subtotalAmount: 2000000,
            taxPercent: 11,
            taxAmount: 220000,
            totalAmount: 2220000,
            paidAmount: 1000000,
            outstandingAmount: 1220000,
            invoiceStatus: 'APPROVED',
            paymentStatus: 'PARTIAL',
            isPosted: true,
            postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += apInvoices.length;
      console.log(`   ✅ Created ${apInvoices.length} AP invoices`);

      // APM Payment
      const apPayments = await Promise.all([
        tx.apm_Payment.upsert({
          where: { company_id_id: { company_id, id: 'APP001' } },
          update: {},
          create: {
            id: 'APP001',
            paymentNumber: 'AP-PAY/2025/01/0001',
            paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            transaction_type: 'APPAY',
            transaction_class: 'PURCHASE',
            apInvoice_id: 'APINV002',
            invoiceNumber: 'AP-INV/2025/01/0002',
            supplier_id: 'SUP002',
            supplierName: 'PT Distributor Otomotif',
            paymentMethod_id: 'PM002',
            referenceNumber: 'TRX9876543210',
            paymentAmount: 3330000,
            processingFee: 0,
            netAmount: 3330000,
            paymentStatus: 'VERIFIED',
            isPosted: true,
            postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.apm_Payment.upsert({
          where: { company_id_id: { company_id, id: 'APP002' } },
          update: {},
          create: {
            id: 'APP002',
            paymentNumber: 'AP-PAY/2025/01/0002',
            paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            transaction_type: 'APPAY',
            transaction_class: 'PURCHASE',
            apInvoice_id: 'APINV003',
            invoiceNumber: 'AP-INV/2025/01/0003',
            supplier_id: 'SUP003',
            supplierName: 'CV Sumber Teknik',
            paymentMethod_id: 'PM001',
            referenceNumber: 'CASH001',
            paymentAmount: 1000000,
            processingFee: 0,
            netAmount: 1000000,
            paymentStatus: 'VERIFIED',
            isPosted: true,
            postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            transactionStatus: 'POSTED',
            isDeleted: false,
            createdBy,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.apm_Payment.upsert({
          where: { company_id_id: { company_id, id: 'APP003' } },
          update: {},
          create: {
            id: 'APP003',
            paymentNumber: 'AP-PAY/2025/01/0003',
            paymentDate: new Date(),
            transaction_type: 'APPAY',
            transaction_class: 'PURCHASE',
            apInvoice_id: 'APINV001',
            invoiceNumber: 'AP-INV/2025/01/0001',
            supplier_id: 'SUP001',
            supplierName: 'CV Sparepart Jaya',
            paymentMethod_id: 'PM002',
            referenceNumber: 'TRX9999888877',
            paymentAmount: 5550000,
            processingFee: 0,
            netAmount: 5550000,
            paymentStatus: 'PENDING',
            isPosted: false,
            transactionStatus: 'ENTRY',
            isDeleted: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += apPayments.length;
      console.log(`   ✅ Created ${apPayments.length} AP payments`);

      // ============================================================
      // 4. SEED ACC TRANSACTION (GL Transaction)
      // ============================================================
      console.log('\n📦 Creating ACC (GL Journal) transactions...');

      // ACC GLTrans
      const glTrans = await Promise.all([
        tx.acc_GLTrans.create({
          data: {
            id: 'GL001',
            journalNumber: 'JV/2025/01/0001',
            journalDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            transaction_type: 'JV',
            transaction_class: 'JOURNAL',
            description: 'Jurnal Pembayaran Customer Indah Permata',
            totalDebit: 1665000,
            totalCredit: 1665000,
            journalStatus: 'APPROVED',
            isPosted: true,
            postedBy: createdBy,
            postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            createdBy,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.acc_GLTrans.create({
          data: {
            id: 'GL002',
            journalNumber: 'JV/2025/01/0002',
            journalDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            transaction_type: 'JV',
            transaction_class: 'JOURNAL',
            description: 'Jurnal Pembayaran ke PT Distributor Otomotif',
            totalDebit: 3330000,
            totalCredit: 3330000,
            journalStatus: 'APPROVED',
            isPosted: true,
            postedBy: createdBy,
            postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            createdBy,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            updatedBy: createdBy,
            updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.acc_GLTrans.create({
          data: {
            id: 'GL003',
            journalNumber: 'JV/2025/01/0003',
            journalDate: new Date(),
            transaction_type: 'JV',
            transaction_class: 'JOURNAL',
            description: 'Jurnal Service Berkala Agus Widodo',
            totalDebit: 1110000,
            totalCredit: 1110000,
            journalStatus: 'DRAFT',
            isPosted: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += glTrans.length;
      console.log(`   ✅ Created ${glTrans.length} GL transactions`);

      // ACC GLTransDetail
      const glTransDetails = await Promise.all([
        tx.acc_GLTransDetail.create({
          data: {
            id: 'GLD001',
            glTrans_id: 'GL001',
            lineNumber: 1,
            coa_id: '1-1000',
            description: 'Kas - Pembayaran Customer',
            debitAmount: 1665000,
            creditAmount: 0,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.acc_GLTransDetail.create({
          data: {
            id: 'GLD002',
            glTrans_id: 'GL001',
            lineNumber: 2,
            coa_id: '1-3000',
            description: 'Piutang Usaha - Indah Permata',
            debitAmount: 0,
            creditAmount: 1665000,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.acc_GLTransDetail.create({
          data: {
            id: 'GLD003',
            glTrans_id: 'GL002',
            lineNumber: 1,
            coa_id: '2-1000',
            description: 'Hutang Usaha - PT Distributor',
            debitAmount: 3330000,
            creditAmount: 0,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.acc_GLTransDetail.create({
          data: {
            id: 'GLD004',
            glTrans_id: 'GL002',
            lineNumber: 2,
            coa_id: '1-2000',
            description: 'Bank BCA - Pembayaran Supplier',
            debitAmount: 0,
            creditAmount: 3330000,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            company_id,
            branch_id,
          },
        }),
        tx.acc_GLTransDetail.create({
          data: {
            id: 'GLD005',
            glTrans_id: 'GL003',
            lineNumber: 1,
            coa_id: '1-3000',
            description: 'Piutang Usaha - Agus Widodo',
            debitAmount: 1110000,
            creditAmount: 0,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.acc_GLTransDetail.create({
          data: {
            id: 'GLD006',
            glTrans_id: 'GL003',
            lineNumber: 2,
            coa_id: '4-1000',
            description: 'Pendapatan Service',
            debitAmount: 0,
            creditAmount: 1110000,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += glTransDetails.length;
      console.log(`   ✅ Created ${glTransDetails.length} GL transaction details`);

      console.log('\n✅ ✅ ✅ ALL FINANCIAL TRANSACTION SEED COMPLETED! ✅ ✅ ✅');
      console.log(`\n📊 Summary: ${seedCount} records created`);
      console.log(`   • Company ID: ${company_id}`);
      console.log(`   • Branch ID: ${branch_id}`);
      console.log(`   • Created By: ${createdBy}`);
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding financial transactions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

