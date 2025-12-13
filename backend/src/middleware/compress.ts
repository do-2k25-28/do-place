import { Middleware } from '@oak/oak';

export default function compress(): Middleware {
  return async (ctx, next) => {
    await next();

    const acceptEncoding = ctx.request.acceptsEncodings('gzip');
    if (!acceptEncoding?.includes('gzip')) return;

    const bodyStream = new ReadableStream({
      start(controller) {
        controller.enqueue(ctx.response.body);
        controller.close();
      },
    });
    const compressionStream = new CompressionStream('gzip');
    const compressedStream = bodyStream.pipeThrough(compressionStream);

    const reader = compressedStream.getReader();
    const chunks: Uint8Array[] = [];
    let totalLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalLength += value.length;
    }

    // Combine chunks into single Uint8Array
    const compressed = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      compressed.set(chunk, offset);
      offset += chunk.length;
    }

    ctx.response.headers.set('Content-Encoding', 'gzip');
    ctx.response.headers.delete('Content-Length');
    ctx.response.body = compressed;
  };
}
