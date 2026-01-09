#!/usr/bin/env node

/**
 * Script para probar la conexión a la base de datos
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('pooler') 
    ? { rejectUnauthorized: false }
    : false
});

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    console.log('📍 URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Ocultar contraseña
    
    const result = await pool.query('SELECT 1 as test, version() as pg_version, current_database() as db_name');
    
    console.log('✅ Conexión exitosa al pooler de Supabase!');
    console.log('📊 Base de datos:', result.rows[0].db_name);
    console.log('📊 PostgreSQL:', result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    if (error.code) {
      console.error('📋 Código de error:', error.code);
    }
    await pool.end();
    process.exit(1);
  }
}

testConnection();


