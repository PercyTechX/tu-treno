// Generador de sesiones.
//
// Regla central: se elige por PATRÓN de movimiento, y el nivel decide sólo la
// variante dentro del patrón. Si un patrón no tiene variante en tu nivel, se
// coge la del nivel más cercano — el movimiento nunca desaparece de la sesión.

import { OBJETIVOS } from './contenido.js';

// Cada chip de músculo, con sus patrones en orden de prioridad:
// el primero es el compuesto pesado que abre la sesión.
export const GRUPOS = {
  pecho:      { nombre: 'Pecho',        patrones: ['empuje-horizontal', 'apertura'] },
  espalda:    { nombre: 'Espalda',      patrones: ['traccion-vertical', 'traccion-horizontal', 'pullover'] },
  hombros:    { nombre: 'Hombros',      patrones: ['empuje-vertical', 'elevacion-lateral', 'deltoide-posterior', 'elevacion-frontal'] },
  biceps:     { nombre: 'Bíceps',       patrones: ['curl-biceps'] },
  triceps:    { nombre: 'Tríceps',      patrones: ['extension-triceps'] },
  cuadriceps: { nombre: 'Cuádriceps',   patrones: ['sentadilla', 'zancada', 'extension-rodilla'] },
  isquios:    { nombre: 'Isquios',      patrones: ['bisagra', 'flexion-rodilla'] },
  gluteos:    { nombre: 'Glúteos',      patrones: ['bisagra', 'zancada', 'gluteo-aislado'] },
  gemelos:    { nombre: 'Gemelos',      patrones: ['gemelo'] },
  abdomen:    { nombre: 'Abdomen',      patrones: ['core-antiextension', 'core-flexion', 'core-rotacion', 'core-lateral'] },
  antebrazo:  { nombre: 'Antebrazo',    patrones: ['antebrazo'] },
  trapecio:   { nombre: 'Trapecio',     patrones: ['encogimiento'] },
  lumbares:   { nombre: 'Lumbares',     patrones: ['bisagra', 'core-antiextension'] },
};

export const PRESETS = [
  { id: 'empuje', nombre: 'Empuje', grupos: ['pecho', 'hombros', 'triceps'] },
  { id: 'tiron',  nombre: 'Tirón',  grupos: ['espalda', 'biceps'] },
  { id: 'pierna', nombre: 'Pierna', grupos: ['cuadriceps', 'isquios', 'gemelos'] },
  { id: 'torso',  nombre: 'Torso',  grupos: ['pecho', 'espalda', 'hombros'] },
  // Por patrones, no por grupos: como día de tres grupos daba cinco compuestos
  // con barra, cero bisagra, cero hombro y cero core. Eso no es cuerpo completo.
  { id: 'completo', nombre: 'Cuerpo completo', grupos: [],
    patrones: ['sentadilla', 'empuje-horizontal', 'traccion-horizontal', 'bisagra', 'empuje-vertical', 'core-antiextension'] },
];

export const MAX_GRUPOS = 3;

// El primer grupo tocado es el principal y se lleva el grueso del volumen.
const REPARTO = { 1: [1], 2: [0.6, 0.4], 3: [0.5, 0.3, 0.2] };

// Tope duro por patrón. La bisagra es el movimiento con más riesgo del gimnasio
// y glúteos, isquios y lumbares la comparten: sin este tope salían tres bisagras
// cargadas con barra en la misma sesión, dos de ellas peso muerto.
const TOPE_PATRON = { bisagra: 1, sentadilla: 1, olimpico: 1, pliometrico: 1 };
const TOPE_POR_DEFECTO = 2;

// Preferencia de equipo al elegir variante. Se separa por tipo de ejercicio
// porque no coinciden: en un compuesto la barra es lo natural, pero una
// elevación lateral con barra (landmine) es una rareza que nadie espera ver.
const PREF_COMPUESTO = ['barbell', 'dumbbell', 'leverage machine', 'smith machine', 'cable',
  'body weight', 'ez barbell', 'kettlebell', 'band', 'assisted'];
const PREF_AISLAMIENTO = ['dumbbell', 'cable', 'leverage machine', 'ez barbell', 'band',
  'body weight', 'kettlebell', 'smith machine', 'barbell', 'assisted'];

function puntuar(ex, nivelUsuario) {
  let p = 0;
  // Distancia en valor absoluto: la versión anterior PREMIABA subir de nivel, y
  // por eso un usuario avanzado recibía seis ejercicios a una mano seguidos.
  // El nivel 3 significa "puedo con todo", no "dame sólo lo del tope".
  p -= Math.abs(nivelUsuario - ex.nivel) * 10;
  // El bilateral gana siempre que exista: lo unilateral está a un toque en
  // "Cambiar por otro", que es justo para lo que sirve ese botón.
  if (ex.unilateral) p -= 25;
  const pref = ex.compuesto ? PREF_COMPUESTO : PREF_AISLAMIENTO;
  const i = pref.indexOf(ex.equipo);
  p += i === -1 ? 0 : (pref.length - i) * 2;
  if (ex.compuesto) p += 5;
  // Nombres cortos suelen ser el movimiento canónico, no una variante rara.
  p -= ex.nombre.length / 20;
  return p;
}

export function elegirVariante(ejercicios, patronId, nivelUsuario, yaUsados, nombresUsados, semilla = 0) {
  // Se descarta por nombre además de por id: al traducir, 187 ejercicios
  // distintos colapsan en el mismo texto, y repetir "Press de banca con barra"
  // dos veces en la misma sesión parece un error aunque sean ids diferentes.
  const delPatron = ejercicios.filter(e =>
    e.patron === patronId && e.generable && !yaUsados.has(e.id) && !nombresUsados.has(e.nombre));
  if (!delPatron.length) return null;

  // Nivel del usuario hacia abajo (acumulativo). Si está vacío, se sube al nivel
  // más cercano en lugar de dejar el patrón fuera.
  let cand = delPatron.filter(e => e.nivel <= nivelUsuario);
  if (!cand.length) {
    const min = Math.min(...delPatron.map(e => e.nivel));
    cand = delPatron.filter(e => e.nivel === min);
  }
  const orden = cand.sort((a, b) => puntuar(b, nivelUsuario) - puntuar(a, nivelUsuario));
  // Entre los que empatan casi con el mejor decide la semilla. Sin esto el
  // generador es determinista y "Otra sesión" devolvía una lista idéntica:
  // un botón que no hace nada es peor que no tener botón.
  const techo = puntuar(orden[0], nivelUsuario);
  const empatados = orden.filter(e => puntuar(e, nivelUsuario) > techo - 5);
  return empatados[semilla % empatados.length];
}

// Cuando a un grupo le sobran huecos (bíceps sólo tiene un patrón), se tira del
// sinergista en vez de dejar el cupo corto. Es lo que haría un entrenador.
const SINERGISTA = {
  'curl-biceps': ['traccion-horizontal', 'traccion-vertical'],
  'extension-triceps': ['empuje-horizontal', 'fondo'],
  'fondo': ['empuje-horizontal', 'extension-triceps'],
  'gemelo': ['zancada'],
  'antebrazo': ['curl-biceps'],
  'encogimiento': ['traccion-horizontal'],
  'flexion-rodilla': ['bisagra'],
  'extension-rodilla': ['sentadilla', 'zancada'],
};

export function generarSesion(ejercicios, gruposSel, { nivel = 2, objetivo = 'hipertrofia', semilla = 0 } = {}) {
  const grupos = gruposSel.slice(0, MAX_GRUPOS);
  const total = OBJETIVOS[objetivo]?.ejerciciosPorSesion ?? 6;
  const pesos = REPARTO[grupos.length] ?? [1];

  const usados = new Set();
  const nombresUsados = new Set();
  const cuentaPatron = {};
  const seleccion = [];

  const cabe = patronId => (cuentaPatron[patronId] ?? 0) < (TOPE_PATRON[patronId] ?? TOPE_POR_DEFECTO);

  function intentar(patronId, gid) {
    if (!cabe(patronId)) return false;
    const ex = elegirVariante(ejercicios, patronId, nivel, usados, nombresUsados, semilla);
    if (!ex) return false;
    usados.add(ex.id);
    nombresUsados.add(ex.nombre);
    cuentaPatron[patronId] = (cuentaPatron[patronId] ?? 0) + 1;
    seleccion.push({ ...ex, grupo: gid });
    return true;
  }

  grupos.forEach((gid, i) => {
    const grupo = GRUPOS[gid];
    if (!grupo) return;
    const cuota = Math.max(1, Math.round(total * pesos[i]));
    let puestos = 0;

    // Primera pasada: un ejercicio por patrón del grupo, en orden de prioridad.
    for (const patronId of grupo.patrones) {
      if (puestos >= cuota) break;
      if ((cuentaPatron[patronId] ?? 0) > 0) continue;
      if (intentar(patronId, gid)) puestos++;
    }
    // Segunda: repetir patrón con otra variante, respetando el tope.
    for (const patronId of grupo.patrones) {
      if (puestos >= cuota) break;
      if (intentar(patronId, gid)) puestos++;
    }
    // Tercera: sinergistas, para que la barra no prometa 6 y entregue 2.
    for (const patronId of grupo.patrones) {
      if (puestos >= cuota) break;
      for (const s of SINERGISTA[patronId] ?? []) {
        if (puestos >= cuota) break;
        if (intentar(s, gid)) puestos++;
      }
    }
  });

  return ordenar(seleccion, grupos);
}

// Un compuesto por patrón fundamental. El preset de cuerpo completo no puede
// salir de tres grupos: daba cinco compuestos con barra y cero bisagra, cero
// hombro y cero core.
export function generarPorPatrones(ejercicios, patronIds, { nivel = 2, semilla = 0 } = {}) {
  const usados = new Set(), nombres = new Set(), seleccion = [];
  for (const pid of patronIds) {
    const ex = elegirVariante(ejercicios, pid, nivel, usados, nombres, semilla);
    if (!ex) continue;
    usados.add(ex.id); nombres.add(ex.nombre);
    seleccion.push({ ...ex, grupo: null });
  }
  return ordenar(seleccion, []);
}

// Compuestos primero, pero sin encadenar dos que carguen lo mismo: sentadilla →
// zancada → peso muerto es una apertura salvaje que llega al peso muerto con la
// lumbar ya frita.
function ordenar(seleccion, grupos) {
  const lista = seleccion.sort((a, b) => {
    if (a.compuesto !== b.compuesto) return a.compuesto ? -1 : 1;
    return grupos.indexOf(a.grupo) - grupos.indexOf(b.grupo);
  });
  for (let i = 1; i < lista.length - 1; i++) {
    const a = lista[i - 1], b = lista[i];
    if (a.compuesto && b.compuesto && a.musculo === b.musculo && lista[i + 1]) {
      [lista[i], lista[i + 1]] = [lista[i + 1], lista[i]];
    }
  }
  return lista;
}

// El reparto sale de una generación real, no de una fórmula: la fórmula
// prometía "Bíceps 6" y la sesión traía 2 en 9 de los 13 grupos.
export function repartoTexto(ejercicios, gruposSel, { nivel = 2, objetivo = 'hipertrofia', semilla = 0 } = {}) {
  const grupos = gruposSel.slice(0, MAX_GRUPOS);
  if (!grupos.length) return '';
  const lista = generarSesion(ejercicios, grupos, { nivel, objetivo, semilla });
  return grupos
    .map(g => `${GRUPOS[g].nombre} ${lista.filter(e => e.grupo === g).length}`)
    .join(' · ');
}

// Alternativas para "Cambiar por otro". Mezcla niveles a propósito — es la vía
// de progresión — pero ordena por el nivel del usuario, para que las primeras
// sean cosas que puede hacer AHORA, que es el caso real: la máquina está ocupada.
export function alternativas(ejercicios, ex, n = 3, { nivel = ex.nivel, excluirIds = [] } = {}) {
  const vistos = new Set([ex.nombre]);
  const fuera = new Set(excluirIds);
  return ejercicios
    .filter(e => {
      if (e.patron !== ex.patron || e.id === ex.id || !e.generable || fuera.has(e.id)) return false;
      if (vistos.has(e.nombre)) return false;   // no ofrecer el mismo nombre dos veces
      vistos.add(e.nombre);
      return true;
    })
    .sort((a, b) => puntuar(b, nivel) - puntuar(a, nivel))
    .slice(0, n);
}
