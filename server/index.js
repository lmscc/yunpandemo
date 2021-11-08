const express = require('express')
const fs = require('fs')
const path = require('path')
var app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'linshi')))
app.use(express.static(path.join(__dirname, 'views')))

const session = require('express-session')

// var mutipart= require('connect-multiparty');
// var mutipartMiddeware = mutipart();
// app.use(mutipart({uploadDir:'./linshi'}));

const formidable = require('formidable')
const database = require('./database')
app.use(session({
    name: 'session-id',
    secret: '12345-67890',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge:600*1000    /*过期时间  1000 对应1秒*/

    },   /*secure https这样的情况才可以访问cookie*/
    //设置过期时间比如是30分钟，只要游览页面，30分钟没有操作的话在过期
    rolling:true //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
  }))

app.get('/',(req,res)=>{
	res.render('./dist/index.html')
})
function renameFile(file){
    database.insert(file.originalFilename,file.size)
    let oldPath = file.filepath
    let dir = path.dirname(file.filepath)
    let newPath = path.join(dir,file.originalFilename) 
    // fs.rename(oldPath, newPath,function(err){
    //     if(err){
    //         console.log(err);
    //     }
    // });
    fs.renameSync(oldPath, newPath,function(err){
        if(err){
            console.log(err);
        }
    });
}
app.post('/up',function (req,res) {
    if(req.session.login !== true){
        return res.end('0')
    }
    console.log('收到post请求了')
    options = {
        multiples: true,
        uploadDir:'./linshi',
        keepExtensions :true,
        maxFileSize:99999999999
        // filter: function ({name, originalFilename, mimetype}) {
        //     // keep only images
        //     return mimetype && mimetype.includes("image");
        //   }
    }
    const form = formidable(options);
    form.parse(req, (err, fields, files) => {
        if (err){
            return console.log(err)
        }
        //把typeof([])认为是array是一个非常大的错误！！！！！！！！！！！！！！！！！！！！！！！！！
        //！！！！！！！！！！！！！！！！！！！！！！！！！
        //！！！！！！！！！！！！！！！！！！！其实是object
        // console.log(typeof(files.file))
        if(files.file.length === undefined){
            renameFile(files.file)
            res.end('1')
        }else{
            files.file = [files.file]
            files.file.forEach(
                (file)=>renameFile(file)
            )
            res.end('1')
        }
    })
});

app.get('/list',(req,res)=>{
    if(req.session.login !== true){
        database.userList().then((data,err)=>{
            res.end(JSON.stringify(data))
        })    
    }else{//已经登录
        database.adminList().then((data,err)=>{
            res.end(JSON.stringify(data))
        })
    }
})
app.get('/publicchange',(req,res)=>{
    if(req.session.login !== true){
        return res.end('0')
    }
    database.changepublic(req.query.filename,req.query.type)
    res.end('1')
})
app.get('/delete',(req,res)=>{
    if(req.session.login !== true){
        return res.end('0')
    }
    database.delete(req.query.filename)
    res.end('1')
})
app.post('/login',(req,res)=>{
    // res.setContentType("text/text;charset=utf-8"); 
    // res.setCharacterEncoding("UTF-8");
    if(req.session.login === true){
        return res.end('1')
    }
    if(req.body.psd == 156493251){
        req.session.login = true
        return res.end('1')
    }else if(req.body.psd == ''){
        return res.end('2')
    }else{
        return res.end('0')
    }
})
app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.end('1')
})

app.listen(12,()=>{console.log('listening in 12')})