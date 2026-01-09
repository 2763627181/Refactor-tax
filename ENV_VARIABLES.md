# Variables de Entorno - Highlight Tax Services Refactor

## 🔴 CRÍTICAS (Requeridas - Sin estas la app NO funcionará)

### `DATABASE_URL`
**Tipo:** String  
**Requerida:** ✅ Sí  
**Formato:** 
```
postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres
```

**Para Vercel (Pooler - Recomendado):**
```
postgresql://postgres.pfqzfretadqjzjbimvkv:R0CnJK4mKx9Mfj68@aws-1-us-west-1.pooler.supabase.com:6543/postgres
```

### `SESSION_SECRET`
**Tipo:** String  
**Requerida:** ✅ Sí  
**Longitud mínima:** 32 caracteres  
**Generar:** 
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🟡 IMPORTANTES (Funcionalidad limitada sin estas)

### `RESEND_API_KEY`
**Tipo:** String  
**Formato:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`  
**Obtener:** https://resend.com/api-keys

### `RESEND_FROM_EMAIL`
**Tipo:** String (Email)  
**Valor por defecto:** `noreply@highlighttax.com`  
**Debe estar:** Verificado en Resend

### `R2_ACCOUNT_ID`
**Tipo:** String  
**Obtener:** Cloudflare Dashboard → R2 → Account ID

### `R2_ACCESS_KEY_ID`
**Tipo:** String  
**Obtener:** Cloudflare Dashboard → R2 → Manage R2 API Tokens

### `R2_SECRET_ACCESS_KEY`
**Tipo:** String  
**Obtener:** Cloudflare Dashboard → R2 → Manage R2 API Tokens (solo se muestra una vez)

### `R2_BUCKET_NAME`
**Tipo:** String  
**Ejemplo:** `highlight-tax-documents`

### `R2_PUBLIC_URL` (Opcional)
**Tipo:** String (URL)  
**Ejemplo:** `https://pub-xxxxx.r2.dev`

## 🟢 OPCIONALES

### `NEXT_PUBLIC_SUPABASE_URL`
**Tipo:** String (URL)  
**Ejemplo:** `https://pfqzfretadqjzjbimvkv.supabase.co`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Tipo:** String  
**Obtener:** Supabase Dashboard → Settings → API

### `NEXT_PUBLIC_APP_URL`
**Tipo:** String (URL)  
**Valor por defecto:** `http://localhost:3000`  
**En Vercel:** `https://tu-proyecto.vercel.app`

## ⚙️ Configuración para Vercel

En Vercel Dashboard → Settings → Environment Variables, agrega:

**Mínimo requerido:**
- `DATABASE_URL` (con pooler puerto 6543)
- `SESSION_SECRET` (mínimo 32 caracteres)

**Para funcionalidad completa:**
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

