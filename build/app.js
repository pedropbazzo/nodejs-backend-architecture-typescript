"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Logger_1 = __importDefault(require("./core/Logger"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
require("./database"); // initialize database
const ApiError_1 = require("./core/ApiError");
const v1_1 = __importDefault(require("./routes/v1"));
process.on('uncaughtException', (e) => {
    Logger_1.default.error(e);
});
const app = express_1.default();
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors_1.default({ origin: config_1.corsUrl, optionsSuccessStatus: 200 }));
// Routes
app.use('/v1', v1_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => next(new ApiError_1.NotFoundError()));
// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        ApiError_1.ApiError.handle(err, res);
    }
    else {
        if (config_1.environment === 'development') {
            Logger_1.default.error(err);
            return res.status(500).send(err.message);
        }
        ApiError_1.ApiError.handle(new ApiError_1.InternalError(), res);
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map