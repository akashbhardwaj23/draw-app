"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomSchema = exports.SignInInputs = exports.SignUpInputs = void 0;
var zod_1 = require("zod");
exports.SignUpInputs = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.SignInInputs = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.CreateRoomSchema = zod_1.z.object({
    name: zod_1.z.string()
});
