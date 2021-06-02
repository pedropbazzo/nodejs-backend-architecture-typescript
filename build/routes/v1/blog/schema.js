"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validator_1 = require("../../../helpers/validator");
exports.default = {
    blogUrl: joi_1.default.object().keys({
        endpoint: validator_1.JoiUrlEndpoint().required().max(200),
    }),
    blogId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
    blogTag: joi_1.default.object().keys({
        tag: joi_1.default.string().required(),
    }),
    pagination: joi_1.default.object().keys({
        pageNumber: joi_1.default.number().required().integer().min(1),
        pageItemCount: joi_1.default.number().required().integer().min(1),
    }),
    authorId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
    blogCreate: joi_1.default.object().keys({
        title: joi_1.default.string().required().min(3).max(500),
        description: joi_1.default.string().required().min(3).max(2000),
        text: joi_1.default.string().required().max(50000),
        blogUrl: validator_1.JoiUrlEndpoint().required().max(200),
        imgUrl: joi_1.default.string().optional().uri().max(200),
        score: joi_1.default.number().optional().min(0).max(1),
        tags: joi_1.default.array().optional().min(1).items(joi_1.default.string().uppercase()),
    }),
    blogUpdate: joi_1.default.object().keys({
        title: joi_1.default.string().optional().min(3).max(500),
        description: joi_1.default.string().optional().min(3).max(2000),
        text: joi_1.default.string().optional().max(50000),
        blogUrl: validator_1.JoiUrlEndpoint().optional().max(200),
        imgUrl: joi_1.default.string().optional().uri().max(200),
        score: joi_1.default.number().optional().min(0).max(1),
        tags: joi_1.default.array().optional().min(1).items(joi_1.default.string().uppercase()),
    }),
};
//# sourceMappingURL=schema.js.map