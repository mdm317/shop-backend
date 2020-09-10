import prisma from '../db';

let orderCount = 0;
export const addOrderController = async(req,res)=>{
    //날짜로 오더넘버 만들기
    const today = new Date();   
    let orderNumber="";
    orderNumber += today.getFullYear();
    orderNumber += today.getMonth()<"10"?"0"+today.getMonth():today.getMonth() + 1;
    orderNumber += today.getDate()<"10"?"0"+today.getDate():today.getDate();
    orderNumber += orderCount;
    //프로덕트 외부키 많이 연결하기?
    const {productIds} = req.body;
    const ids = productIds.map(id=>{
        return {id}
    });
    const order = await prisma.order.create({
        data:{
            orderNumber,
            user:{
                connect:{
                    id:req.user.id
                }
            },
            products:{
                connect:ids
            }
        },
        include:{
            products:true
        }
    });
    productIds.forEach(async(productId)=>{
        await prisma.userBuyProduct.create({
            data:{
                product:{
                    connect:{
                        id:productId
                    }
                },
                user:{
                    connect:{
                        id:req.user.id
                    }
                }
            }
        })
    })
   

    orderCount = (orderCount+1)%10000;
    return res.status(200).json(order);
}

