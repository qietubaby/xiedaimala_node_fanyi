### 声明文件一般都安装再开发环境里面

### 如何把ts项目变成js项目发布
- 全局安装typescript
- 使用tsc --init命令初始化生成tsconfig文件
- 在tsconfig中设置outDir
- 运行tsc -p .编译
### 如何发布到npm 
- 发布到npm的包只发布编译后的dist目录下
- 可以在package.json中进行配置
- 运行npm adduser 登录
- npm publish发布



##tsconfig中 noImplicitAny:true 意思是不允许你随便写代码，可以先改为false调试哪里有ts错误