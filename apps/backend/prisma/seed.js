"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
    const userPassword = await bcryptjs_1.default.hash('abdan123', 10);
    // Seed Admin
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
            role: client_1.Role.ADMIN,
            balance: 1000000.00, // Starting balance for admin
        },
    });
    // Seed User
    const user = await prisma.user.upsert({
        where: { username: 'abdan' },
        update: {},
        create: {
            username: 'abdan',
            password: userPassword,
            role: client_1.Role.USER,
            balance: 1000.00, // Starting balance for user
        },
    });
    console.log({ admin, user });
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
