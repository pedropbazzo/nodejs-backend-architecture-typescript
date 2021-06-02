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
const ApiError_1 = require("../../../core/ApiError");
const BlogRepo_1 = __importDefault(require("../../../database/repository/BlogRepo"));
const mongoose_1 = require("mongoose");
const validator_1 = __importStar(require("../../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../../helpers/asyncHandler"));
const authentication_1 = __importDefault(require("../../../auth/authentication"));
const authorization_1 = __importDefault(require("../../../auth/authorization"));
const role_1 = __importDefault(require("../../../helpers/role"));
const router = express_1.default.Router();
/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token and Editor's Role
router.use('/', authentication_1.default, role_1.default("EDITOR" /* EDITOR */), authorization_1.default);
/*-------------------------------------------------------------------------*/
router.put('/publish/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!blog)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    blog.isDraft = false;
    blog.isSubmitted = false;
    blog.isPublished = true;
    blog.text = blog.draftText;
    if (!blog.publishedAt)
        blog.publishedAt = new Date();
    await BlogRepo_1.default.update(blog);
    return new ApiResponse_1.SuccessMsgResponse('Blog published successfully').send(res);
}));
router.put('/unpublish/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!blog)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    blog.isDraft = true;
    blog.isSubmitted = false;
    blog.isPublished = false;
    await BlogRepo_1.default.update(blog);
    return new ApiResponse_1.SuccessMsgResponse('Blog unpublished successfully').send(res);
}));
router.delete('/id/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!blog)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    blog.status = false;
    await BlogRepo_1.default.update(blog);
    return new ApiResponse_1.SuccessMsgResponse('Blog deleted successfully').send(res);
}));
router.get('/published/all', asyncHandler_1.default(async (req, res) => {
    const blogs = await BlogRepo_1.default.findAllPublished();
    return new ApiResponse_1.SuccessResponse('success', blogs).send(res);
}));
router.get('/submitted/all', asyncHandler_1.default(async (req, res) => {
    const blogs = await BlogRepo_1.default.findAllSubmissions();
    return new ApiResponse_1.SuccessResponse('success', blogs).send(res);
}));
router.get('/drafts/all', asyncHandler_1.default(async (req, res) => {
    const blogs = await BlogRepo_1.default.findAllDrafts();
    return new ApiResponse_1.SuccessResponse('success', blogs).send(res);
}));
router.get('/id/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!blog)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    if (!blog.isSubmitted && !blog.isPublished)
        throw new ApiError_1.ForbiddenError('This blog is private');
    new ApiResponse_1.SuccessResponse('success', blog).send(res);
}));
exports.default = router;
//# sourceMappingURL=editor.js.map