#!/bin/bash

set -e # Detiene la ejecución si ocurre algún error

echo "⚙️ Iniciando setup del proyecto..."

## === VERIFICACIÓN DE DEPENDENCIAS === ##
echo "📦 Verificando dependencias..."
dependenciasFaltantes=()

# Verificar npm
if ! command -v npm >/dev/null 2>&1; then
    dependenciasFaltantes+=("npm")
fi

# Verificar Docker
if ! command -v docker >/dev/null 2>&1; then
    dependenciasFaltantes+=("docker")
fi

# Verificar Docker Compose (cualquiera de las dos versiones)
if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
    dependenciasFaltantes+=("docker-compose (o docker compose)")
fi

# Mostrar dependencias faltantes
if [ ${#dependenciasFaltantes[@]} -ne 0 ]; then
    echo "❌ Faltan las siguientes dependencias:"
    for dep in "${dependenciasFaltantes[@]}"; do
        echo "   - $dep"
    done
    echo "Por favor instálalas antes de continuar. 🚫"
    exit 1
else
    echo "✅ Todas las dependencias están instaladas."
fi

## === LEVANTAR BASE DE DATOS CON DOCKER === ##
echo "🐘 Levantando PostgreSQL con Docker Compose..."

# Compatibilidad con versiones antiguas y nuevas de Docker Compose
if command -v docker-compose >/dev/null 2>&1; then
    docker-compose up -d
else
    docker compose up -d
fi

# Esperar a que PostgreSQL esté disponible
echo "⏳ Esperando a que PostgreSQL esté listo..."

# (opcional) Comprobación activa del contenedor hasta que responda
timeout=30
until docker exec "caja-control-pro" pg_isready >/dev/null 2>&1 || [ $timeout -eq 0 ]; do
    sleep 1
    ((timeout--))
done

if [ $timeout -eq 0 ]; then
    echo "❌ PostgreSQL no se inicializó a tiempo."
    exit 1
else
    echo "✅ PostgreSQL listo para usarse."
fi

## === CONFIGURACIÓN DEL PROYECTO (a completar) === ##
echo "🧱 Inicializando proyecto con npm..."
npm install
npm ./prisma/seed.js # Crear el usuario default

echo "📂 Creando estructura de carpetas..."
mkdir -p src config scripts

echo "🚀 Proyecto inicializado correctamente."
