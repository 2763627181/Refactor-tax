#!/usr/bin/env node

/**
 * Script para probar diferentes formatos del Shared Pooler
 */

const { Pool } = require('pg');

const PASSWORD = 'R0CnJK4mKx9Mfj68';
const PROJECT_REF = 'pfqzfretadqjzjbimvkv';
const REGION = 'aws-1-us-west-1';
const PORT = 6543;

// Diferentes formatos a probar
const formats = [
  {
    name: 'Formato 1: postgres.PROJECT_REF',
    url: `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${REGION}.pooler.supabase.com:${PORT}/postgres`,
  },
  {
    name: 'Formato 2: Solo PROJECT_REF',
    url: `postgresql://${PROJECT_REF}:${PASSWORD}@${REGION}.pooler.supabase.com:${PORT}/postgres`,
  },
  {
    name: 'Formato 3: postgresql:// con postgres. (alternativo)',
    url: `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${REGION}.pooler.supabase.com:${PORT}/postgres`,
  },
];

async function testFormat(format) {
  const pool = new Pool({
    connectionString: format.url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log(`📡 Probando: ${format.name}...`);
    console.log(`   URL: ${format.url.replace(/:[^:@]+@/, ':****@')}`);
    
    const result = await pool.query('SELECT 1 as test, version() as pg_version, current_database() as db_name, current_user as db_user');
    
    console.log(`✅ ${format.name}: EXITOSA`);
    console.log(`   Base de datos: ${result.rows[0].db_name}`);
    console.log(`   Usuario: ${result.rows[0].db_user}`);
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    console.log('');
    console.log('🎉 ¡Usa esta URL en tu .env.local:');
    console.log(`DATABASE_URL=${format.url}`);
    console.log('');
    
    await pool.end();
    return { success: true, format };
  } catch (error) {
    console.log(`❌ ${format.name}: FALLIDA`);
    console.log(`   Error: ${error.message}`);
    if (error.code) {
      console.log(`   Código: ${error.code}`);
    }
    console.log('');
    
    await pool.end();
    return { success: false, format, error: error.message };
  }
}

async function main() {
  console.log('🔍 Probando diferentes formatos del Shared Pooler...\n');
  console.log(`Proyecto: ${PROJECT_REF}`);
  console.log(`Región: ${REGION}`);
  console.log(`Puerto: ${PORT}\n`);
  console.log('─'.repeat(60));
  console.log('');
  
  for (const format of formats) {
    const result = await testFormat(format);
    
    // Si una funciona, no necesitamos probar las demás
    if (result.success) {
      process.exit(0);
    }
  }
  
  console.log('❌ Ningún formato funcionó.\n');
  console.log('💡 Verifica:');
  console.log('   1. Que la contraseña sea correcta');
  console.log('   2. Que el proyecto esté activo en Supabase');
  console.log('   3. Que la región sea correcta (aws-1-us-west-1)');
  console.log('   4. Copia la URL exacta desde Supabase Dashboard');
  console.log('');
  
  process.exit(1);
}

main().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

