import express, { Application } from "express";
const app: Application = express()
import dotenv from "dotenv"
import router from "./routes";
import cors from "cors"
import { ErrorHandlerMiddleware } from "./middlewares";
dotenv.config()

app.use(express.json())
app.use(cors({ origin: true, credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware)
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`server run ${port}`)
})


