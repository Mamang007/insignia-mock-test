"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ENDPOINTS = exports.TransferSchema = exports.TopupSchema = exports.LoginSchema = exports.RegisterSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['ADMIN', 'USER']).optional(),
    balance: zod_1.z.number().optional(),
});
exports.RegisterSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
});
exports.LoginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.TopupSchema = zod_1.z.object({
    amount: zod_1.z.number({
        required_error: 'Invalid topup amount',
        invalid_type_error: 'Invalid topup amount'
    })
        .min(1, 'Invalid topup amount')
        .max(10000000, 'Invalid topup amount'),
});
exports.TransferSchema = zod_1.z.object({
    toUsername: zod_1.z.string().min(3),
    amount: zod_1.z.number({
        required_error: 'Invalid Amount',
        invalid_type_error: 'Invalid Amount'
    })
        .min(1, 'Invalid Amount'),
});
exports.API_ENDPOINTS = {
    HEALTH: '/health',
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
    },
    WALLET: {
        BALANCE: '/wallet/balance',
        TOPUP: '/wallet/topup',
        TRANSFER: '/wallet/transfer',
        TRANSACTIONS: '/wallet/transactions',
    },
    STATS: {
        TOP_TRANSACTIONS: '/stats/top-transactions',
        TOP_USERS: '/stats/top-users',
    },
};
