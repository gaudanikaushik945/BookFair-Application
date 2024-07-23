const db = require("../model/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
require('dotenv').config();



exports.registerSeller = async (req, res) => {
    try {
        const sellerEmail = await db.sellers.findOne({ where: { email: req.body.email } })
        console.log("------------sellerEmail--------------", sellerEmail)

        if (sellerEmail) {
            return res.status(400).json({
                data: false,
                message: "seller with this email already register"
            });
        }
        const securePassword = await bcrypt.hash(req.body.password, 10)

        const sellerData = {
            name: req.body.name,
            email: req.body.email,
            password: securePassword
        }
        const createSeller = await db.sellers.create(sellerData)

        return res.status(200).json({
            data: createSeller,
            message: "seller register successFully"
        })

    } catch (error) {
        console.log("==========error===========", error)
        // if (error.name === 'ValidationError') {
        //     const messages = Object.values(error.errors).map(err => err.message);
        //     return res.status(400).json({ errors: messages });
        // } else {
        //    return res.status(500).json({ error: 'Internal Server Error' });
        // }
        return res.status(404).json({
            data: false,
            message: "user not register  enter your correct details"
        })
    }
}






exports.loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body
        const sellerData = await db.sellers.findOne({ where: { email } })
        console.log("------------sellerData--------------", sellerData)

        if (!sellerData) {
            return res.status(400).json({
                data: false,
                message: "email is not correct"
            });
        }
        const sellerPasswordMatch = await bcrypt.compare(password, sellerData.password)
        if (!sellerPasswordMatch) {
            return res.status(400).json({
                data: false,
                message: "password is wrong"
            });
        }
        const privetKey = process.env.SECRECT_KEY

        const token = jwt.sign({ id: sellerData.id, name: sellerData.name, email: sellerData.email }, privetKey, { expiresIn: 60 * 60 })

        return res.status(200).json({
            data: token,
            message: "seller login successFully"
        })


    } catch (error) {
        console.log("==========error===========", error)
        return res.status(404).json({
            data: false,
            message: "user not login please try again"
        })
    }
}





exports.getOrderByIdSeller = async (req, res) => {
    try {
        const data = await db.orders.findAll({
            where: { shop_id: req.query.shop_id },
            include: [{
                model: db.shopss
            },
            {
                model: db.buyers
            },
            ]
        })
        console.log("++++++++ data +++++++++++", data);

        // const filteredData = data.filter(order => order.books.length >= 0 || order.buyer === null);
        // console.log("------- filteredData ----------------",filteredData);
        // if (filteredData.length === 0) {
        //     return res.status(404).json({
        //         data: [],
        //         message: "No valid orders found for the given shop ID"
        //     });
        // }

        return res.status(200).json({
            data: data,
            message: "Order data fetched successfully"
        });
    } catch (error) {
        console.log("------ error ----------", error);

        return res.status(500).json({
            data: false,
            message: "An error occurred while fetching seller orders"
        });
    }
}



