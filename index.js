const express = require("express")
const app = express()
const path = require("path")
const db = require("./model/db")
const bodyParser = require("body-parser")
const sellerRouter = require("./routes/sellerRoutes")
const buyerRouter = require("./routes/buyerRoutes")
const shopRouter = require("./routes/shopRoutes")
const bookRouter = require("./routes/bookRoutes")
const orderRouter = require("./routes/orderRoutes")
// const config = require("config")

const env = require("dotenv")
env.config()

db.sequelize


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/sellerRouter",sellerRouter)
app.use("/buyerRouter",buyerRouter)
app.use("/shopRouter", shopRouter) 
app.use("/orderRoutes", orderRouter)
app.use("/bookRoutes",express.static("./upload/images"),bookRouter) 

app.get("/", (req, res) => {
    res.send(`express server connected http://localhost:${PORT_NUMBER}`)
})


const PORT_NUMBER = process.env.PORT_NUMBER
app.listen(PORT_NUMBER,() => {
    console.log(`localhost server connected successfully http://localhost:${PORT_NUMBER}`)
}) 