# do/place API docs

All endpoints return `application/json` with at least the `success` field being a boolean telling if the request was a success or not.

## Auth

POST `/api/v1/accounts/login` login and set the auth cookie

POST `/api/v1/accounts/register` create account and set the auth cookie

POST `/api/v1/accounts/logout` delete the auth cookie

GET `/api/v1/accounts/state` know if you're connected or not

## Canvas

GET `/api/v1/canvas`
-> static canvas for unauthed users

GET `/api/v1/canvas/properties`
-> Get the dimensions and the colors composing the canvas.

GET `/api/v1/canvas?type=webp|png`
-> Generate a webp or png of the canvas and then send it to the user

ws `/api/v1/canvas/gateway`
|-> CB `update`
|-> SB `place`