const {db} = require("../model/db")

exports.registerShop = async (req, res, next) => {
    try {
        
        console.log('Incoming Request Body:', req.body); // Log the request body

        const shopsData = req.body

        


        // const sellersExist = await db.sellerss.count({ where: { id: sellerIds } }) === sellerIds.length;
        // console.log("+++++++++++sellersExist++++++++++++++++++",sellersExist);
        // const booksExist = await db.bookss.count({ where: { id: bookIds } }) === bookIds.length;
        // console.log("+++++++++++booksExist++++++++++++++++++",booksExist);

        // Bulk create shops
        const createShops = await db.shops.create(shopsData);

        console.log("============= createShops ==============", createShops);

        return res.status(200).json({
            data: createShops,
            message: "Shops created successfully"
        });

    } catch (error) {
        console.log("====error====", error)
        return res.status(404).json({
            data: false,
            message: "not create shop"
        })
    }
}



