"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../model/User");
const Role_1 = require("../model/Role");
const ApiError_1 = require("../../core/ApiError");
const KeystoreRepo_1 = __importDefault(require("./KeystoreRepo"));
class UserRepo {
    // contains critical information of the user
    static findById(id) {
        return User_1.UserModel.findOne({ _id: id, status: true })
            .select('+email +password +roles')
            .populate({
            path: 'roles',
            match: { status: true },
        })
            .lean()
            .exec();
    }
    static findByEmail(email) {
        return User_1.UserModel.findOne({ email: email, status: true })
            .select('+email +password +roles')
            .populate({
            path: 'roles',
            match: { status: true },
            select: { code: 1 },
        })
            .lean()
            .exec();
    }
    static findProfileById(id) {
        return User_1.UserModel.findOne({ _id: id, status: true })
            .select('+roles')
            .populate({
            path: 'roles',
            match: { status: true },
            select: { code: 1 },
        })
            .lean()
            .exec();
    }
    static findPublicProfileById(id) {
        return User_1.UserModel.findOne({ _id: id, status: true }).lean().exec();
    }
    static async create(user, accessTokenKey, refreshTokenKey, roleCode) {
        const now = new Date();
        const role = await Role_1.RoleModel.findOne({ code: roleCode })
            .select('+email +password')
            .lean()
            .exec();
        if (!role)
            throw new ApiError_1.InternalError('Role must be defined');
        user.roles = [role._id];
        user.createdAt = user.updatedAt = now;
        const createdUser = await User_1.UserModel.create(user);
        const keystore = await KeystoreRepo_1.default.create(createdUser._id, accessTokenKey, refreshTokenKey);
        return { user: createdUser.toObject(), keystore: keystore };
    }
    static async update(user, accessTokenKey, refreshTokenKey) {
        user.updatedAt = new Date();
        await User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
            .lean()
            .exec();
        const keystore = await KeystoreRepo_1.default.create(user._id, accessTokenKey, refreshTokenKey);
        return { user: user, keystore: keystore };
    }
    static updateInfo(user) {
        user.updatedAt = new Date();
        return User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
            .lean()
            .exec();
    }
}
exports.default = UserRepo;
//# sourceMappingURL=UserRepo.js.map