"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Blog_1 = require("../model/Blog");
class BlogRepo {
    static async create(blog) {
        const now = new Date();
        blog.createdAt = now;
        blog.updatedAt = now;
        const createdBlog = await Blog_1.BlogModel.create(blog);
        return createdBlog.toObject();
    }
    static update(blog) {
        blog.updatedAt = new Date();
        return Blog_1.BlogModel.updateOne({ _id: blog._id }, { $set: { ...blog } })
            .lean()
            .exec();
    }
    static findInfoById(id) {
        return Blog_1.BlogModel.findOne({ _id: id, status: true })
            .populate('author', this.AUTHOR_DETAIL)
            .lean()
            .exec();
    }
    static findInfoWithTextById(id) {
        return Blog_1.BlogModel.findOne({ _id: id, status: true })
            .select('+text')
            .populate('author', this.AUTHOR_DETAIL)
            .lean()
            .exec();
    }
    static findInfoWithTextAndDraftTextById(id) {
        return Blog_1.BlogModel.findOne({ _id: id, status: true })
            .select('+text +draftText +isSubmitted +isDraft +isPublished +status')
            .populate('author', this.AUTHOR_DETAIL)
            .lean()
            .exec();
    }
    static findBlogAllDataById(id) {
        return Blog_1.BlogModel.findOne({ _id: id, status: true })
            .select(this.BLOG_ALL_DATA)
            .populate('author', this.AUTHOR_DETAIL)
            .lean()
            .exec();
    }
    static findByUrl(blogUrl) {
        return Blog_1.BlogModel.findOne({ blogUrl: blogUrl, status: true })
            .select('+text')
            .populate('author', this.AUTHOR_DETAIL)
            .lean()
            .exec();
    }
    static findUrlIfExists(blogUrl) {
        return Blog_1.BlogModel.findOne({ blogUrl: blogUrl }).lean().exec();
    }
    static findByTagAndPaginated(tag, pageNumber, limit) {
        return Blog_1.BlogModel.find({ tags: tag, status: true, isPublished: true })
            .skip(limit * (pageNumber - 1))
            .limit(limit)
            .populate('author', this.AUTHOR_DETAIL)
            .sort({ updatedAt: -1 })
            .lean()
            .exec();
    }
    static findAllPublishedForAuthor(user) {
        return Blog_1.BlogModel.find({ author: user, status: true, isPublished: true })
            .populate('author', this.AUTHOR_DETAIL)
            .sort({ updatedAt: -1 })
            .lean()
            .exec();
    }
    static findAllDrafts() {
        return this.findDetailedBlogs({ isDraft: true, status: true });
    }
    static findAllSubmissions() {
        return this.findDetailedBlogs({ isSubmitted: true, status: true });
    }
    static findAllPublished() {
        return this.findDetailedBlogs({ isPublished: true, status: true });
    }
    static findAllSubmissionsForWriter(user) {
        return this.findDetailedBlogs({ author: user, status: true, isSubmitted: true });
    }
    static findAllPublishedForWriter(user) {
        return this.findDetailedBlogs({ author: user, status: true, isPublished: true });
    }
    static findAllDraftsForWriter(user) {
        return this.findDetailedBlogs({ author: user, status: true, isDraft: true });
    }
    static findDetailedBlogs(query) {
        return Blog_1.BlogModel.find(query)
            .select(this.BLOG_INFO_ADDITIONAL)
            .populate('author', this.AUTHOR_DETAIL)
            .populate('createdBy', this.AUTHOR_DETAIL)
            .populate('updatedBy', this.AUTHOR_DETAIL)
            .sort({ updatedAt: -1 })
            .lean()
            .exec();
    }
    static findLatestBlogs(pageNumber, limit) {
        return Blog_1.BlogModel.find({ status: true, isPublished: true })
            .skip(limit * (pageNumber - 1))
            .limit(limit)
            .populate('author', this.AUTHOR_DETAIL)
            .sort({ publishedAt: -1 })
            .lean()
            .exec();
    }
    static searchSimilarBlogs(blog, limit) {
        return Blog_1.BlogModel.find({
            $text: { $search: blog.title, $caseSensitive: false },
            status: true,
            isPublished: true,
            _id: { $ne: blog._id },
        }, {
            similarity: { $meta: 'textScore' },
        })
            .populate('author', this.AUTHOR_DETAIL)
            .sort({ updatedAt: -1 })
            .limit(limit)
            .sort({ similarity: { $meta: 'textScore' } })
            .lean()
            .exec();
    }
    static search(query, limit) {
        return Blog_1.BlogModel.find({
            $text: { $search: query, $caseSensitive: false },
            status: true,
            isPublished: true,
        }, {
            similarity: { $meta: 'textScore' },
        })
            .select('-status -description')
            .limit(limit)
            .sort({ similarity: { $meta: 'textScore' } })
            .lean()
            .exec();
    }
    static searchLike(query, limit) {
        return Blog_1.BlogModel.find({
            title: { $regex: `.*${query}.*`, $options: 'i' },
            status: true,
            isPublished: true,
        })
            .select('-status -description')
            .limit(limit)
            .sort({ score: -1 })
            .lean()
            .exec();
    }
}
exports.default = BlogRepo;
BlogRepo.AUTHOR_DETAIL = 'name profilePicUrl';
BlogRepo.BLOG_INFO_ADDITIONAL = '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
BlogRepo.BLOG_ALL_DATA = '+text +draftText +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';
//# sourceMappingURL=BlogRepo.js.map