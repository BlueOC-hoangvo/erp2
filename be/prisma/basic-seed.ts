
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createBasicSampleData() {
  console.log("🌱 Creating basic sample data...");

  await prisma.$transaction(async (tx) => {
    // 1. Create Items (Materials)
    console.log("📦 Creating items...");
    
    const fabricItem = await tx.item.upsert({
      where: { sku: "FAB001" },
      update: {},
      create: {
        sku: "FAB001",
        name: "Cotton Fabric 30s",
        itemType: "FABRIC",
        baseUom: "meter",
        note: "Cotton fabric for shirt production",
      },
    });

    const threadItem = await tx.item.upsert({
      where: { sku: "ACC001" },
      update: {},
      create: {
        sku: "ACC001", 
        name: "Cotton Thread",
        itemType: "ACCESSORY",
        baseUom: "roll",
        note: "Thread for sewing",
      },
    });

    const buttonItem = await tx.item.upsert({
      where: { sku: "ACC002" },
      update: {},
      create: {
        sku: "ACC002",
        name: "Plastic Button 15mm",
        itemType: "ACCESSORY", 
        baseUom: "pcs",
        note: "Standard plastic buttons",
      },
    });

    const labelItem = await tx.item.upsert({
      where: { sku: "PAC001" },
      update: {},
      create: {
        sku: "PAC001",
        name: "Care Label",
        itemType: "PACKING",
        baseUom: "pcs", 
        note: "Washing instruction label",
      },
    });

    const polybagItem = await tx.item.upsert({
      where: { sku: "PAC002" },
      update: {},
      create: {
        sku: "PAC002",
        name: "Poly Bag 30x40cm",
        itemType: "PACKING",
        baseUom: "pcs",
        note: "Packaging bag",
      },
    });

    // 2. Create Product Styles
    console.log("👕 Creating product styles...");
    
    const basicShirt = await tx.productStyle.upsert({
      where: { code: "SH001" },
      update: {},
      create: {
        code: "SH001",
        name: "Basic Cotton Shirt",
        note: "Standard cotton shirt for men",
      },
    });

    const formalShirt = await tx.productStyle.upsert({
      where: { code: "SH002" },
      update: {},
      create: {
        code: "SH002", 
        name: "Formal Dress Shirt",
        note: "Premium formal shirt",
      },
    });

    // 3. Create BOM for Basic Cotton Shirt
    console.log("📋 Creating BOM for Basic Cotton Shirt...");
    
    const basicShirtBom = await tx.bom.upsert({
      where: { code: "BOM-SH001-001" },
      update: {},
      create: {
        code: "BOM-SH001-001",
        productStyleId: basicShirt.id,
        name: "Basic Shirt BOM v1.0",
      },
    });

    // Create BOM Lines with only essential fields
    console.log("  📝 Adding BOM lines...");
    
    await tx.bomLine.create({
      data: {
        bomId: basicShirtBom.id,
        itemId: fabricItem.id,
        uom: "meter",
        qtyPerUnit: 1.2,
        wastagePercent: 5.0,
      },
    });

    await tx.bomLine.create({
      data: {
        bomId: basicShirtBom.id,
        itemId: threadItem.id,
        uom: "roll",
        qtyPerUnit: 0.05,
        wastagePercent: 2.0,
      },
    });

    await tx.bomLine.create({
      data: {
        bomId: basicShirtBom.id,
        itemId: buttonItem.id,
        uom: "pcs",
        qtyPerUnit: 7,
        wastagePercent: 3,
      },
    });

    await tx.bomLine.create({
      data: {
        bomId: basicShirtBom.id,
        itemId: labelItem.id,
        uom: "pcs",
        qtyPerUnit: 1,
        wastagePercent: 0,
      },
    });

    await tx.bomLine.create({
      data: {
        bomId: basicShirtBom.id,
        itemId: polybagItem.id,
        uom: "pcs",
        qtyPerUnit: 1,
        wastagePercent: 0,
      },
    });

    // 4. Create Production Order
    console.log("🏭 Creating production order...");
    
    const productionOrder = await tx.productionOrder.create({
      data: {
        moNo: "MO-2025-001",
        productStyleId: basicShirt.id,
        qtyPlan: 100,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "RELEASED",
        note: "Sample production order for testing",
      },
    });

    // Create material requirements
    const bomLines = await tx.bomLine.findMany({
      where: { bomId: basicShirtBom.id },
      include: { item: true },
    });

    console.log("  📦 Creating material requirements...");
    for (const line of bomLines) {
      const qtyRequired = parseFloat(line.qtyPerUnit.toString()) * 100;
      const wastageQty = qtyRequired * (parseFloat(line.wastagePercent.toString()) / 100);
      const totalQty = qtyRequired + wastageQty;

      await tx.moMaterialRequirement.create({
        data: {
          productionOrderId: productionOrder.id,
          itemId: line.itemId,
          uom: line.uom,
          qtyRequired: totalQty,
          wastagePercent: line.wastagePercent,
        },
      });
    }

    // 5. Create customer and sales order
    console.log("👥 Creating customers and sales orders...");
    
    const customer = await tx.customer.upsert({
      where: { code: "CUS001" },
      update: {},
      create: {
        code: "CUS001",
        name: "ABC Fashion Store",
        taxCode: "123456789",
        phone: "0123456789",
        email: "abc@fashion.com",
        address: "123 Fashion Street, Ho Chi Minh City",
      },
    });

    const salesOrder = await tx.salesOrder.create({
      data: {
        orderNo: "SO-2025-001",
        customerId: customer.id,
        orderDate: new Date(),
        status: "CONFIRMED",
        note: "Sample sales order for testing BOM",
        items: {
          create: [
            {
              lineNo: 1,
              productStyleId: basicShirt.id,
              itemName: "Basic Cotton Shirt",
              qtyTotal: 50,
              unitPrice: 150000,
              amount: 7500000,
            },
          ],
        },
      },
    });

    // 6. Create sizes and colors
    console.log("📏 Creating sizes and colors...");
    
    const sizeS = await tx.size.upsert({
      where: { code: "S" },
      update: {},
      create: { code: "S", name: "Small" },
    });

    const sizeM = await tx.size.upsert({
      where: { code: "M" },
      update: {},
      create: { code: "M", name: "Medium" },
    });

    const sizeL = await tx.size.upsert({
      where: { code: "L" },
      update: {},
      create: { code: "L", name: "Large" },
    });

    const colorWhite = await tx.color.upsert({
      where: { code: "WHITE" },
      update: {},
      create: { code: "WHITE", name: "White" },
    });

    const colorBlue = await tx.color.upsert({
      where: { code: "BLUE" },
      update: {},
      create: { code: "BLUE", name: "Blue" },
    });

    // Create some product variants
    console.log("🎨 Creating product variants...");
    
    await tx.productVariant.create({
      data: {
        sku: "SH-S-WHITE",
        productStyleId: basicShirt.id,
        sizeId: sizeS.id,
        colorId: colorWhite.id,
      },
    });

    await tx.productVariant.create({
      data: {
        sku: "SH-M-BLUE",
        productStyleId: basicShirt.id,
        sizeId: sizeM.id,
        colorId: colorBlue.id,
      },
    });

    console.log("✅ Basic sample data created successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Items created: 5`);
    console.log(`- Product Styles: 2`);
    console.log(`- BOMs: ${await tx.bom.count()}`);
    console.log(`- BOM Lines: ${await tx.bomLine.count()}`);
    console.log(`- Production Orders: ${await tx.productionOrder.count()}`);
    console.log(`- Material Requirements: ${await tx.moMaterialRequirement.count()}`);
    console.log(`- Customers: ${await tx.customer.count()}`);
    console.log(`- Sales Orders: ${await tx.salesOrder.count()}`);
    console.log(`- Sales Order Items: ${await tx.salesOrderItem.count()}`);
    console.log(`- Sizes: ${await tx.size.count()}`);
    console.log(`- Colors: ${await tx.color.count()}`);
    console.log(`- Product Variants: ${await tx.productVariant.count()}`);

  });
}

createBasicSampleData()
  .catch((e) => {
    console.error("❌ Failed to create basic sample data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

