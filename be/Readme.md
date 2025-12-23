npm install
cấu hình .env
npx prisma generate
npx prisma migrate dev
npm run seed

npm run dev
const passwordHash = await bcrypt.hash("Admin@123", 10);
const adminUser = await prisma.user.upsert({
where: { email: "admin@erp.local" }, tk mk
