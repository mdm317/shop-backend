import prisma from "../db"

export const addQuestionController = async(req,res)=>{
    const {title,content,productId} = req.body;
    
    if(!productId){
        return res.status(403).send('bad request');
    }
    const {id:userId} = req.user;
    const newQuestion =  await prisma.qna.create({data:{
        title,
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
        return res.sendStatus(403);
    }
    
    const {title,content,qId,productId} = req.body;
    console.log(req.body);
    const answer = await prisma.qna.create({
        data:{
            title,
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
            userId:req.user.id
        }
    });
    return res.json(qnas);
}