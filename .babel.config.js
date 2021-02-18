module.exports={
    presets:[
        ["@babel/preset-env",{
            targets:{
                ie:"11"
            },
            useBuiltIns:"usage",    
                //폴리필 es5로 변환불가능한 즉 promise 같은거에 import 를 추가해줌
                //아래에 그 임포트를 corejs 로 설정함
            corejs:{
                version:3
            }
        }],
    ],
    "plugins": ["transform-remove-console"]
}