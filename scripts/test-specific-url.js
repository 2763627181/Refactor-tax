#!/usr/bin/env node

/**
 * Script para probar una URL específica de base de datos
 */

const { Pool } = require('pg');

// URL proporcionada por el usuario
const DATABASE_URL = process.argv[2] || process.env.DATABASE_URL || 'postgres://postgres:R0CnJK4mKx9Mfj68@db.pfqzfretadqjzjbimvkv.supabase.co:6543/postgres';

console.log('🔍 Probando conexión con URL específica...\n');
console.log('📍 URL:', DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
console.log('');

// Probar diferentes configuraciones
const configs = [
  {
    name: 'Configuración 1: postgres:// con SSL',
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
  {
    name: 'Configuración 2: postgresql:// con SSL',
    connectionString: DATABASE_URL.replace('postgres://', 'postgresql://'),
    ssl: { rejectUnauthorized: false },
  },
  {
    name: 'Configuración 3: postgres:// sin SSL',
    connectionString: DATABASE_URL,
    ssl: false,
  },
  {
    name: 'Configuración 4: postgresql:// sin SSL',
    connectionString: DATABASE_URL.replace('postgres://', 'postgresql://'),
    ssl: false,
  },
];

async function testConfig(config) {
  const pool = new Pool({
    connectionString: config.connectionString,
    ssl: config.ssl,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log(`📡 Probando: ${config.name}...`);
    const result = await pool.query('SELECT 1 as test, version() as pg_version, current_database() as db_name');
    
    console.log(`✅ ${config.name}: EXITOSA`);
    console.log(`   Base de datos: ${result.rows[0].db_name}`);
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    console.log('');
    
    await pool.end();
    return { success: true, config };
  } catch (error) {
    console.log(`❌ ${config.name}: FALLIDA`);
    console.log(`   Error: ${error.message}`);
    if (error.code) {
      console.log(`   Código: ${error.code}`);
    }
    console.log('');
    
    await pool.end();
    return { success: false, config, error: error.message };
  }
}

async function main() {
  const results = [];
  
  for (const config of configs) {
    const result = await testConfig(config);
    results.push(result);
    
    // Si una funciona, no necesitamos probar las demás
    if (result.success) {
      console.log('✅ ¡Conexión exitosa! Usa esta configuración en tu .env.local\n');
      console.log(`DATABASE_URL=${result.config.connectionString}`);
      console.log('');
      break;
    }
  }
  
  // Si ninguna funcionó
  const allFailed = results.every(r => !r.success);
  if (allFailed) {
    console.log('❌ Ninguna configuración funcionó.\n');
    console.log('💡 Posibles soluciones:');
    console.log('   1. Verifica que tu proyecto de Supabase esté activo (no pausado)');
    console.log('   2. Verifica que la contraseña sea correcta');
    console.log('   3. Intenta obtener la URL del pooler desde Supabase Dashboard:');
    console.log('      Settings → Database → Connection pooling → Transaction Mode');
    console.log('   4. Verifica tu conexión a internet');
    console.log('');
  }
  
  process.exit(allFailed ? 1 : 0);
}

main().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

