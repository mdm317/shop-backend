import prisma from "../db"

export const addQuestionController = async(req,res)=>{
    const {content,productId} = req.body;
    if(!productId || req.user.isAdmin){
        return res.status(403).send('bad request');
    }
    const {id:userId} = req.user;
    const newQuestion =  await prisma.qna.create({data:{
        content,
        user:{
            connect:{
                id:userId
            }
        },
        product:{
            connect:{
                id:productId
            }
        }
    }});
    
    res.status(201).json(newQuestion);
}

export const addAnswerController = async(req,res)=>{
    if(!req.user || !req.user.isAdmin){
        return res.status(403).send('You must be admin')
    }
    
    const {content,qId,productId} = req.body;
    const question = await prisma.qna.findOne({
        where:{
            id:qId
        },
        include:{
            answer:true
        }
    });
    if(question.answerId){
        return res.status(403).send('exist answer');
    }
    const answer = await prisma.qna.create({
        data:{
            content,
            question:{
                connect:{
                    id:qId
                }
            },
            user:{
                connect:{
                    id:req.user.id
                }
            },
            product:{
                connect:{
                    id:productId
                }
            }
        },
        
    });
    res.status(201).json(answer);
}

export const editQnaController = async(req,res)=>{
    const {qId} = req.params;
    const {title, content} = req.body;
    const qna = await prisma.qna.findOne({
        where:{id:qId
        }
    });
    if(!qna || qna.userId !== req.user.id){
        return res.sendStatus(403);
    }
    const newQna = await prisma.qna.update({
        where:{
            id:qId
        },
        data:{
            title,
            content
        }
    });
    res.status(201).json(newQna);
};

export const getQnasController = async(req,res)=>{
    const qnas = await prisma.qna.findMany({
        where:{
            userId:req.user.id,
        },
        include:{
            answer:true,
            question:true,
            product:true
        }
    });
    return res.json(newQnas);
}
export const getQuestionController = async(req,res)=>{
    const {qnaId} = req.query;
    const qna = await prisma.qna.findOne({
        where:{
            id:qnaId
        },
        include:{
            product:{
                select:{
                    id:true
                }
            }
        }
    });
    // console.log(qna);
    return res.json(qna);
}
export const getQuestionByProduct = async(req,res)=>{
    const {productId} = req.query;
    const qnas = await prisma.qna.findMany({
        where:{
            productId
        },
        include:{
            user:true,
            answer:true,
            question:true,
        },
        orderBy:{
            createdAt:"desc"
        }
    });
    const newQnas = qnas.filter(qna=>
        qna.question===null
    );
    return res.status(201).json({productId,qnaList:newQnas});
}
export const getAllQnasController= async(req,res)=>{
    const qnas = await prisma.qna.findMany({
        include:{
            user:true,
            answer:true,
            question:true,
            product:{
                select:{
                    id:true
                }
            }
        },
        orderBy:{
            createdAt:"desc"
        }
    });
    const newQnas = qnas.filter(qna=>
        qna.question===null
    );
    return res.status(201).json(newQnas);
}