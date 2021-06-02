"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (roleCode) => (req, res, next) => {
    req.currentRoleCode = roleCode;
    next();
};
//# sourceMappingURL=role.js.map