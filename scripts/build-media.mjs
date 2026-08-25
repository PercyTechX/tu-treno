// Convierte los 1.324 GIFs animados y sus miniaturas a WebP dentro de public/media.
// Motivo: 126 MB de GIF hacen un APK de ~140 MB y arrancan lento. En WebP animado
// el mismo material baja a unos 40 MB sin pérdida visible a 180x180.

import { readdirSync, mkdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const ORIGEN = 'e:/DEV/TuEjercicio/exercises-dataset/';
const DESTINO = 'e:/DEV/TuEjercicio/app/public/media/';

const soloUno = process.argv.includes('--prueba');
const CALIDAD_GIF = 70;   // a 180x180 no se distingue de 100
const CALIDAD_IMG = 78;

async function convertir(carpeta, animado, calidad) {
  const dirOrigen = join(ORIGEN, carpeta);
  const dirDestino = join(DESTINO, carpeta);
  mkdirSync(dirDestino, { recursive: true });

  let archivos = readdirSync(dirOrigen);
  if (soloUno) archivos = archivos.slice(0, 1);

  let entrada = 0, salida = 0, hechos = 0, saltados = 0, fallos = [];

  for (const nombre of archivos) {
    const destino = join(dirDestino, nombre.replace(/\.(gif|jpe?g|png)$/i, '.webp'));
    const origen = join(dirOrigen, nombre);
    entrada += statSync(origen).size;

    if (existsSync(destino)) { salida += statSync(destino).size; saltados++; continue; }

    try {
      await sharp(origen, { animated: animado })
        .webp({ quality: calidad, effort: 4 })
        .toFile(destino);
      salida += statSync(destino).size;
      hechos++;
      if (hechos % 200 === 0) console.log(`  ${carpeta}: ${hechos} convertidos…`);
    } catch (e) {
      fallos.push(nombre + ' → ' + e.message);
    }
  }

  const mb = n => (n / 1024 / 1024).toFixed(1) + ' MB';
  console.log(`${carpeta}: ${hechos} convertidos, ${saltados} ya estaban, ${fallos.length} fallos`);
  console.log(`  ${mb(entrada)} → ${mb(salida)}  (${(100 - 100 * salida / entrada).toFixed(0)}% menos)`);
  if (fallos.length) console.log('  fallos:', fallos.slice(0, 5).join(' | '));
  return { entrada, salida };
}

const a = await convertir('videos', true, CALIDAD_GIF);
const b = await convertir('images', false, CALIDAD_IMG);
const mb = n => (n / 1024 / 1024).toFixed(1) + ' MB';
console.log(`\nTOTAL: ${mb(a.entrada + b.entrada)} → ${mb(a.salida + b.salida)}`);
