#!/usr/bin/env node

/**
 * Script completo de verificación de base de datos
 * Verifica conexión, pool, y funciones principales
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurada');
  process.exit(1);
}

// Detectar tipo de conexión
const isPooler = DATABASE_URL.includes('pooler') || DATABASE_URL.includes('aws-0');
const isDirect = DATABASE_URL.includes('db.') && DATABASE_URL.includes('.supabase.co');
const isNeon = DATABASE_URL.includes('neon');

console.log('🔍 Verificando conexión a la base de datos...\n');
console.log('📍 Tipo de conexión detectado:');
if (isPooler) {
  console.log('   ✅ Pooler (recomendado)');
} else if (isDirect) {
  console.log('   ⚠️  Conexión directa (puede tener límites)');
} else if (isNeon) {
  console.log('   ✅ Neon');
} else {
  console.log('   ❓ Desconocido');
}

// Ocultar contraseña en el log
const maskedUrl = DATABASE_URL.replace(/:[^:@]+@/, ':****@');
console.log(`📍 URL: ${maskedUrl}\n`);

// Configurar pool
const poolConfig = {
  connectionString: DATABASE_URL,
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Habilitar SSL para conexiones externas
if (isPooler || isDirect || isNeon || process.env.NODE_ENV === 'production') {
  poolConfig.ssl = { rejectUnauthorized: false };
  console.log('🔒 SSL habilitado para conexión externa\n');
}

const pool = new Pool(poolConfig);

// Agregar event listeners
pool.on('connect', () => {
  console.log('✅ Nueva conexión establecida');
});

pool.on('error', (err) => {
  console.error('❌ Error en el pool:', err.message);
});

async function testConnection() {
  try {
    console.log('📡 Probando conexión básica...');
    const result = await pool.query(`
      SELECT 
        1 as test,
        version() as pg_version,
        current_database() as db_name,
        current_user as db_user,
        inet_server_addr() as server_ip
    `);
    
    console.log('✅ Conexión exitosa!\n');
    console.log('📊 Información de la base de datos:');
    console.log(`   Base de datos: ${result.rows[0].db_name}`);
    console.log(`   Usuario: ${result.rows[0].db_user}`);
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    if (result.rows[0].server_ip) {
      console.log(`   IP del servidor: ${result.rows[0].server_ip}`);
    }
    console.log('');
    
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    if (error.code) {
      console.error(`📋 Código de error: ${error.code}`);
    }
    
    // Mensajes de ayuda según el error
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 El host no se puede resolver. Posibles causas:');
      console.error('   1. El proyecto de Supabase está pausado');
      console.error('   2. La URL está incorrecta');
      console.error('   3. Problemas de red/DNS');
      console.error('\n💡 Para usar pooler de Supabase, la URL debe ser:');
      console.error('   postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres');
    } else if (error.code === '28P01' || error.message?.includes('password')) {
      console.error('\n💡 Error de autenticación. Verifica:');
      console.error('   1. La contraseña en DATABASE_URL es correcta');
      console.error('   2. El usuario tiene permisos');
    } else if (error.code === '3D000' || error.message?.includes('database')) {
      console.error('\n💡 La base de datos no existe. Verifica el nombre en DATABASE_URL');
    }
    
    return false;
  }
}

async function testTables() {
  try {
    console.log('📋 Verificando tablas...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const expectedTables = [
      'users',
      'tax_cases',
      'documents',
      'appointments',
      'messages',
      'contact_submissions',
      'activity_logs',
    ];
    
    const existingTables = result.rows.map(r => r.table_name);
    const missingTables = expectedTables.filter(t => !existingTables.includes(t));
    
    console.log(`✅ Encontradas ${existingTables.length} tablas`);
    if (missingTables.length > 0) {
      console.log(`⚠️  Faltan tablas: ${missingTables.join(', ')}`);
    } else {
      console.log('✅ Todas las tablas esperadas existen');
    }
    console.log('');
    
    return { existingTables, missingTables };
  } catch (error) {
    console.error('❌ Error verificando tablas:', error.message);
    return { existingTables: [], missingTables: [] };
  }
}

async function testQueries() {
  try {
    console.log('🔍 Probando consultas básicas...');
    
    // Test 1: Contar usuarios
    try {
      const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
      console.log(`   ✅ Usuarios: ${usersResult.rows[0].count}`);
    } catch (err) {
      console.log(`   ❌ Error contando usuarios: ${err.message}`);
    }
    
    // Test 2: Contar casos
    try {
      const casesResult = await pool.query('SELECT COUNT(*) as count FROM tax_cases');
      console.log(`   ✅ Casos: ${casesResult.rows[0].count}`);
    } catch (err) {
      console.log(`   ❌ Error contando casos: ${err.message}`);
    }
    
    // Test 3: Contar documentos
    try {
      const docsResult = await pool.query('SELECT COUNT(*) as count FROM documents');
      console.log(`   ✅ Documentos: ${docsResult.rows[0].count}`);
    } catch (err) {
      console.log(`   ❌ Error contando documentos: ${err.message}`);
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ Error en consultas:', error.message);
    return false;
  }
}

async function testPool() {
  try {
    console.log('🏊 Probando pool de conexiones...');
    
    // Crear múltiples conexiones simultáneas
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(pool.query('SELECT $1::int as test', [i]));
    }
    
    const results = await Promise.all(promises);
    console.log(`✅ Pool funciona correctamente (${results.length} conexiones simultáneas)`);
    console.log('');
    
    return true;
  } catch (error) {
    console.error('❌ Error en pool:', error.message);
    return false;
  }
}

async function main() {
  const connectionOk = await testConnection();
  if (!connectionOk) {
    await pool.end();
    process.exit(1);
  }
  
  await testTables();
  await testQueries();
  await testPool();
  
  console.log('✅ Verificación completa!\n');
  await pool.end();
  process.exit(0);
}

main().catch(async (error) => {
  console.error('❌ Error fatal:', error);
  await pool.end();
  process.exit(1);
});

