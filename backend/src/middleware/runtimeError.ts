import { Status } from '@oak/commons/status';
import { Middleware } from '@oak/oak';

const runtimeErrorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.response.status = Status.InternalServerError;
    ctx.response.body = { success: false };

    console.error(error);
  }
};

export default runtimeErrorHandler;
