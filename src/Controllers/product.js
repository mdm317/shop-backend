import prisma from '../db'


export const getProductsController = async(req,res)=>{
    try {
        const products = await prisma.product.findMany({});
        const notDeleteProducts = products.filter(pro=>
            pro.willDelete===false);
        res.json(notDeleteProducts);
    } catch (error) {
        console.log(error);
        throw error;
    }

}
export const addProductController = async(req,res)=>{

    const {body:{price,
        stock,
        description,
        thumbnail,
        imageUrl,
        name}}= req;
    try {
        const post = await prisma.product.create({data:{
            price,
            stock,
            description,
            thumbnail,
            imageUrl,
            name
        }});
        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error});
    }

}
export const willDeleteProductController = async(req,res)=>{
    const {productId} = req.query;
    const product = await prisma.product.update({
        data:{
            willDelete:true
        },
        where:{
            id:productId
        }
    });
    res.status(201).json(product);
}
export const deleteProductController = async(req,res)=>{
    res.sendStatus(403);

    const {productId} = req.query;//?
    try {
        await prisma.product.delete({
            where:{
                id:productId
            }
        });
        res.status(201).send('deleted');
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}
