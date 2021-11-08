const fs = require('fs')
var mongoose = require('mongoose'),
     DB_URL = 'mongodb://localhost:27017/filestore';
mongoose.connect(DB_URL);

mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + DB_URL);  
});    
Schema = mongoose.Schema;
var fileSchema = new Schema({          
    filename : { type: String },                    //用户账号
    size: {type: Number},                        //密码
    ispublic: {type: Boolean},                        //年龄
    update: {type: String}                      //最近登录时间
});
var Filemodel = mongoose.model('User',fileSchema)
module.exports.insert = function(filename,size){ 
    var newfile = {
        filename,                 //用户账号
        size:(size/1024).toFixed(2),             //单位是kb                            
        ispublic: false,                                //年龄
        update : new Date()                      //最近登录时间
    }  
    Filemodel.findOne({filename},(err,res)=>{
        if (err) {
            console.log("Error in findOne:" + err);
        }
        else {
            //没找到就直接写入
            if(res === null){
                new Filemodel(newfile)
                .save(function (err, res) {    
                    if (err) {
                        console.log("Error in save:" + err);
                    }
                    else {
                        console.log("Res:" + res);
                    }   
                });   
            }
            //找到就覆盖前一个
            else{
                Filemodel.replaceOne({filename},newfile,(err,res)=>{
                    if (err) {
                        console.log("Error in replaceOne:" + err);
                    }
                    else {
                        console.log("Res:" + res);
                    }  
                })
            }
        }
    })
}
module.exports.userList = function(){
    var opt = {'filename':1,'size':1,'update':1}
    return new Promise((resolve,reject)=>{
        Filemodel.find({ispublic : true},opt,(err,res)=>{
            if(err)
                return console.log('err in userlist' + err)      
            console.log('userList' + res);     
            resolve(res) 
        })
    }) 
}
module.exports.adminList = function(){
    var opt = {'filename':1,'size':1,'update':1,'ispublic':1}
    return new Promise((resolve,reject)=>{
        Filemodel.find({},opt,(err,res)=>{
            if(err)
                return console.log('err in adminList' + err)      
            resolve(res) 
        })
    }) 
}
module.exports.changepublic =function(filename,state){
    Filemodel.updateOne({filename},{ispublic:state},(err,data)=>{
        if(err) {console.log(err);res.end(0)}
    })
}
module.exports.delete = function(filename){
    Filemodel.deleteOne({filename},(err,res)=>{
        if(err) return console.log(err)
    })
    fs.unlink('./linshi/'+filename,(err)=>{
        if(err)return console.log(err)
    })
}