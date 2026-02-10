# 🐜 Donaciones Invencibles - PWA

Tracker de donaciones para Pocket Ants con soporte offline y sincronización en tiempo real con Firebase.

## 📋 Características

- ✅ PWA instalable (Progressive Web App)
- 📱 Diseño responsivo (móvil y desktop)
- 🔄 Sincronización en tiempo real con Firebase
- 💾 Soporte offline con IndexedDB
- 📊 Tablas estilo Excel con colores de rendimiento
- 🔐 Autenticación de administrador
- 📲 Notificaciones push
- 📦 Servicio Worker para caché offline

## 🚀 Despliegue en Netlify

### Opción 1: Drag & Drop (Más rápido)

1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra la carpeta del proyecto (contiene: index.html, service-worker.js, manifest.json, iconos)
3. Espera unos segundos y obtén tu URL

### Opción 2: Con Git (Recomendado)

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Inicializar PWA"

# Subir a GitHub
# Crea un repositorio nuevo en GitHub
git remote add origin TU_REPOSITORIO_GITHUB
git branch -M main
git push -u origin main

# Conectar con Netlify
# 1. Ve a app.netlify.com
# 2. Crea nuevo sitio desde GitHub
# 3. Selecciona tu repositorio
# 4. Configura:
#    - Build command: (dejar vacío)
#    - Publish directory: . (o la carpeta raíz)
# 5. Deploy
```

## ⚙️ Configuración de Firebase

La PWA ya está configurada con las credenciales de Firebase. No necesitas cambiar nada.

- **Project ID:** donacionespwav2
- **Auth Domain:** donacionespwav2.firebaseapp.com
- **Firestore Database:** Configurada y funcionando

## 🔧 Archivos de Configuración

- **_redirects**: Maneja todas las rutas para que el Service Worker funcione
- **netlify.toml**: Configuración optimizada de Netlify (caching, headers)
- **service-worker.js**: Caché offline y estrategias de red
- **manifest.json**: Configuración PWA (iconos, tema, nombre)

## 📱 Instalación como App

Después de desplegar, la PWA será instalable:
1. Abre el sitio en un navegador compatible (Chrome, Edge, Safari móvil)
2. Busca el botón "Instalar App" en el menú de configuración
3. Instálalo en tu dispositivo

## 🧪 Verificación Post-Despliegue

1. **Service Worker:**
   - Abre DevTools (F12)
   - Ve a Application → Service Workers
   - Verifica que esté activo y en estado "running"

2. **Manifest PWA:**
   - Ve a Application → Manifest
   - Verifica que cargue correctamente

3. **Lighthouse:**
   - Ejecuta una auditoría de Lighthouse
   - Deberías obtener al menos 90 en PWA

4. **Offline:**
   - Activa modo offline en DevTools
   - Recarga la página
   - La app debería funcionar correctamente

## 🔍 Solución de Problemas

### Service Worker no se registra
- Asegúrate de usar HTTPS o localhost
- Verifica que service-worker.js esté en la raíz
- Limpia el caché del navegador

### Firebase no conecta
- Verifica que las credenciales sean correctas
- Asegúrate de que las reglas de Firestore permitan lectura/escritura

### PWA no es instalable
- Verifica que manifest.json tenga los campos requeridos
- Asegúrate de que los iconos existan (192x192 y 512x512)
- Prueba en HTTPS

## 📝 Notas Importantes

- No requiere proceso de build (es HTML/CSS/JS puro)
- Netlify detecta automáticamente que es un sitio estático
- Todos los cambios se reflejan instantáneamente tras el deploy
- El Service Worker se actualiza automáticamente cuando cambias los archivos

## 🎨 Personalización

Puedes modificar:
- **meta description:** Línea 6 en index.html
- **colores y tema:** CSS en líneas 11-10000
- **iconos:** Reemplaza icon-192x192.png y icon-512x512.png

## 📄 Licencia

Proyecto para uso interno del equipo de Pocket Ants.

---

**Estado de Despliegue:** ✅ Listo para producción
**Prueba más reciente:** 15/01/2026
