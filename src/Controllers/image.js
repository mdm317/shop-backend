import express from 'express'


export const addImageController= (req,res)=>{
    const idx = req.params.idx;
    // console.log(req.files);
    res.json(req.files.map(v=>({url:v.location,idx})));
}