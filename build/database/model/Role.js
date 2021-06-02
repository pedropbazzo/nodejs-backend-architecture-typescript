"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'Role';
exports.COLLECTION_NAME = 'roles';
const schema = new mongoose_1.Schema({
    code: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        enum: ["LEARNER" /* LEARNER */, "WRITER" /* WRITER */, "EDITOR" /* EDITOR */, "ADMIN" /* ADMIN */],
    },
    status: {
        type: mongoose_1.Schema.Types.Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        required: true,
        select: false,
    },
    updatedAt: {
        type: Date,
        required: true,
        select: false,
    },
}, {
    versionKey: false,
});
exports.RoleModel = mongoose_1.model(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=Role.js.map