# Boutique E‑commerce MERN

**Full‑stack MERN application** – React 18 + Vite, Express Node 20, MongoDB.

---

## 📋 Prérequis
- **Node.js** ≥ 20
- **npm** ≥ 10 (ou yarn)
- **Docker** ≥ 20 (pour le mode conteneurisé)
- **MongoDB** (local ou Atlas)
- **Stripe** account (clé API et webhook secret)

---

## ⚙️ Installation locale
```bash
# 1️⃣ Clone le repo
git clone https://github.com/your-org/boutique.git && cd boutique

# 2️⃣ Copiez le fichier d'exemple d'environnement
cp .env.example .env   # remplissez les variables (voir ci‑dessus)

# 3️⃣ Installez les dépendances du monorepo
npm install            # installe client & server

# 4️⃣ Lancer les deux serveurs en mode dev
npm run dev            # client : http://localhost:5173
                        # server : http://localhost:5000
```

---

## 📦 Variables d’environnement requises (`.env`)
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | URI de connexion MongoDB (ex : `mongodb://localhost:27017/boutique`) |
| `PORT` | Port HTTP du serveur (défaut : `5000`) |
| `JWT_SECRET` | Secret pour signer les JWT |
| `STRIPE_SECRET_KEY` | Clé privée Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe |
| `CORS_ORIGIN` | Liste des origines autorisées (ex : `http://localhost:5173`) |

---

## 🚀 Lancement en production (Docker)
```bash
# Build & start les conteneurs
docker compose up -d --build
```
Le client sera servi par **nginx** sur le port 80 et le serveur API sur le port 5000.

### Arrêt / nettoyage
```bash
docker compose down -v   # supprime les volumes (MongoDB) si besoin
```

---

## 🧪 Tests
| Type | Commande |
|------|----------|
| Front‑end (Vitest) | `cd client && npm test` |
| Back‑end (Jest)    | `cd server && npm test` |
| E2E (Playwright)  | `cd e2e && npx playwright test` |

---

## 📦 CI / CD (GitHub Actions)
Le workflow `/.github/workflows/ci.yml` exécute :
- Lint + tests frontend
- Lint + tests backend
- Build du client (Vite) et du serveur (TS) pour vérifier qu’aucune rupture ne survient.
Le déclencheur est `push` et `pull_request` sur la branche `main`.

---

## 📆 Release checklist
- [ ] `npm version` → mise à jour du changelog
- [ ] Vérifier le build Docker (`docker compose build --no-cache`)
- [ ] Exécuter les suites de tests CI localement
- [ ] Mettre à jour les variables d’environnement dans le dépôt (si changement)
- [ ] Tagger la version et créer la release sur GitHub
- [ ] Déployer l’image Docker sur le registre (ex : Docker Hub, GHCR)

---

## 🛠️ Scripts utiles
```bash
# Development
npm run dev               # client + server en mode watch

# Production (local)
npm run build             # compile le client + le serveur
npm start                 # lance le serveur Node (dist)

# Docker helpers
docker compose up -d      # démarre tout
docker compose logs -f    # logs en temps réel
```

---

## 📚 Ressources
- [React Helmet Async docs](https://github.com/nfl/react-helmet-async)
- [Vitest docs](https://vitest.dev/)
- [Playwright docs](https://playwright.dev/)
- [MongoDB Atlas setup](https://www.mongodb.com/docs/atlas/getting-started/)

---

*Happy coding!*