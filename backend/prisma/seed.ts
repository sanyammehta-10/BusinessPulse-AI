import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('Demo@12345', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@businesspulse.ai' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@businesspulse.ai',
      passwordHash,
      emailVerified: true,
    },
  });

  console.log(`✅ User created: ${user.email}`);

  // Create demo business
  const business = await prisma.business.create({
    data: {
      name: 'XYZ Electronics',
      industry: 'Retail',
      businessType: 'Electronics',
      businessSize: 'SMALL',
      employeeCount: 25,
      branchCount: 2,
      currency: 'INR',
      financialYearStart: 4,
      onboardingComplete: true,
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
  });

  console.log(`✅ Business created: ${business.name}`);

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        businessId: business.id,
        name: 'Main Store',
        city: 'Delhi',
        state: 'Delhi',
        type: 'STORE',
      },
    }),
    prisma.location.create({
      data: {
        businessId: business.id,
        name: 'Branch 2',
        city: 'Noida',
        state: 'Uttar Pradesh',
        type: 'STORE',
      },
    }),
  ]);

  console.log(`✅ ${locations.length} locations created`);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        businessId: business.id,
        name: 'Laptop Pro X1',
        category: 'Laptops',
        costPrice: 45000,
        sellingPrice: 65000,
        stockQty: 50,
        unit: 'piece',
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        name: 'Wireless Mouse',
        category: 'Accessories',
        costPrice: 400,
        sellingPrice: 999,
        stockQty: 500,
        unit: 'piece',
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        name: 'LED Monitor 27"',
        category: 'Monitors',
        costPrice: 12000,
        sellingPrice: 19999,
        stockQty: 80,
        unit: 'piece',
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        name: 'Mechanical Keyboard',
        category: 'Accessories',
        costPrice: 2500,
        sellingPrice: 4999,
        stockQty: 200,
        unit: 'piece',
      },
    }),
    prisma.product.create({
      data: {
        businessId: business.id,
        name: 'USB-C Hub',
        category: 'Accessories',
        costPrice: 800,
        sellingPrice: 1999,
        stockQty: 300,
        unit: 'piece',
      },
    }),
  ]);

  console.log(`✅ ${products.length} products created`);

  // Create employees
  const departments = ['Sales', 'Engineering', 'Marketing', 'Operations', 'Finance'];
  const employees = [];

  for (let i = 0; i < 25; i++) {
    const dept = departments[i % departments.length];
    const salary = dept === 'Engineering' ? 55000 + Math.random() * 30000 : 25000 + Math.random() * 20000;

    employees.push(
      prisma.employee.create({
        data: {
          businessId: business.id,
          locationId: locations[i % 2].id,
          name: `Employee ${i + 1}`,
          department: dept,
          designation: i < 5 ? 'Manager' : 'Executive',
          salary: Math.round(salary),
          joiningDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        },
      }),
    );
  }

  await Promise.all(employees);
  console.log(`✅ 25 employees created`);

  // Create 12 months of sales data
  const salesData = [];
  const now = new Date();

  for (let month = 11; month >= 0; month--) {
    const date = new Date(now.getFullYear(), now.getMonth() - month, 1);
    const seasonalMultiplier = [10, 11, 12].includes(date.getMonth()) ? 1.4 : [6, 7].includes(date.getMonth()) ? 0.8 : 1;

    for (let day = 0; day < 20 + Math.floor(Math.random() * 10); day++) {
      const saleDate = new Date(date.getFullYear(), date.getMonth(), Math.floor(Math.random() * 28) + 1);
      const product = products[Math.floor(Math.random() * products.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const qty = Math.floor(Math.random() * 10) + 1;

      salesData.push({
        businessId: business.id,
        productId: product.id,
        locationId: location.id,
        date: saleDate,
        quantity: qty,
        unitPrice: Number(product.sellingPrice),
        totalAmount: qty * Number(product.sellingPrice) * seasonalMultiplier,
        customerCategory: ['Retail', 'Wholesale', 'Online'][Math.floor(Math.random() * 3)],
      });
    }
  }

  await prisma.sale.createMany({ data: salesData });
  console.log(`✅ ${salesData.length} sales records created`);

  // Create expense data
  const expenseCategories = ['SALARY', 'RENT', 'MARKETING', 'UTILITIES', 'TRANSPORTATION', 'INVENTORY', 'MAINTENANCE'];
  const expenseData = [];

  for (let month = 11; month >= 0; month--) {
    const date = new Date(now.getFullYear(), now.getMonth() - month, 1);

    for (const category of expenseCategories) {
      let baseAmount = 0;
      switch (category) {
        case 'SALARY': baseAmount = 750000; break;
        case 'RENT': baseAmount = 200000; break;
        case 'MARKETING': baseAmount = 100000; break;
        case 'UTILITIES': baseAmount = 30000; break;
        case 'TRANSPORTATION': baseAmount = 50000; break;
        case 'INVENTORY': baseAmount = 500000; break;
        case 'MAINTENANCE': baseAmount = 25000; break;
      }

      const amount = baseAmount * (0.9 + Math.random() * 0.2);
      const location = locations[Math.floor(Math.random() * locations.length)];

      expenseData.push({
        businessId: business.id,
        locationId: location.id,
        category,
        amount: Math.round(amount),
        date: new Date(date.getFullYear(), date.getMonth(), 15),
      });
    }
  }

  await prisma.expense.createMany({ data: expenseData });
  console.log(`✅ ${expenseData.length} expense records created`);

  // Create sample recommendations
  await prisma.recommendation.createMany({
    data: [
      {
        businessId: business.id,
        category: 'GROWTH',
        title: 'Increase inventory of Laptop Pro X1',
        description: 'Demand for Laptop Pro X1 has increased by 22% over the last 3 months. Current stock may run out in 2 weeks. Consider ordering additional units.',
        priority: 'HIGH',
      },
      {
        businessId: business.id,
        category: 'COST_REDUCTION',
        title: 'Salary expenses growing faster than revenue',
        description: 'Your total salary expenses have increased by 18% while revenue grew only 12%. Consider optimizing team size or improving productivity.',
        priority: 'MEDIUM',
      },
      {
        businessId: business.id,
        category: 'RISK_WARNING',
        title: 'Noida branch profitability declining',
        description: 'Branch 2 in Noida has seen a 15% decline in profit margin over the past quarter. Revenue is flat but expenses have increased.',
        priority: 'HIGH',
      },
    ],
  });

  console.log(`✅ Recommendations created`);

  // Create sample alerts
  await prisma.alert.createMany({
    data: [
      {
        businessId: business.id,
        type: 'SALES_DROP',
        title: 'Sales decreased 15% this week',
        message: 'Your weekly sales have dropped by 15% compared to the previous week. This may be seasonal or indicate a trend.',
        severity: 'WARNING',
      },
      {
        businessId: business.id,
        type: 'INVENTORY_LOW',
        title: 'Low stock: Wireless Mouse',
        message: 'Stock for Wireless Mouse is running low (12 units remaining). Reorder recommended.',
        severity: 'WARNING',
      },
    ],
  });

  console.log(`✅ Alerts created`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('📧 Demo login: demo@businesspulse.ai / Demo@12345');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
