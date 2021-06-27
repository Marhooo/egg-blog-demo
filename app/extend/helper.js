const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const sendToWormhole = require("stream-wormhole")
const awaitStreamReady = require("await-stream-ready").write
const util = require("util")

module.exports = {
  //微信APIv3密钥解密微信平台证书加密公钥函数，解密出来的公钥放入'app/ca'
  //wechatApiV3Decrypt(){}

  //微信支付签名函数
  wechatPaySignCrypto(message) {
    const privateKeyCertificate = fs.readFileSync('app/ca/apiclient_key.pem')
    return crypto.createSign('sha256WithRSAEncryption').update(message).sign(privateKeyCertificate, "base64")    
  },

  //微信支付签名验证函数
  //wechatPayVerifyCrypto(){}

  //微信支付敏感参数信息加密，用微信平台证书解密公钥来加密
  // wechatPayEncrypt(plaintext){
  //   const publicCertificate = fs.readFileSync('app/ca/')
  //   return crypto.publicEncrypt({
  //     oaepHash: 'sha1',
  //     key: publicCertificate,
  //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //   }, Buffer.from(plaintext, 'utf8')).toString('base64');
  // },

  //微信支付敏感参数信息解密，用商户API私钥来解密
  // wechatPayDecrypt(ciphertext) {
  //   const privateKeyCertificate = fs.readFileSync('app/ca/apiclient_key.pem')
  //   return crypto.privateDecrypt({
  //     oaepHash: 'sha1',
  //     key: privateKeyCertificate,
  //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //   }, Buffer.from(ciphertext, 'base64')).toString('utf8');    
  // },

  // MD5 对密码和秘钥进行混合双重加密
  async cryptoMd5(password, key) {
    const hash1 = await crypto.createHash("md5").update(password).digest("hex");
    const hash2 = await crypto.createHash("md5").update(hash1 + key).digest("hex");
    return hash2;
  },

  // 处理失败响应
  error(status, code, message) {
    this.ctx.body = {
      code: code,
      data: {
        message
      }
    };
    this.ctx.status = status;
  },

  // 创建 Token
  createToken(data, expires, strTimer) {
    return this.app.jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: expires + " " + strTimer,
    });
  },

  // 获取 Token
  getAccessToken () {
    const bearerToken = this.ctx.request.header.authorization
    return bearerToken && bearerToken.replace("Bearer ", "")
  },

  // 校验 Token
  async verifyToken () {
    const that = this
    let backResult = false
    const token = this.getAccessToken()
    const verify = await function (token) {
      const result = {}
      that.app.jwt.verify(token, that.app.config.jwt.secret, function (err, decoded) {
        if (err) {
          result.verify = false
          result.message = err.message
        } else {
          result.verify = true
          result.message = decoded
        }
      })
      // console.log(result);
      return result
    }
    const verifyResult = verify(token)
    const tokenInfo = await this.ctx.service.admin.login.findToken(token)

    if (!verifyResult.verify) {
      // 2小时的 token 验证失败了
      if (tokenInfo) {
        // 能查到对应的 refresh_token
        if (!verify(tokenInfo.refresh_token).verify) {
          // 2小时的 token 验证失败了并且7天的 token 验证也失败了
          await this.error(401, 10000, "token身份认证失效,请重新登录")
        } else {
          // 2小时的 token 验证失败了,但是能查到对应的 refresh_token 并且在有效期内就重新生成新的 token
          const refresh_token = await this.createToken({ id: tokenInfo.uid }, "7", "days")
          const access_token = await this.createToken({ id: tokenInfo.uid }, "2", "hours")
          const { id, uid } = { id: tokenInfo.id, uid: tokenInfo.uid }
          await this.ctx.service.admin.login.saveToken({ id, uid, access_token, refresh_token })
          await this.error(200, 11000, access_token)

        }
      } else {
        // 2小时的 token 验证失败了并且查不到对应的 refresh_token
        await this.error(401, 10000, "token身份认证失效,请重新登录")
      }

    } else {
      if (tokenInfo) {
        // 2小时的 token 验证通过了并且可以查到对应的 refresh_token
        backResult = true
      } else {
        // 2小时的 token 验证通过了但是查不到对应的 refresh_token
        this.error(401, 10000, "该账号已在其他地方登陆,请重新登录")
      }
    }
    return backResult
  },


  // 上传图片
  async uploadImg () {
    let imgUrl
    // 获取 steam
    const stream = await this.ctx.getFileStream()
    // 上传基础目录
    const uploadBasePath = "app/public/upload/"
    // 生成文件名
    const filename = Date.now() + "" + Number.parseInt(Math.random() * 10000) + path.extname(stream.filename)
    // 生成文件夹
    const dirName = dayjs(Date.now()).format("YYYYMMDD")
    if (!fs.existsSync(path.join(this.config.baseDir, uploadBasePath, dirName))){
      fs.mkdirSync(path.join(this.config.baseDir, uploadBasePath, dirName))
    }
    // 生成写入路径
    const target = path.join(this.config.baseDir, uploadBasePath, dirName, filename)
    // 写入流
    const writeStream = fs.createWriteStream(target)
    try {
      // 写入文件
      await awaitStreamReady(stream.pipe(writeStream))
      imgUrl = "http://" + this.ctx.request.header.host + "/public/upload/" + dirName + "/" + filename

    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream)
      throw err
    }
    return imgUrl
  },

  //下载文件
  async download(fp, name) {
    const filePath = path.join(this.config.baseDir, fp);
    this.ctx.attachment(name);
    const fileSize = (await util.promisify(fs.stat)(filePath)).size; //异步读取文件大小
    this.ctx.set('Content-Type', 'application/octet-stream');
    this.ctx.set('Content-Length', fileSize);
    this.ctx.body = fs.createReadStream(filePath);
  }

};
