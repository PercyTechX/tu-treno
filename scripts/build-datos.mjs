// Construye el conjunto de datos que consume la app a partir del dataset original.
// Salida: app/datos.json

import { readFileSync, writeFileSync } from 'fs';
import { traducirNombre, aliasBusqueda, EQUIPO, MUSCULO } from './nombres.mjs';
import { clasificarPatron, nivelDe, esCompuesto, esUnilateral, limpiarNombre, PATRONES } from './patrones.mjs';

const ORIGEN = 'e:/DEV/TuEjercicio/exercises-dataset/data/exercises.json';
const DESTINO       = 'e:/DEV/TuEjercicio/app/datos.json';        // maqueta: todo junto
const DESTINO_INDICE = 'e:/DEV/TuEjercicio/app/src/datos/indice.json';  // app: sin pasos, va en el bundle
const DESTINO_PASOS  = 'e:/DEV/TuEjercicio/app/public/pasos.json';      // app: se pide al abrir una ficha

const bruto = JSON.parse(readFileSync(ORIGEN, 'utf8'));

const ejercicios = bruto.map(e => {
  const en = limpiarNombre(e.name);
  const patron = clasificarPatron(e.name, e.target);
  const t = traducirNombre(en, e.equipment);
  const nombre = t.es ?? en;

  // El patrón manda sobre el músculo del dataset: sin esto, la sentadilla
  // aparecería como ejercicio de glúteo.
  const musculoId = patron?.musculo ?? e.target;
  const secundariosId = patron?.secundarios?.length ? patron.secundarios : e.secondary_muscles;

  return {
    id: e.id,
    nombre,
    en,
    revisar: t.confianza === 'baja' || t.confianza === 'sin-patron' || undefined,
    patron: patron?.id ?? null,
    patronNombre: patron?.nombre ?? null,
    // Fuera del generador si no se pudo traducir: una app en español no puede
    // proponerte "spell caster" como segundo ejercicio del día de abdomen.
    // Siguen visibles en Explorar.
    generable: patron?.generable !== false && nombre !== en,
    musculo: MUSCULO[musculoId] ?? musculoId,
    secundarios: [...new Set(secundariosId.map(m => MUSCULO[m] ?? m))].slice(0, 3),
    equipo: e.equipment,
    equipoEs: EQUIPO[e.equipment] || 'peso corporal',
    nivel: nivelDe(e),
    compuesto: esCompuesto(e.name, patron?.id),
    unilateral: esUnilateral(e.name),
    img: e.image,
    gif: e.gif_url,
    pasos: e.instruction_steps.es,
    alias: aliasBusqueda(nombre, en),
  };
});

const kb = n => Math.round(n / 1024) + ' KB';

const patrones = Object.fromEntries(PATRONES.map(p => [p.id, { nombre: p.nombre, grupo: p.grupo }]));

writeFileSync(DESTINO, JSON.stringify({ ejercicios, patrones }));

// La app carga el indice sin los pasos: es lo que hace que arranque al instante.
// Los pasos (la mayor parte del peso) se piden solo al abrir una ficha.
const sinPasos = ejercicios.map(({ pasos, ...resto }) => resto);
const pasos = Object.fromEntries(ejercicios.map(e => [e.id, e.pasos]));
writeFileSync(DESTINO_INDICE, JSON.stringify({ ejercicios: sinPasos, patrones }));
writeFileSync(DESTINO_PASOS, JSON.stringify(pasos));
console.log('indice (sin pasos):', kb(JSON.stringify({ ejercicios: sinPasos, patrones }).length),
            '| pasos aparte:', kb(JSON.stringify(pasos).length));

// — Informe —
console.log('escrito', DESTINO, kb(JSON.stringify({ ejercicios, patrones }).length));
console.log('ejercicios:', ejercicios.length);
console.log('pendientes de repaso manual:', ejercicios.filter(e => e.revisar).length);
console.log('generables:', ejercicios.filter(e => e.generable).length,
            '| fuera del generador:', ejercicios.filter(e => !e.generable).length);
const porNivel = { 1: 0, 2: 0, 3: 0 };
ejercicios.forEach(e => porNivel[e.nivel]++);
console.log('niveles:', JSON.stringify(porNivel));
