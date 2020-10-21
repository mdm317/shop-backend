import prisma from '../db'


export const getProductsController = async(req,res)=>{
    try {
        const products = await prisma.product.findMany({
            include:{
                productImage:{
                    orderBy:{
                        idx:"asc"
                    }
                },
                reviews:{
                    include:{
                        user: true
                    }
                }
            }
        });
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
        imgUrls,
        name}}= req;
    const urls =[];
    for(let i=0;i<imgUrls.length;++i){
        if(i!=0){
            const img = imgUrls[i];
            urls.push({url:img.url,idx:Number(img.idx)});
        }
    }
    let newThumbnail;
    if(imgUrls[0].url){
        newThumbnail=imgUrls[0].url;
    }else{
        newThumbnail=imgUrls[1].url;
    }

    try {
        const product = await prisma.product.create({data:{
            price,
            stock,
            description,
            thumbnail:newThumbnail,
            name,
            productImage:{
                create:urls
                
            }}
            ,include:{
                productImage:true
            }
        });
        
        res.status(201).json(product);
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
export const editProductController = async(req,res)=>{
    const {id,price, stock, description, name,}=req.body;
    const product = await prisma.product.update({
        where:{
            id
        },
        data:{
            name,
            price,
            stock,
            description,
        },
        include:{
            productImage:true
        }
    });
    res.status(201).json(product);
}