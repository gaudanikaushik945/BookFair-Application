const db = require("../model/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { where, Model } = require("sequelize");
const { checkout } = require("../routes/bookRoutes");
require('dotenv').config();


exports.registerBuyer = async (req, res) => {
    try {
        const buyerEmail = await db.buyers.findOne({ where: { email: req.body.email } })
        console.log("------------buyerEmail--------------", buyerEmail)

        if (buyerEmail) {
            return res.status(400).json({
                data: false,
                message: "User with this email already available"
            });
        }
        const securePassword = await bcrypt.hash(req.body.password, 10)

        const buyerData = {
            name: req.body.name,
            email: req.body.email,
            password: securePassword
        }
        const createBuyer = await db.buyers.create(buyerData)

        return res.status(200).json({
            data: createBuyer,
            message: "buyer register successFully "
        })

    } catch (error) {
        console.log("error++++++++++++++++++++", error);
        return res.status(404).json({
            data: false,
            message: "user not register  enter your correct details"
        })
    }
}





exports.loginBuyer = async (req, res) => {
    try {
        const { email, password } = req.body
        const buyerData = await db.buyers.findOne({ where: {email: req.body.email} })
        console.log("------------buyerData--------------", buyerData)

        if (!buyerData) {
            return res.status(400).json({
                data: false,
                message: "email is not correct"
            });
        }
        const buyerPasswordMatch = await bcrypt.compare(password,buyerData.password)
        console.log("+++++++ buyerPasswordMatch +++++++++++++++", buyerPasswordMatch);
        if (!buyerPasswordMatch) {
            return res.status(400).json({
                data: false,
                message: "password is wrong"
            });
        }
        const privetKey = process.env.SECRECT_KEY

        const token =  jwt.sign({ id: buyerData.id, name: buyerData.name, email: buyerData.email }, privetKey, { expiresIn: 60 * 120 })

        return res.status(200).json({
            data: token,
            message: "buyer login successFully"
        })
    } catch (error) {
        console.log("==========error===========", error)
        return res.status(404).json({
            data: false,
            message: "user not login please try again"
        })
    }
}






exports.getOrderByIdBuyer = async (req, res) => {
    try {
        const getToken = tokenChek
        console.log("getToken++++++++++++++++++", getToken);
        const data = await db.buyers.findOne({ where: { id: req.query.id } })

        if (data.buyer_id !== getToken.id) {
            return res.status(403).json({
                data: false,
                message: "Unauthorized access"
            });
        }
        const data1 = await db.orders.findOne({
            where: { id: req.query.id },
            include:[{
                model: db.books
            },{
                model: db.shops
            },{
                model: db.buyers
            }]
        })

        console.log("+++++++++ data1 +++++++++++++", data1)


        return res.status(200).json({
            data: data1,
            message: "order data get successfullly"
        })
    } catch (error) {
        console.log("++++++++ error ++++++++++", error);
        return res.status(404).json({
            data: false,
            message: "book is not available seller"
        })
    }
}