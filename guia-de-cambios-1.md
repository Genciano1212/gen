# Guía de Migración: Sistema de Respaldo JSON de Alta Precisión

Esta guía contiene instrucciones precisas para implementar un sistema de copia de seguridad (Backup) y restauración basado en JSON puro. El objetivo es garantizar la **integridad absoluta de los datos**, asegurando que al restaurar una copia, la aplicación refleje con exactitud matemática y visual el estado original, incluyendo cálculos derivados (déficits cubiertos, colores, porcentajes) sin depender de recálculos posteriores que podrían alterar los valores.

## 1. Filosofía de Diseño
- **Formato:** JSON Puro (sin texto humano, salvo para depuración interna).
- **Prioridad:** Integridad de Datos > Legibilidad Humana.
- **Estrategia:** Guardar el **Estado Completo de la Aplicación (Snapshot)**, no solo la lista de jugadores. Esto incluye configuraciones, constantes matemáticas del momento y estados derivados.

## 2. Nueva Estructura del JSON (Schema)

El archivo de respaldo deberá seguir estrictamente esta estructura. Se eliminan las ambigüedades del formato anterior.

```json
{
  "meta": {
    "version_backup": "2.0",
    "timestamp": 1715558400000,
    "fecha_legible": "Lunes 13 de Mayo 2024, 10:30:00",
    "checksum": "sha256-hash-del-contenido" // Opcional, para validar integridad
  },
  "configuracion_global": {
    "meta_diaria": 15000,
    "inicio_semana_timestamp": 1715500000000,
    "ultimo_update_timestamp": 1715558400000
  },
  "jugadores": {
    "Juan": {
      "datos_core": {
        "previous": 10000,       // "Tenía" (Base al inicio de semana)
        "current": 25000,        // "Tiene" (Total actual)
        "accumulated_base": 50000 // Acumulado ANTES de esta semana
      },
      "estado_calculado": {
        "semanal": 15000,        // (current - previous)
        "deficit_cubierto": 0,   // Cantidad tomada del acumulado para cubrir meta (Rojo con menos)
        "exceso_semanal": 0,     // Lo que sobró esta semana
        "acumulado_final": 50000, // Lo que se muestra en la tabla (Base - Deficit + Exceso)
        "eficiencia_aplicada": 1.0, // Factor de eficiencia usado (1.0, 0.5, 0.1, 0.05)
        "tier_color": "#28a745"   // Color del triángulo de nivel
      },
      "flags": {
        "is_new": false,
        "is_absent": false
      }
    },
    "Maria": {
      "datos_core": {
        "previous": 5000,
        "current": 5000,
        "accumulated_base": 20000
      },
      "estado_calculado": {
        "semanal": 0,
        "deficit_cubierto": 15000, // IMPORTANTE: Esto permite mostrar (-15.000) en rojo al restaurar
        "exceso_semanal": 0,
        "acumulado_final": 5000,   // (20000 - 15000)
        "eficiencia_aplicada": 1.0,
        "tier_color": "#ffc107"
      },
      "flags": {
        "is_new": false,
        "is_absent": false
      }
    }
  }
}
```

## 3. Instrucciones de Implementación

### A. Modificar función `backupData()`
1.  **Recolección de Datos:**
    -   No iterar solo sobre `players`.
    -   Capturar primero `goalDaily`, `weekStart` y `lastUpdate` en un objeto `configuracion_global`.
2.  **Snapshot de Jugadores:**
    -   Para cada jugador, además de `previous`, `current` y `accumulatedExcess`, se deben **re-ejecutar** los cálculos de `renderTable` (déficit, eficiencia, acumulado visual) y guardarlos en el objeto `estado_calculado`.
    -   **CRÍTICO:** Guardar explícitamente `deficitDraw` (déficit cubierto). Este valor es volátil y suele perderse si no se guarda, causando que los números rojos desaparezcan al restaurar.
3.  **Generación de Archivo:**
    -   Serializar todo el objeto con `JSON.stringify()`.
    -   Descargar como `.json` (ej: `backup_lineal_v2_2024-05-13.json`).

### B. Modificar función `restoreBackup()`
1.  **Validación Estricta:**
    -   Al cargar, verificar si existe `meta.version_backup`. Si es "2.0", usar la nueva lógica.
    -   Si es un JSON antiguo o TXT, usar la lógica legacy (mantener compatibilidad).
2.  **Restauración de Contexto:**
    -   **OBLIGATORIO:** Antes de restaurar jugadores, restaurar `goalDaily` desde `configuracion_global.meta_diaria`. Si la meta cambia, los cálculos se rompen.
    -   Restaurar `weekStart` y `lastUpdate`.
3.  **Hidratación de Jugadores:**
    -   Limpiar objeto `players`.
    -   Iterar sobre el JSON. Para cada jugador:
        -   Restaurar `previous`, `current`, `accumulatedExcess` (Base).
        -   **CRÍTICO:** Restaurar flags como `absent` y `isNew`.
    -   **Nota sobre `estado_calculado`:** Aunque guardamos los cálculos para referencia y validación futura, la app **debe** poder recalcularlos idénticos usando `datos_core` + `configuracion_global`.
        -   *Verificación de Integridad:* Tras restaurar, ejecutar un cálculo de prueba in-memory. Si el `acumulado_final` recalculado difiere del `estado_calculado.acumulado_final` del JSON, mostrar una **Alerta de Inconsistencia** (esto previene errores por cambios en fórmulas).

## 4. Puntos de Control de Calidad (QA)

Verificar estos escenarios tras la implementación:
1.  **El Caso del Déficit Cubierto:**
    -   Jugador con 20k acumulados, meta 15k, dona 0.
    -   Tabla muestra: Acumulado 5k (y posiblemente "-15k" en rojo).
    -   Al restaurar, **debe** seguir mostrando 5k y el "-15k" rojo.
2.  **El Caso del Cambio de Meta:**
    -   Hacer backup con meta 15k.
    -   Cambiar meta manual a 20k.
    -   Restaurar backup.
    -   La meta **debe** volver automáticamente a 15k.
3.  **El Caso de los Nuevos:**
    -   Jugador marcado como `[NUEVO]`.
    -   Al restaurar, debe seguir teniendo la etiqueta verde de `NUEVO`.

## 5. Resumen de Cambios en Código
- **Nuevas Funciones:** `generateSnapshot()`, `validateSnapshot()`.
- **Modificadas:** `backupData` (apuntar a generateSnapshot), `restoreBackup` (manejar JSON v2).
- **Eliminadas:** Lógica de generación de TXT (opcional: mantener como "Exportar Reporte" secundario, pero no como Backup principal).
