# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM node:14.16.1

# 配置环境变量
ENV NODE_ENV production

# 这个是容器中的文件目录
RUN mkdir -p /usr/src/app

# 设置工作目录
WORKDIR /usr/src/app

#创建一个具有指定名称的挂载点，定义的是容器内目录所在路径，在容器创建过程中会在容器中创建该目录，而宿主机上的对应的挂载目录名是随机生成的
VOLUME /usr/src/app/app/public

# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
COPY package.json /usr/src/app/package.json

# 安装npm依赖(使用淘宝的镜像源)
# 如果使用的境外服务器，无需使用淘宝的镜像源，即改为`RUN npm i`
RUN npm i --production --registry=https://registry.npm.taobao.org

# 拷贝所有源代码到工作目
COPY . /usr/src/app

# 暴露容器端口
EXPOSE 7001

CMD npm start

#应对单核服务器只开一个workers的窘境。加一个start.js判断，为单核服务器开2个workers。但是感觉还是有错误，表创建的时候会尝试常见两个超级管理员
#CMD npm run scripts:start