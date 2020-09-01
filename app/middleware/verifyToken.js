module.exports = ()=>{
    return async function (ctx, next){
        const ver = await ctx.helper.verifyToken()
        if(ver){
            await next()
        }
    }
}