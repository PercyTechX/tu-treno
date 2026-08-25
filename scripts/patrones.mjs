// Clasificación de los 1.324 ejercicios en patrones de movimiento.
//
// Es la pieza central del generador de sesiones. El motivo, comprobado sobre el
// dataset: si el generador elige por músculo objetivo, un principiante que pide
// pierna recibe 4 ejercicios (extensión y curl) y ni una sentadilla — mientras
// 27 sentadillas y pesos muertos de nivel 1 están archivados bajo "glutes".
// Eligiendo por patrón y dejando que el nivel decida sólo la VARIANTE, el
// movimiento nunca desaparece: como mucho baja de intensidad.

// Orden = prioridad. El primero que casa, gana.
export const PATRONES = [
  // — Descartes primero: no deben competir con los patrones de fuerza —
  { id: 'estiramiento', nombre: 'Estiramiento', grupo: 'movilidad', generable: false,
    re: /stretch|mobility|\bpose\b|cobra|child|sphinx|upward facing dog/ },
  { id: 'cardio', nombre: 'Cardio', grupo: 'cardio', generable: false,
    re: /treadmill|elliptical|stationary bike|air bike|stepmill|skierg|ergometer|cycle|walk|run\b|sprint|jog/ },
  { id: 'olimpico', nombre: 'Levantamiento olímpico', grupo: 'cuerpo entero', generable: true, nivelMin: 3,
    re: /clean|snatch|jerk|thruster/ },
  { id: 'pliometrico', nombre: 'Pliométrico', grupo: 'cuerpo entero', generable: true, nivelMin: 3,
    re: /jump|hop\b|plyo|depth|burpee|box jump|jack\b|skater/ },

  // — Tren superior: empuje —
  { id: 'empuje-horizontal', nombre: 'Empuje horizontal', grupo: 'pecho', generable: true,
    musculo: 'pectorals', secundarios: ['triceps', 'delts'],
    re: /bench press|chest press|floor press|push.?up|pushup|chest dip|svend/ },
  // Antes que 'apertura': si no, "reverse fly" y "rear fly" (10 ejercicios de
  // deltoides posterior) acaban archivados como pecho y salen en el día de pecho.
  { id: 'deltoide-posterior', nombre: 'Deltoides posterior', grupo: 'hombros', generable: true,
    musculo: 'delts', secundarios: ['upper back'],
    re: /rear delt|rear lateral|reverse fly|rear fly|bent.over lateral|reverse pec|y.raise/ },
  { id: 'apertura', nombre: 'Aperturas', grupo: 'pecho', generable: true,
    musculo: 'pectorals', secundarios: ['delts'],
    excluye: /reverse|rear|row\b|pulldown/,
    re: /\bfly\b|flye|flyes|crossover|cross.over|pec deck|butterfly/ },
  { id: 'empuje-vertical', nombre: 'Empuje vertical', grupo: 'hombros', generable: true,
    musculo: 'delts', secundarios: ['triceps'],
    re: /shoulder press|military press|overhead press|arnold|push press|handstand|pike push/ },

  // — Tren superior: tracción —
  { id: 'traccion-vertical', nombre: 'Tracción vertical', grupo: 'espalda', generable: true,
    musculo: 'lats', secundarios: ['biceps', 'upper back'],
    re: /pull.?up|chin.?up|pulldown|pull.down|muscle.up|lat pull/ },
  { id: 'traccion-horizontal', nombre: 'Tracción horizontal', grupo: 'espalda', generable: true,
    musculo: 'upper back', secundarios: ['lats', 'biceps'],
    re: /\brow\b|row\b|inverted row|face pull|pull apart|seal row/ },
  { id: 'pullover', nombre: 'Pullover', grupo: 'espalda', generable: true,
    musculo: 'lats', secundarios: ['pectorals'],
    re: /pullover/ },

  // — Hombro aislado —
  { id: 'elevacion-lateral', nombre: 'Elevación lateral', grupo: 'hombros', generable: true,
    musculo: 'delts', secundarios: ['traps'], re: /lateral raise|side raise|side lateral/ },
  { id: 'elevacion-frontal', nombre: 'Elevación frontal', grupo: 'hombros', generable: true,
    musculo: 'delts', secundarios: [], re: /front raise|frontal raise/ },
  { id: 'encogimiento', nombre: 'Encogimiento', grupo: 'espalda', generable: true,
    musculo: 'traps', secundarios: [], re: /shrug/ },

  // — Brazo —
  { id: 'curl-biceps', nombre: 'Curl de bíceps', grupo: 'brazos', generable: true,
    musculo: 'biceps', secundarios: ['forearms'],
    re: /curl/, excluye: /leg curl|wrist curl|femoral/ },
  // Los fondos salen de aquí: son un empuje multiarticular con riesgo de hombro
  // en el punto bajo, y "codos fijos, sólo se mueve el antebrazo" es un cue
  // peligrosamente equivocado para ellos.
  { id: 'fondo', nombre: 'Fondos', grupo: 'brazos', generable: true,
    musculo: 'triceps', secundarios: ['pectorals', 'delts'],
    re: /\bdip\b|\bdips\b/ },
  { id: 'extension-triceps', nombre: 'Extensión de tríceps', grupo: 'brazos', generable: true,
    musculo: 'triceps', secundarios: [],
    re: /triceps|tricep|pushdown|push.down|skullcrusher|skull crusher|kickback|french press/ },
  { id: 'antebrazo', nombre: 'Antebrazo', grupo: 'brazos', generable: true,
    musculo: 'forearms', secundarios: [],
    re: /wrist|gripper|forearm|finger/ },

  // — Tren inferior —
  { id: 'sentadilla', nombre: 'Sentadilla', grupo: 'piernas', generable: true,
    musculo: 'quads', secundarios: ['glutes', 'hamstrings'],
    re: /squat|leg press|hack|wall sit|sissy/, excluye: /split squat|bulgarian/ },
  { id: 'bisagra', nombre: 'Bisagra de cadera', grupo: 'piernas', generable: true,
    musculo: 'hamstrings', secundarios: ['glutes', 'spine'],
    re: /deadlift|good morning|hip thrust|hip raise|pull.through|swing|back extension|hyperextension|pelvic tilt|bridge|superman/ },
  { id: 'zancada', nombre: 'Zancada', grupo: 'piernas', generable: true,
    musculo: 'quads', secundarios: ['glutes'],
    re: /lunge|split squat|bulgarian|step.?up|curtsey|cossack/ },
  { id: 'extension-rodilla', nombre: 'Extensión de rodilla', grupo: 'piernas', generable: true,
    musculo: 'quads', secundarios: [], re: /leg extension|knee extension/ },
  { id: 'flexion-rodilla', nombre: 'Curl femoral', grupo: 'piernas', generable: true,
    musculo: 'hamstrings', secundarios: ['calves'], re: /leg curl|hamstring curl|nordic/ },
  { id: 'gemelo', nombre: 'Gemelo', grupo: 'piernas', generable: true,
    musculo: 'calves', secundarios: [], re: /calf|toe raise|heel raise/ },
  { id: 'aductor', nombre: 'Aductores y abductores', grupo: 'piernas', generable: true,
    musculo: 'adductors', secundarios: ['glutes'], re: /adduction|abduction|adductor|abductor|groin/ },
  { id: 'gluteo-aislado', nombre: 'Glúteo aislado', grupo: 'piernas', generable: true,
    musculo: 'glutes', secundarios: ['hamstrings'], re: /kickback|donkey|fire hydrant|glute/ },

  // — Core —
  { id: 'core-flexion', nombre: 'Flexión de tronco', grupo: 'abdomen', generable: true,
    musculo: 'abs', secundarios: [],
    re: /crunch|sit.?up|situp|v.?up|leg raise|knee raise|jackknife|toe touch|tuck/ },
  { id: 'core-antiextension', nombre: 'Anti-extensión', grupo: 'abdomen', generable: true,
    musculo: 'abs', secundarios: ['spine'],
    re: /plank|rollout|roller ?out|rollerer|dead bug|bird dog|hollow|fallout/ },
  { id: 'core-rotacion', nombre: 'Rotación de tronco', grupo: 'abdomen', generable: true,
    musculo: 'abs', secundarios: [],
    re: /twist|woodchop|wood chop|windmill|rotation|oblique|wiper|russian/ },
  { id: 'core-lateral', nombre: 'Flexión lateral', grupo: 'abdomen', generable: true,
    musculo: 'abs', secundarios: [], re: /side bend|side plank|\bbend\b|side crunch/ },

  // — Otros —
  { id: 'cuello', nombre: 'Cuello', grupo: 'cuello', generable: false,
    musculo: 'levator scapulae', secundarios: [], re: /neck/ },
  { id: 'carry', nombre: 'Transporte', grupo: 'cuerpo entero', generable: true, nivelMin: 2,
    musculo: 'forearms', secundarios: ['traps'], re: /farmer|carry|suitcase/ },
];

// Cuando el nombre no basta, el músculo objetivo del dataset decide. Cubre casos
// como "barbell decline wide-grip press", que es un press horizontal aunque no
// contenga la palabra "bench".
const RESPALDO_POR_MUSCULO = {
  'pectorals': 'empuje-horizontal', 'triceps': 'extension-triceps', 'biceps': 'curl-biceps',
  'delts': 'empuje-vertical', 'lats': 'traccion-vertical', 'upper back': 'traccion-horizontal',
  'traps': 'encogimiento', 'quads': 'sentadilla', 'hamstrings': 'bisagra',
  'glutes': 'bisagra', 'calves': 'gemelo', 'abs': 'core-flexion',
  'forearms': 'antebrazo', 'adductors': 'aductor', 'abductors': 'aductor',
  'spine': 'bisagra', 'serratus anterior': 'empuje-vertical',
  'cardiovascular system': 'cardio', 'levator scapulae': 'cuello',
};

// Casos con nombre propio que ninguna regla general acierta.
const ESPECIALES = [
  [/pallof/, 'core-rotacion'], [/y.raise|\bw\b raise|scapula/, 'deltoide-posterior'],
  [/heel touch|touchers/, 'core-lateral'], [/arm slinger|flutter|scissor/, 'core-flexion'],
  [/balance board|ankle circle/, 'gemelo'], [/back lever|front lever/, 'core-antiextension'],
];

export function clasificarPatron(nombreEn, musculoObjetivo) {
  const s = nombreEn.toLowerCase();
  for (const p of PATRONES) {
    if (p.excluye && p.excluye.test(s)) continue;
    if (p.re.test(s)) return p;
  }
  for (const [re, id] of ESPECIALES) {
    if (re.test(s)) return PATRONES.find(p => p.id === id);
  }
  const id = RESPALDO_POR_MUSCULO[musculoObjetivo];
  return id ? PATRONES.find(p => p.id === id) : null;
}

// — Nivel —
// Acumulativo: el nivel 3 ve todo; el 2 ve nivel 1 y 2. El nivel no elimina el
// patrón, sólo decide qué variante se elige dentro de él.
const EQUIPO_N1 = /^(assisted|leverage machine|smith machine|sled machine|cable|band|resistance band)$/;
const EQUIPO_N2 = /^(barbell|ez barbell|dumbbell|kettlebell|weighted|medicine ball|rope|trap bar)$/;
const AVANZADO = /muscle.up|planche|front lever|back lever|handstand|pistol|human flag|l.sit|iron cross|nordic|dragon/;
const INESTABLE = /stability ball|bosu|wheel|roller/;
const UNILATERAL = /single|one arm|one leg|split squat|bulgarian|pistol|archer|cossack/;
const EXPLOSIVO = /jump|hop\b|plyo|depth|clean|snatch|jerk|burpee|thruster|swing/;

export function esUnilateral(nombreEn) {
  return UNILATERAL.test(nombreEn.toLowerCase());
}

export function nivelDe(ex) {
  const s = ex.name.toLowerCase();
  if (AVANZADO.test(s)) return 3;
  if (EXPLOSIVO.test(s)) return 3;
  if (INESTABLE.test(ex.equipment) || INESTABLE.test(s)) return 3;
  // Unilateral NO sube a nivel 3: un press a una mano con mancuerna es más fácil
  // que un press de banca pesado. Es distinto, no difícil. Se marca aparte, y el
  // generador lo penaliza para que no salgan seis ejercicios a una mano seguidos.
  if (EQUIPO_N1.test(ex.equipment)) return 1;
  // Peso corporal básico es nivel 1: sin esto, un principiante no vería
  // ni una plancha ni una flexión — son 325 ejercicios, el 24,5% del dataset.
  if (ex.equipment === 'body weight') return 1;
  if (EQUIPO_N2.test(ex.equipment)) return 2;
  return 2;
}

// Compuesto = mueve más de una articulación. Va primero en la sesión.
const COMPUESTO = /bench press|chest press|shoulder press|military|overhead press|push.?up|dip\b|pull.?up|chin.?up|pulldown|row\b|squat|deadlift|leg press|lunge|step.?up|good morning|hip thrust|clean|snatch|jerk|thruster|muscle.up/;

const PATRONES_AISLAMIENTO = new Set([
  'apertura', 'elevacion-lateral', 'elevacion-frontal', 'deltoide-posterior',
  'encogimiento', 'curl-biceps', 'extension-triceps', 'antebrazo',
  'extension-rodilla', 'flexion-rodilla', 'gemelo', 'aductor', 'gluteo-aislado',
  'core-flexion', 'core-antiextension', 'core-rotacion', 'core-lateral',
  'estiramiento', 'cuello',
]);

export function esCompuesto(nombreEn, patronId) {
  // Lo decide el patrón, no el nombre: fiarse del nombre colaba
  // "dumbbell biceps curl squat" como compuesto, y ese curl recibía 4x6-10 con
  // dos minutos de descanso por llevar la palabra squat.
  if (patronId && PATRONES_AISLAMIENTO.has(patronId)) return false;
  return COMPUESTO.test(nombreEn.toLowerCase());
}

export function limpiarNombre(nombreEn) {
  return nombreEn
    .replace(/в°/g, '°')
    .replace(/\s*\((male|female)\)/gi, '')
    .replace(/\s*v\.\s*\d+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}
