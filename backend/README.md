# Tele Gás API

## Run

```bash
npm install
npm start
```

## Env

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`

## Routes

- `GET /health`
- `POST /admin/auth/request` (email + senha, envia código por email)
- `POST /admin/auth/confirm` (confirma código de 6 dígitos)
- `POST /admin/pair/request`
- `POST /admin/pair/confirm`
- `POST /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/status`
- `PATCH /orders/:id/assign-driver`
- `POST /drivers/location`
- `GET /orders/:id/live`
- `GET /drivers/me/orders`
