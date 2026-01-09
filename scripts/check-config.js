#!/usr/bin/env node

/**
 * Script de verificación de configuración
 * Verifica que todas las variables de entorno necesarias estén configuradas
 */

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const requiredVars = {
  critical: [
    'DATABASE_URL',
    'SESSION_SECRET',
  ],
  important: [
    'RESEND_API_KEY',
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
  ],
  optional: [
    'RESEND_FROM_EMAIL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_APP_URL',
    'ADMIN_CREATE_USER_TOKEN',
  ],
};

function checkVar(name) {
  const value = process.env[name];
  return {
    name,
    configured: !!value,
    length: value ? value.length : 0,
    valid: value && value.trim().length > 0,
  };
}

function validateSessionSecret(value) {
  if (!value) return false;
  return value.length >= 32;
}

console.log('🔍 Verificando configuración...\n');

const results = {
  critical: [],
  important: [],
  optional: [],
};

// Verificar variables críticas
console.log('📋 Variables Críticas:');
requiredVars.critical.forEach(varName => {
  const check = checkVar(varName);
  results.critical.push(check);
  
  if (varName === 'SESSION_SECRET') {
    const isValid = validateSessionSecret(process.env[varName]);
    if (!check.configured) {
      console.log(`  ❌ ${varName}: NO CONFIGURADA`);
    } else if (!isValid) {
      console.log(`  ⚠️  ${varName}: Configurada pero muy corta (mínimo 32 caracteres, actual: ${check.length})`);
    } else {
      console.log(`  ✅ ${varName}: Configurada (${check.length} caracteres)`);
    }
  } else {
    console.log(`  ${check.configured ? '✅' : '❌'} ${varName}: ${check.configured ? 'Configurada' : 'NO CONFIGURADA'}`);
  }
});

// Verificar variables importantes
console.log('\n📋 Variables Importantes:');
requiredVars.important.forEach(varName => {
  const check = checkVar(varName);
  results.important.push(check);
  console.log(`  ${check.configured ? '✅' : '⚠️ '} ${varName}: ${check.configured ? 'Configurada' : 'NO CONFIGURADA'}`);
});

// Verificar variables opcionales
console.log('\n📋 Variables Opcionales:');
requiredVars.optional.forEach(varName => {
  const check = checkVar(varName);
  results.optional.push(check);
  console.log(`  ${check.configured ? '✅' : '⚪'} ${varName}: ${check.configured ? 'Configurada' : 'No configurada (opcional)'}`);
});

// Resumen
console.log('\n📊 Resumen:');
const criticalOk = results.critical.every(r => {
  if (r.name === 'SESSION_SECRET') {
    return r.configured && validateSessionSecret(process.env[r.name]);
  }
  return r.configured;
});
const importantCount = results.important.filter(r => r.configured).length;
const optionalCount = results.optional.filter(r => r.configured).length;

console.log(`  Críticas: ${criticalOk ? '✅ Todas configuradas' : '❌ Faltan variables críticas'}`);
console.log(`  Importantes: ${importantCount}/${requiredVars.important.length} configuradas`);
console.log(`  Opcionales: ${optionalCount}/${requiredVars.optional.length} configuradas`);

// Verificar archivo .env.local
const envLocalPath = path.join(__dirname, '../.env.local');
const envLocalExists = fs.existsSync(envLocalPath);
console.log(`\n📁 Archivo .env.local: ${envLocalExists ? '✅ Existe' : '⚠️  No existe (copia .env.example)'}`);

// Resultado final
if (!criticalOk) {
  console.log('\n❌ ERROR: Faltan variables críticas. La aplicación NO funcionará sin ellas.');
  console.log('   Por favor, configura al menos DATABASE_URL y SESSION_SECRET.');
  process.exit(1);
} else {
  console.log('\n✅ Configuración básica completa. La aplicación debería funcionar.');
  if (importantCount < requiredVars.important.length) {
    console.log('⚠️  Algunas funcionalidades estarán limitadas sin las variables importantes.');
  }
  process.exit(0);
}



