/**
 * Created by hkx on 2016/11/17.
 */
import * as Koa from 'koa';

const app = new Koa();

app.use(async (ctx:Koa.Context)=>{
  ctx.body = 'hi koa2!'
});
app.listen(3000,()=>{
  console.log('start serve!')
});
