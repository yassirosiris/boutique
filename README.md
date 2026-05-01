# Boutique E-commerce MERN

Application e-commerce complete pour une boutique de vetements, en monorepo:

- `client`: React 18 + Vite + TailwindCSS
- `server`: Node.js + Express + MongoDB (Mongoose)
- `shared`: types TypeScript partages

## Prerequis

- Node.js 20+
- npm 10+
- MongoDB Atlas
- Compte Stripe

## Installation

1. Copier `.env.example` vers `.env` a la racine.
2. Renseigner les variables d'environnement.
3. Installer les dependances:

```bash
npm install
```

## Lancement en developpement

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Build production

```bash
npm run build
```

## Seed de produits

```bash
npm run seed
```

## API principale

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/cart/checkout`
- `POST /api/webhooks/stripe`
- `POST /api/orders`
- `GET /api/orders/mine`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id`
- `GET /api/admin/dashboard`

## Notes

- Le paiement Konnect/Paymee est prepare sous forme de stub dans le backend.
- Le panier est gere cote client avec Zustand + persistence localStorage.
