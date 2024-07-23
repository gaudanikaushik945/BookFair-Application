// const multer = require("multer")
const { logger } = require("sequelize/lib/utils/logger");
const db = require("../model/db");
const { where } = require("sequelize");
const path = require("path")


exports.registerBooks = async (req, res) => {

    try {

        // console.log("+++++++++req.file+++++++=", req.file);
        const bookName = await db.books.findOne({ where: { name: req.body.name } })
        console.log("------------bookName--------------", bookName)

        if (bookName) {
            return res.status(400).json({
                data: false,
                message: "shop with this name already register"
            });
        }
        // const shop = await db.shopss.findByPk(req.body.shop_id);
        // if (shop) {
        //     return res.status(400).json({
        //         data: false,
        //         message: "Shop ID does not exist"
        //     });
        // }
        const bookData = {
            name: req.body.name,
            stock_count: req.body.stock_count,
            bookimage: req.file.filename,
            shop_id: req.body.shop_id
        }
        console.log("+++++++++++++++=", bookData);
        const createBooks = await db.books.create(bookData)
        console.log("==================+", createBooks)
        return res.status(200).json({
            data: createBooks,
            message: "book created successFully"
        })
    } catch (error) {
        console.log("******** error *********", error);
        return res.status(404).json({
            data: false,
            message: "not create"
        })
    }
}




exports.getAllBooks = async (req, res) => {
    try {
        const bookData = await db.books.findAll()
        return res.status(200).json({
            data: bookData,
            message: "Book Data collected successFully"
        })
    } catch (error) {
        console.log("+++++++++ error +++++++++++", error);
        return res.status(404).json({
            data: false,
            message: "Books data not collected"
        })
    }
}




exports.getBooksByIdBuyer = async (req, res) => {
    try {
        // const tokenVerify = tokenChek
        // const buyerData = await db.buyerss.findOne({ where: { id: tokenVerify.id } })
        // console.log("+++++++++++ buyerData +++++++++++", buyerData);

        const bookIdData = await db.books.findOne({ where: { id: req.params.id } ,
            include: {
                model: db.shops
            }
        })
        console.log("+++++++++++ bookIdData ++++++++++++++", bookIdData);


        await res.status(200).json({
            message: "id wise book data successFully"
        })
    } catch (error) {
        console.log("++++++ error ++++++++", error);
        return res.status.json({
            data: false,
            message: "book is not available"
        })
    }
}







exports.updateBookStock = async (req, res) => {
    try {


     const getbook = await db.books.increment(req.body,{where:{id: req.query.id}})
     console.log("********* getbook *********", getbook)
    const convertArrayToObject = Object.assign({},getbook[0][0][0]);
       
    
        const response = {
            data:convertArrayToObject,
            message: "updatedBook stock updated successFully"
        }
        
        console.log("+++++++++ response ++++++++", response)

        return res.status(200).json(response)

    } catch (error) {
        console.log("+++++++++ error +++++++++=", error);
        return res.status(404).json({
            data: false,
            message: "Books stock not updated"
        })
    }
}