import { getClient } from './client.ts';

export type RedisUser = {
  username: string;
  password: string;
  type: 'basic';
};

export async function createBasicUser(
  email: string,
  username: string,
  password: string
): Promise<string> {
  const client = await getClient();

  const id = crypto.randomUUID();

  client.json.set(`account:${id}`, '$', {
    type: 'basic',
    email,
    username,
    password,
  });

  client.set(`account:by-email:${email}`, id);

  return id;
}

export async function getUserById(id: string): Promise<RedisUser | null> {
  const client = await getClient();
  return (await client.json.get(`account:${id}`)) as RedisUser | null;
}

export async function getUserIdByEmail(email: string): Promise<string | null> {
  const client = await getClient();
  return await client.get(`account:by-email:${email}`);
}

export async function getUserPassword(id: string): Promise<string | null> {
  const client = await getClient();
  return (await client.json.get(`account:${id}`, { path: '.password' })) as
    | string
    | null;
}
