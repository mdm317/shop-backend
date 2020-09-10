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
        const newBasket = await prisma.basket.create({
            data:{
                user:{
                    connect:{
                        id:req.user.id
                    }
                },
                products:{
                    connect:{
                        id:productId
                    }
                }
            },
            include:{
                products:true
            }
        })
        res.status(201).json(newBasket);
    }else if(basket.length===1){
        const newProduct = await prisma.product.update({
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
        })
        const newBasket = await prisma.basket.findOne({
            where:{id:basket[0].id},
            include:{
                products:true
            }
        })
        res.status(201).json(newBasket);
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
    await prisma.product.update({
        where:{
            id:productId
        },
        data:{
            baskets:{
                disconnect:{
                    id:basket[0].id
                }
            }
        }
    });
    res.sendStatus(201);
}