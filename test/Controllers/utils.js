export const hasData = (dataLen,datas)=>{
    return (res)=>{
        if(dataLen===1){
            res.body.should.be.instanceof(Object);
            for(const data of datas){
                res.body.should.have.property(data);
            }
        }else if(dataLen>1){
            res.body.should.be.instanceof(Array);
            res.body.should.have.length(dataLen);
            for(const obj of res.body){
                for(const data of datas){
                obj.should.have.property(data);
                }
            }
        }
        
    }
}