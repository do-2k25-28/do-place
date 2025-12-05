import { Status } from '@oak/commons/status';
import { Context, Router } from '@oak/oak';

function properties(ctx: Context) {
  ctx.response.status = Status.OK;
  ctx.response.body = {
    success: true,
    width: 1000,
    height: 1000,
    colors: [
      { name: 'white', hex: '#ffffff' },
      { name: 'light_gray', hex: '#d4d7d9' },
      { name: 'gray', hex: '#898d90' },
      { name: 'black', hex: '#000000' },
      { name: 'pink', hex: '#ff99aa' },
      { name: 'red', hex: '#e50000' },
      { name: 'orange', hex: '#ff8b00' },
      { name: 'brown', hex: '#8b4513' },
      { name: 'yellow', hex: '#ffd635' },
      { name: 'light_green', hex: '#7eed56' },
      { name: 'green', hex: '#00a368' },
      { name: 'cyan', hex: '#00ccc0' },
      { name: 'light_blue', hex: '#51e9f4' },
      { name: 'blue', hex: '#3690ea' },
      { name: 'dark_blue', hex: '#002fa7' },
      { name: 'purple', hex: '#811e9f' },
    ],
  };
}

export default function (router: Router) {
  router.get('/properties', properties);
}
