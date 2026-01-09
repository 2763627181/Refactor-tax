# ✅ Checklist de Variables de Entorno

## 🔴 CRÍTICAS (Requeridas - Sin estas NO funciona)

- [ ] `DATABASE_URL` - URL de conexión PostgreSQL con pooler (puerto 6543)
  - Formato: `postgresql://postgres:[PASSWORD]@aws-1-us-west-1.pooler.supabase.com:6543/postgres`
  - ✅ Configurada en Vercel: `Settings → Environment Variables`
  
- [ ] `SESSION_SECRET` - Clave secreta para JWT (mínimo 32 caracteres)
  - Generar: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
  - ✅ Configurada en Vercel

## 🟡 IMPORTANTES (Funcionalidad limitada sin estas)

- [ ] `RESEND_API_KEY` - API Key de Resend para emails
  - Formato: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - Obtener: https://resend.com/api-keys
  
- [ ] `RESEND_FROM_EMAIL` - Email remitente (debe estar verificado en Resend)
  - Valor por defecto: `noreply@highlighttax.com`
  
- [ ] `R2_ACCOUNT_ID` - ID de cuenta Cloudflare
  - Obtener: Cloudflare Dashboard → R2 → Account ID
  
- [ ] `R2_ACCESS_KEY_ID` - Access Key ID de R2
  
- [ ] `R2_SECRET_ACCESS_KEY` - Secret Access Key de R2
  
- [ ] `R2_BUCKET_NAME` - Nombre del bucket R2
  - Ejemplo: `highlight-tax-documents`

## 🟢 OPCIONALES

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - URL de Supabase (para OAuth)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anónima de Supabase
- [ ] `NEXT_PUBLIC_APP_URL` - URL de la app en producción
  - Ejemplo: `https://tu-proyecto.vercel.app`

## ⚙️ Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada variable:
   - **Name**: Nombre de la variable (ej: `DATABASE_URL`)
   - **Value**: Valor de la variable
   - **Environments**: ✅ Production, ✅ Preview

## ✅ Verificación

Después de configurar, verifica en los logs de Vercel que todas las variables críticas estén presentes.

