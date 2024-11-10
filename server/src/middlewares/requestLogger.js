export default async (ctx, next) => {
    const timeStamp = `${(new Date()).toLocaleDateString('en-GB')} ${(new Date()).toLocaleTimeString('en-GB')}`;
    console.log(`${timeStamp} ${ctx.request.method} '${ctx.request.url}' ${JSON.stringify(ctx.request.body)}`);
    await next();
};
