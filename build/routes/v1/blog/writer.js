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
// Below all APIs are private APIs protected for writer's role
router.use('/', authentication_1.default, role_1.default("WRITER" /* WRITER */), authorization_1.default);
/*-------------------------------------------------------------------------*/
const formatEndpoint = (endpoint) => endpoint.replace(/\s/g, '').replace(/\//g, '-');
router.post('/', validator_1.default(schema_1.default.blogCreate), asyncHandler_1.default(async (req, res) => {
    req.body.blogUrl = formatEndpoint(req.body.blogUrl);
    const blog = await BlogRepo_1.default.findUrlIfExists(req.body.blogUrl);
    if (blog)
        throw new ApiError_1.BadRequestError('Blog with this url already exists');
    const createdBlog = await BlogRepo_1.default.create({
        title: req.body.title,
        description: req.body.description,
        draftText: req.body.text,
        tags: req.body.tags,
        author: req.user,
        blogUrl: req.body.blogUrl,
        imgUrl: req.body.imgUrl,
        score: req.body.score,
        createdBy: req.user,
        updatedBy: req.user,
    });
    new ApiResponse_1.SuccessResponse('Blog created successfully', createdBlog).send(res);
}));
router.put('/id/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), validator_1.default(schema_1.default.blogUpdate), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (blog == null)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    if (!blog.author._id.equals(req.user._id))
        throw new ApiError_1.ForbiddenError("You don't have necessary permissions");
    if (req.body.blogUrl) {
        const endpoint = formatEndpoint(req.body.blogUrl);
        const existingBlog = await BlogRepo_1.default.findUrlIfExists(endpoint);
        if (existingBlog)
            throw new ApiError_1.BadRequestError('Blog URL already used');
        if (req.body.blogUrl)
            blog.blogUrl = endpoint;
    }
    if (req.body.title)
        blog.title = req.body.title;
    if (req.body.description)
        blog.description = req.body.description;
    if (req.body.text)
        blog.draftText = req.body.text;
    if (req.body.tags)
        blog.tags = req.body.tags;
    if (req.body.imgUrl)
        blog.imgUrl = req.body.imgUrl;
    if (req.body.score)
        blog.score = req.body.score;
    await BlogRepo_1.default.update(blog);
    new ApiResponse_1.SuccessResponse('Blog updated successfully', blog).send(res);
}));
router.put('/submit/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!blog)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    if (!blog.author._id.equals(req.user._id))
        throw new ApiError_1.ForbiddenError("You don't have necessary permissions");
    blog.isSubmitted = true;
    blog.isDraft = false;
    await BlogRepo_1.default.update(blog);
    return new ApiResponse_1.SuccessMsgResponse('Blog submitted successfully').send(res);
}));
router.put('/withdraw/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!blog)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    if (!blog.author._id.equals(req.user._id))
        throw new ApiError_1.ForbiddenError("You don't have necessary permissions");
    blog.isSubmitted = false;
    blog.isDraft = true;
    await BlogRepo_1.default.update(blog);
    return new ApiResponse_1.SuccessMsgResponse('Blog withdrawn successfully').send(res);
}));
router.delete('/id/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!blog)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    if (!blog.author._id.equals(req.user._id))
        throw new ApiError_1.ForbiddenError("You don't have necessary permissions");
    if (blog.isPublished) {
        blog.isDraft = false;
        // revert to the original state
        blog.draftText = blog.text;
    }
    else {
        blog.status = false;
    }
    await BlogRepo_1.default.update(blog);
    return new ApiResponse_1.SuccessMsgResponse('Blog deleted successfully').send(res);
}));
router.get('/submitted/all', asyncHandler_1.default(async (req, res) => {
    const blogs = await BlogRepo_1.default.findAllSubmissionsForWriter(req.user);
    return new ApiResponse_1.SuccessResponse('success', blogs).send(res);
}));
router.get('/published/all', asyncHandler_1.default(async (req, res) => {
    const blogs = await BlogRepo_1.default.findAllPublishedForWriter(req.user);
    return new ApiResponse_1.SuccessResponse('success', blogs).send(res);
}));
router.get('/drafts/all', asyncHandler_1.default(async (req, res) => {
    const blogs = await BlogRepo_1.default.findAllDraftsForWriter(req.user);
    return new ApiResponse_1.SuccessResponse('success', blogs).send(res);
}));
router.get('/id/:id', validator_1.default(schema_1.default.blogId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const blog = await BlogRepo_1.default.findBlogAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!blog)
        throw new ApiError_1.BadRequestError('Blog does not exists');
    if (!blog.author._id.equals(req.user._id))
        throw new ApiError_1.ForbiddenError("You don't have necessary permissions");
    new ApiResponse_1.SuccessResponse('success', blog).send(res);
}));
exports.default = router;
//# sourceMappingURL=writer.js.map