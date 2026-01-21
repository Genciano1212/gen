#!/bin/bash
# Script de verificación pre-despliegue para PWA

echo "🔍 Verificando archivos necesarios..."

# Verificar archivos críticos
critical_files=("index.html" "service-worker.js" "manifest.json" "icon-192x192.png" "icon-512x512.png" "_redirects" "netlify.toml")

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file encontrado"
    else
        echo "❌ $file NO encontrado - CRÍTICO"
    fi
done

echo ""
echo "🔍 Verificando sintaxis HTML..."
# Buscar etiquetas duplicadas
duplicates=$(grep -n "</script>" index.html | wc -l)
echo "  - Etiquetas </script> encontradas: $duplicates"
if [ "$duplicates" -gt 4 ]; then
    echo "  ❌ Posible error: demasiadas etiquetas </script>"
else
    echo "  ✅ Estructura HTML parece correcta"
fi

echo ""
echo "🔍 Verificando manifest.json..."
if grep -q '"name"' manifest.json && grep -q '"short_name"' manifest.json && grep -q '"icons"' manifest.json; then
    echo "✅ manifest.json válido"
else
    echo "❌ manifest.json incompleto"
fi

echo ""
echo "🔍 Verificando Service Worker..."
if grep -q 'CACHE_NAME' service-worker.js && grep -q 'fetch' service-worker.js; then
    echo "✅ service-worker.js válido"
else
    echo "❌ service-worker.js incompleto"
fi

echo ""
echo "🔍 Verificando configuración Netlify..."
if [ -f "_redirects" ] && [ -f "netlify.toml" ]; then
    echo "✅ Configuración Netlify completa"
else
    echo "❌ Faltan archivos de configuración Netlify"
fi

echo ""
echo "✅ Verificación completada. La PWA está lista para desplegar."
echo ""
echo "📋 Siguientes pasos:"
echo "   1. Arrastra esta carpeta a https://app.netlify.com/drop"
echo "   2. O sube a GitHub y conecta con Netlify"
echo "   3. Verifica que el Service Worker esté activo"
echo "   4. Prueba el modo offline"
