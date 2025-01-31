"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const middlewares_1 = require("./middlewares");
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.default);
app.use("/*", middlewares_1.ErrorHandlerMiddleware.errorHandlerMiddleware);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server run ${port}`);
});
