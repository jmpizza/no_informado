@echo off
setlocal enabledelayedexpansion

echo ⚙️ Iniciando setup del proyecto...

REM === VERIFICACIÓN DE DEPENDENCIAS ===
echo 📦 Verificando dependencias...
set dependenciasFaltantes=

REM Verificar npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    set dependenciasFaltantes=!dependenciasFaltantes! npm
)

REM Verificar docker
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    set dependenciasFaltantes=!dependenciasFaltantes! docker
)

REM Verificar docker-compose (legacy) y docker compose (nuevo)
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    docker compose version >nul 2>nul
    if %ERRORLEVEL% neq 0 (
        set dependenciasFaltantes=!dependenciasFaltantes! "docker-compose (o docker compose)"
    )
)

REM Mostrar dependencias faltantes
if not "!dependenciasFaltantes!"=="" (
    echo ❌ Faltan las siguientes dependencias:
    for %%d in (!dependenciasFaltantes!) do echo    - %%d
    echo Por favor instálalas antes de continuar. 🚫
    exit /b 1
) else (
    echo ✅ Todas las dependencias están instaladas.
)

REM === LEVANTAR BASE DE DATOS CON DOCKER ===
echo 🐘 Levantando PostgreSQL con Docker Compose...

where docker-compose >nul 2>nul
if %ERRORLEVEL% == 0 (
    docker-compose up -d
) else (
    docker compose up -d
)

echo ⏳ Esperando a que PostgreSQL esté listo...

REM Esperar hasta 30 segundos a que esté disponible
set timeout=30

:esperar_pg
docker exec caja-control-pro pg_isready >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo ✅ PostgreSQL listo para usarse.
    goto listo
)

if %timeout%==0 (
    echo ❌ PostgreSQL no se inicializó a tiempo.
    exit /b 1
)

timeout /t 1 >nul
set /a timeout=%timeout%-1
goto esperar_pg

:listo

REM === CONFIGURACIÓN DEL PROYECTO ===
echo 🧱 Inicializando proyecto con npm...

cd Proyect
npm instal
node .\prisma\seed.js

echo 📂 Creando estructura de carpetas...
if not exist src mkdir src
if not exist config mkdir config
if not exist scripts mkdir scripts

echo 🚀 Proyecto inicializado correctamente.

endlocal
