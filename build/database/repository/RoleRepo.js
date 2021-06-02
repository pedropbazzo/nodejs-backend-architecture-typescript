"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = require("../model/Role");
class RoleRepo {
    static findByCode(code) {
        return Role_1.RoleModel.findOne({ code: code, status: true }).lean().exec();
    }
}
exports.default = RoleRepo;
//# sourceMappingURL=RoleRepo.js.map