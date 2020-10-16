import prisma from "../db"

export const putProductInController = async(req,res)=>{
    const {productId} = req.body;
    const basket = await prisma.basket.findMany({
        where:{
            userId:req.user.id
        },
        include:{
            products:true
        }
    });
    if(!basket.length){
        const productTobasket = await prisma.product.update({
            where:{
                id:productId
            },
            data:{
                baskets:{
                    create:{
                        user:{
                            connect:{
                                id:req.user.id
                            }
                        }
                    }
                }
            },
            include:{
                productImage:true
            }
        })
        console.log(productTobasket);
        res.status(201).json(productTobasket);
    }else if(basket.length===1){
        const probaskets = await prisma.product.findOne({
            where:{
                id:productId
            },
            include:{
                baskets:true
            }
        });
        let exist = 0;
        probaskets.baskets.forEach(basket=>{
            if(basket.id === basket.id){
                exist=1;
            }
        })
        if(exist){
            return res.status(200).send("");
        }
        const productTobasket = await prisma.product.update({
            where:{
                id:productId
            },
            data:{
                baskets:{
                    connect:{
                        id:basket[0].id
                    }
                }
            },
            include:{
                productImage:true
            }
        })
        res.status(201).json(productTobasket);
        //밑의 거랑 동작의 차이가 무어일까?
/*         console.log('basket', basket);
        const curBasket = basket[0];
        const pids = curBasket.products;
        let pidsArr = pids.map(pro=>{return{id:pro.id}});
        pidsArr.push({id:productId});
        console.log(pidsArr);
        await prisma.product.update({
            where:{
                id:productId
            },
            data:{
                baskets:{
                    connect:{
                        id:curBasket
                    }
                }
            }
        })
        const newBasket = await prisma.basket.update({
            where:{id:curBasket.id},
            data:{
                products:{
                    connect:pidsArr
                }
            },
            include:{
                products:true
            }
        });
        res.status(201).json(newBasket); */
        
    }

}

export const takeProductOutController = async(req,res)=>{
    const {productId} = req.body;
    const basket = await prisma.basket.findMany({
        where:{
            userId:req.user.id
        },
        include:{
            products:true
        }
    });
    if(basket.length!=1){
        return res.sendStatus(403);
    }
    if(basket[0].products.length==0){
        return res.sendStatus(403);
    }
    const newBasket = await prisma.basket.update({
        where:{
            id:basket.id,
            userId:req.user.id
        },
        data:{
            products:{
                disconnect:{
                    id:productId
                }
            }
        },
        include:{
            products:{
                include:{
                    productImage:true
                }
            }
        }
    });
    res.status(201).json(newBasket.products);
}