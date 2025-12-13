# do/place

A remake of Reddit's r/place for a school project.

## Development

For development, you can use the provided docker compose file.

> [!IMPORTANT]  
> A default redis password and secrets are defined in the `docker-compose.yaml` file. It is for development purposes! **Do not** use these credentials in a production environment!

## Production

### Frontend

To build the frontend, you first need to specify what the URL of the backend will be. To do so, set the `VITE_BACKEND_URL` before running the build command.

For example:

```bash
cd frontend
export VITE_BACKEND_URL=https://place.polydo.dev/api/v1
bun run build
```

#### Docker

To set the backend URL when building a Docker image, use the build arg `BACKEND_URL`. If not set, the URL will be `/api/v1` (same host as your frontend).

```bash
cd frontend
docker build --build-arg BACKEND_URL="https://place.polydo.dev/api/v1" .
```

### Backend

The backend use the following environment variables to connect to Redis and apply CORS rules:

| Variable                  | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `REDIS_HOST`              | Host of the Redis database                                                          |
| `REDIS_DB`                | Redis database number                                                               |
| `REDIS_USER`              | User to use to connect to Redis                                                     |
| `REDIS_PASSWORD`          | Password to use to connect to Redis                                                 |
| `FRONTEND_ORIGIN`         | Origin of the frontend                                                              |
| `JWT_SECRET`              | Secret to use to sign JWT                                                           |
| `HASH_SECRET`             | Secret to pass to argon2                                                            |
| `ENABLE_HTTP_COMPRESSION` | Whether or not to enable gzip compression for the canvas route. Defaults to `true`. |

If your database use the default user and/or doesn't have a password you can skip setting them.

If you don't set the `FRONTEND_ORIGIN` variable, the backend will use `*` for its CORS allowed origin which is not allowed in production!

#### Docker

No special configuration required here. Just build the image with the following command:

```bash
cd backend
docker build .
```
