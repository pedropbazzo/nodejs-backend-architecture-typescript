"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiResponse_1 = require("../../../core/ApiResponse");
const UserRepo_1 = __importDefault(require("../../../database/repository/UserRepo"));
const ApiError_1 = require("../../../core/ApiError");
const mongoose_1 = require("mongoose");
const validator_1 = __importStar(require("../../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../../helpers/asyncHandler"));
const lodash_1 = __importDefault(require("lodash"));
const authentication_1 = __importDefault(require("../../../auth/authentication"));
const router = express_1.default.Router();
router.get('/public/id/:id', validator_1.default(schema_1.default.userId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const user = await UserRepo_1.default.findPublicProfileById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!user)
        throw new ApiError_1.BadRequestError('User not registered');
    return new ApiResponse_1.SuccessResponse('success', lodash_1.default.pick(user, ['name', 'profilePicUrl'])).send(res);
}));
/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', authentication_1.default);
/*-------------------------------------------------------------------------*/
router.get('/my', asyncHandler_1.default(async (req, res) => {
    const user = await UserRepo_1.default.findProfileById(req.user._id);
    if (!user)
        throw new ApiError_1.BadRequestError('User not registered');
    return new ApiResponse_1.SuccessResponse('success', lodash_1.default.pick(user, ['name', 'profilePicUrl', 'roles'])).send(res);
}));
router.put('/', validator_1.default(schema_1.default.profile), asyncHandler_1.default(async (req, res) => {
    const user = await UserRepo_1.default.findProfileById(req.user._id);
    if (!user)
        throw new ApiError_1.BadRequestError('User not registered');
    if (req.body.name)
        user.name = req.body.name;
    if (req.body.profilePicUrl)
        user.profilePicUrl = req.body.profilePicUrl;
    await UserRepo_1.default.updateInfo(user);
    return new ApiResponse_1.SuccessResponse('Profile updated', lodash_1.default.pick(user, ['name', 'profilePicUrl', 'roles'])).send(res);
}));
exports.default = router;
//# sourceMappingURL=user.js.map