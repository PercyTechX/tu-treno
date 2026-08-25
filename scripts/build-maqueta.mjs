// Genera maqueta/tu-treno.html: un único archivo que se abre en el navegador
// sin servidor. Los módulos se incrustan porque file:// bloquea los import.

import { readFileSync, writeFileSync } from 'fs';

const BASE = 'e:/DEV/TuEjercicio/app/';
const leer = p => readFileSync(BASE + p, 'utf8');

// Quita import/export para que los módulos funcionen como script plano.
const aplanar = src => src
  .replace(/^\s*import[^;]+;$/gm, '')
  .replace(/^export\s+/gm, '');

const logica = [
  aplanar(leer('src/logica/contenido.js')),
  aplanar(leer('src/logica/generador.js')),
].join('\n\n');

// La maqueta no necesita los pasos de los 1.324: sólo de los que se pueden ver.
const datos = JSON.parse(leer('datos.json'));

const html = leer('maqueta/plantilla.html')
  .replace('/*__LOGICA__*/', logica)
  .replace('/*__DATOS__*/', JSON.stringify(datos));

const destino = BASE + 'maqueta/tu-treno.html';
writeFileSync(destino, html);
console.log('escrito', destino, Math.round(html.length / 1024) + ' KB');
