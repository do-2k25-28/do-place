import { ResponseBody } from '@oak/oak/response';

export function httpError(
  message: string,
  additionalFields: Record<string, unknown> = {}
): ResponseBody {
  return {
    success: false,
    error: message,
    ...additionalFields,
  };
}
