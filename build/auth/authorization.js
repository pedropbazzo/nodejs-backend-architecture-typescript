"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiError_1 = require("../core/ApiError");
const RoleRepo_1 = __importDefault(require("../database/repository/RoleRepo"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const router = express_1.default.Router();
exports.default = router.use(asyncHandler_1.default(async (req, res, next) => {
    if (!req.user || !req.user.roles || !req.currentRoleCode)
        throw new ApiError_1.AuthFailureError('Permission denied');
    const role = await RoleRepo_1.default.findByCode(req.currentRoleCode);
    if (!role)
        throw new ApiError_1.AuthFailureError('Permission denied');
    const validRoles = req.user.roles.filter((userRole) => userRole._id.toHexString() === role._id.toHexString());
    if (!validRoles || validRoles.length == 0)
        throw new ApiError_1.AuthFailureError('Permission denied');
    return next();
}));
//# sourceMappingURL=authorization.js.map