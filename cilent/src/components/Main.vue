<template>
  <div>
    <el-form ref="form" v-show = '!islogin' label-width="80px">
        <el-form-item label="密码">
            <el-input v-model="password" show-password @keyup.enter = 'login'></el-input>
        </el-form-item>
        <el-button v-show = '!islogin' type="primary" @click = 'login'>登录</el-button>
    </el-form>
    <el-button v-show = 'islogin' type="" @click = 'logout'>退出</el-button>
    <div v-show = 'islogin'>
        <!-- <input type="file" name="file" value="请选择文件" multiple ref="file" id='choosed'>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="pre"></el-progress>
        <el-button type="primary" @click="submit">上传</el-button> -->
        <!-- <el-progress :text-inside="true" :stroke-width="26" :percentage="pre"></el-progress> -->
        <el-upload class="upload-demo" action="/up" drag multiple :auto-upload="false" :on-success = "handleSuccess" ref="upload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击选取</em></div>
        </el-upload>
         <el-button style="margin-left: 10px;" size="small" type="success" @click="$refs.upload.submit()">上传到服务器</el-button>
         <el-button style="margin-left: 10px;" size="small" type="primary" @click="$refs.upload.clearFiles()">清除文件列表</el-button>
    </div>
    <el-button type="primary" icon="el-icon-refresh-right" class='refresh'  @click="getList">刷新</el-button>

     <el-table :data="list" style="width: 100%" height="600">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="filename" label="文件名" width="180"> </el-table-column>
        <el-table-column prop="size"     label="大小" width="100"> </el-table-column>
        <el-table-column prop="update"   label="上传日期"> </el-table-column>
        <el-table-column    label="操作" width="120">
            <template slot-scope="scope">
                <a :href="'http://localhost:12/'+scope.row.filename" ><el-button type="text" size="small">下载</el-button></a>
                <div v-show = 'islogin'>
                    <el-button type="text" size="small" @click="deleteFile(scope.row.filename)">删除</el-button>
                    <el-button type="text" size="small" v-show = 'scope.row.ispublic' @click="cancel(scope.row.filename)">取消开放</el-button>
                    <el-button type="text" size="small" v-show = '!scope.row.ispublic' @click="open(scope.row.filename)">开放资源</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <div></div>
 </div>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            password:'',
            list:[],
            islogin:0,
            pre:0
        }
    },
    methods:{
        login(){
            axios.post('/login',{psd:this.password}).then(res=>{
                // console.log(res)
                if(res.data == 1){
                    this.islogin = 1
                    this.msg({message:'登录成功',type:'success',showClose: true,})
                    this.getList()
                }
                else if (res.data == 0){
                    alert('密码错误')
                }
            }).catch(err=>{
                return this.msg({message:err,type:'error',showClose: true,})
            })
        },
        logout(){
            axios.get('/logout').then(res=>{
                if(res.data == 1){
                    this.msg({message:'退出成功',type:'success',showClose: true,})
                    this.islogin = 0
                    this.getList()
                }else{
                    this.msg({message:'退出失败',type:'warning',showClose: true,})
                }
            }).catch(err=>{
                return this.msg({message:err,type:'error',showClose: true,})
            })
            
        },
        cancel(filename){
            axios.get('/publicchange?type=0&filename='+filename)
            .then(res=>{
                    if(res.data == 1){
                        this.list.forEach((item)=>{
                            if(item.filename === filename)
                            item.ispublic ^=1
                            })
                    }
                })
            .catch(err=>{
                return this.msg({message:err,type:'error',showClose: true,})
            })
            
            
        },
        open(filename){
            axios.get('/publicchange?type=1&filename='+filename).then(
               res=>{
                    if(res.data == 1){
                        this.list.forEach((item)=>{
                            if(item.filename === filename)
                            item.ispublic ^=1
                            })
                    }
                })
            .catch(err=>{
                return this.msg({message:err,type:'error',showClose: true,})
            })
        },
        deleteFile(filename){
            axios.get('/delete?filename='+filename).then(res=>{
                if(res.data == 1){
                    for(let i = 0;i < this.list.length;i++){
                        if(this.list[i].filename === filename){
                            this.list.splice(i,1)
                        }
                    }
                }else{
                    return this.msg({message:'删除失败',type:'error'})
                }
            }).catch(err=>{
                return this.msg({message:err,type:'error'})
            })
           
        },
        getList(){
            axios.get('/list').then(res=>{
                // console.log(res)
                res.data.forEach((item,index,arr)=>{
                    var realitem = arr[index]
                    if(realitem.size > 1024){
                        realitem.size = (realitem.size/1024).toFixed(2)
                        realitem.size += 'MB'
                    }else
                        realitem.size+='KB'
                })
                this.list = res.data
            }).catch(err=>{
                this.msg({message:err,type:'error',showClose: true,})
            }) 
        },
        handleSuccess(res,file,filelist){
            console.log('res----',res)
            // 清空上传进度数据
            if(res == '1'){
                // this.$refs.upload.clearFiles()
                // this.msg({message:'上传成功',type:'success',showClose: true})
                this.getList()
            }
          
        },
        submit(){          
                // //this.$refs.file DOM元素   this.$refs.file.files文件数组
                // const inputDOM = document.querySelector('.upload-demo input')
				// const fileArr = inputDOM.files
                // console.log(inputDOM,fileArr)
                // //若数组为空，结束
				// if(fileArr.length === 0){return}
                // //否则
				// var data = new FormData();

				// for(let i = 0 ;i < fileArr.length;i++){
				// 	data.append("file",fileArr[i])
				// }
				// console.dir(data)
                // //发送数据
				// axios.post("/up",data,
				// // 第1个参数 url 第二参数 data数据，第三个是配置渲染，
				// // onUploadProgress 当上传进度是
				// {onUploadProgress:e=>{
				// 	this.pre =Math.floor(e.loaded/e.total*100);
				// 	// e.loaded 已经上传的字节数据，e.total 字节数据  转换为1-100的比例值 赋值个pre	 
				// }}
				// )
				// .then(res=>{
				// 	console.log(res);
				// 	inputDOM.value="";
				// 	// 清空表单数据
				// 	this.pre = 0;
				// 	// 清空上传进度数据
                //     this.msg({message:'上传成功',type:'success',showClose: true})
                //     this.getList()

				// }).catch(err=>{
                //      this.msg({message:err,type:'error',showClose: true,})
                // })
        },
        msg(configObj){
            this.$message.closeAll()
            this.$message(configObj)
        }
    },
    mounted(){
        this.getList()
        this.login()
    }
};
</script>
    
<style>
.refresh{
        float:right;
        padding:3px !important
    }
</style>