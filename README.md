# Highlight Tax Services - Refactor

Proyecto refactorizado con backend (Node.js/Express) y frontend (React/Vite) completamente separados.

## Estructura

- `backend/` - Servidor Node.js/Express independiente
- `frontend/` - Cliente React/Vite independiente  
- `shared/` - Código compartido (schema DB)

## Instalación

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Desarrollo

```bash
# Backend (puerto 5000)
cd backend
npm run dev

# Frontend (puerto 5173)
cd frontend
npm run dev
```

## Variables de Entorno

Ver [ENV_VARIABLES.md](./ENV_VARIABLES.md) para la lista completa.

**Mínimo requerido:**
- `DATABASE_URL`
- `SESSION_SECRET`

## Despliegue

El proyecto está configurado para Vercel. Ver `vercel.json` para detalles.

