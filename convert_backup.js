const fs = require('fs');
const path = require('path');

const inputFile = 'C:\\Users\\1212g\\Desktop\\copia de restauracion.txt';
const outputFile = 'C:\\Users\\1212g\\Desktop\\restauracion_formato_nuevo.json';

try {
    const content = fs.readFileSync(inputFile, 'utf8');
    const oldData = JSON.parse(content);

    const newData = {
        meta: {
            version_backup: "2.0",
            timestamp: Date.now(),
            fecha_legible: new Date().toLocaleString(),
            checksum: "generado_automaticamente"
        },
        configuracion_global: {
            meta_diaria: oldData.globalConfig?.goalDaily || 15000,
            inicio_semana_timestamp: oldData.globalConfig?.weekStart || Date.now(),
            ultimo_update_timestamp: oldData.globalConfig?.lastUpdate || Date.now()
        },
        jugadores: {}
    };

    if (oldData.players) {
        Object.keys(oldData.players).forEach(name => {
            const p = oldData.players[name];

            // Cálculos básicos para rellenar estado_calculado (opcional pero bueno para referencia)
            const semanal = Math.max(0, (p.current || 0) - (p.previous || 0));

            newData.jugadores[name] = {
                datos_core: {
                    previous: p.previous || 0,
                    current: p.current || 0,
                    accumulated_base: p.accumulatedExcess || 0,
                    // CLAVE: Inicializamos las bases con los valores actuales para asegurar consistencia
                    total_base: p.total || 0,
                    acc_base: p.accumulatedExcess || 0,
                    deficit_covered: 0 // Asumimos 0 inicial
                },
                estado_calculado: {
                    semanal: semanal,
                    deficit_cubierto: 0,
                    exceso_semanal: 0,
                    acumulado_final: p.accumulatedExcess || 0,
                    eficiencia_aplicada: 1,
                    tier_color: '#28a745'
                },
                flags: {
                    is_new: p.isNew || false,
                    is_absent: p.absent || false
                },
                total_historico: p.total || 0
            };
        });
    }

    fs.writeFileSync(outputFile, JSON.stringify(newData, null, 2), 'utf8');
    console.log(`✅ Backup convertido exitosamente. Guardado en: ${outputFile}`);
    console.log(`Total jugadores procesados: ${Object.keys(newData.jugadores).length}`);

} catch (error) {
    console.error('Error al convertir backup:', error);
}
