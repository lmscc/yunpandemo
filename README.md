## 基于nodejs和vue的云盘demo

## 1.项目简介

前端使用element-ui组件库

后端用nodejs写服务器，mongodb做数据库

前后端分离

**当未登录的时候**

- 只可以看到后台开放的资源列表
- 下载相应文件

**当登录以后**

- 可以看到所有文件
- 上传文件到服务器
- 可以设置文件是否开放
- 下载文件
- 登录的过期时间是10分钟，每次发请求会刷新过期时间

## 2.运行项目

先启动数据库moogodb的服务

**cilent文件夹**

1.npm install

2.npm run serve

**server文件夹**

1.npm install

2.node index.js

## 3.api接口

| 地址          | 方式 | 参数或载荷 | 作用               | 响应                      |
| ------------- | ---- | ---------- | ------------------ | ------------------------- |
| /             | get  | -          | 获取前端页面       | 前端页面./dist/index.html |
| /login        | post | psd        | 提交登录密码       | 1成功 0出错 2密码为空     |
| /logout       | get  | -          | 退出登录           | 1成功0出错                |
| /list         | get  | -          | 获取文件列表       | json                      |
| /publicchange | get  | filename   | 改变文件的开放状态 | 1成功0出错                |
| /delete       | get  | filename   | 删除文件           | 1成功0出错                |
| /up           | post | 二进制文件 | 上传文件           | 1成功0出错                |





