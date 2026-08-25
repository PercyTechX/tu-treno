// Traducción estructural de nombres de ejercicio EN -> ES.
// No traduce palabra por palabra: identifica movimiento, cualificador, postura,
// agarre y equipo, y los recompone en el orden natural del español.

export const EQUIPO = {
  'barbell': 'con barra', 'ez barbell': 'con barra Z', 'olympic barbell': 'con barra olímpica',
  'dumbbell': 'con mancuernas', 'kettlebell': 'con kettlebell', 'cable': 'en polea',
  'band': 'con banda', 'resistance band': 'con banda elástica', 'body weight': '',
  'weighted': 'con lastre', 'leverage machine': 'en máquina', 'smith machine': 'en multipower',
  'sled machine': 'en máquina', 'assisted': 'asistido', 'stability ball': 'con fitball',
  'bosu ball': 'con bosu', 'medicine ball': 'con balón medicinal', 'rope': 'con cuerda',
  'roller': 'con rueda', 'wheel roller': 'con rueda abdominal', 'trap bar': 'con barra hexagonal',
  'hammer': 'con maza', 'tire': 'con neumático', 'stationary bike': 'en bicicleta estática',
  'elliptical machine': 'en elíptica', 'stepmill machine': 'en escaladora',
  'skierg machine': 'en skierg', 'upper body ergometer': 'en ergómetro de brazos',
};

export const MUSCULO = {
  'pectorals': 'Pecho', 'lats': 'Dorsal', 'upper back': 'Espalda alta', 'traps': 'Trapecio',
  'spine': 'Lumbares', 'delts': 'Hombros', 'serratus anterior': 'Serrato',
  'biceps': 'Bíceps', 'triceps': 'Tríceps', 'forearms': 'Antebrazo',
  'quads': 'Cuádriceps', 'hamstrings': 'Isquiotibiales', 'glutes': 'Glúteos',
  'adductors': 'Aductores', 'abductors': 'Abductores', 'calves': 'Gemelos',
  'abs': 'Abdomen', 'levator scapulae': 'Cuello', 'cardiovascular system': 'Cardio',
};

// Movimiento núcleo -> forma en español. El orden importa: se prueba de arriba abajo,
// así "bench press" gana a "press" y "preacher curl" gana a "curl".
const MOVIMIENTOS = [
  [/bench press/, 'Press de banca'], [/chest press/, 'Press de pecho'],
  [/(shoulder|military|overhead) press/, 'Press militar'], [/push press/, 'Push press'],
  [/floor press/, 'Press en el suelo'], [/leg press/, 'Prensa de piernas'],
  [/calf press/, 'Prensa de gemelos'], [/arnold press/, 'Press Arnold'],
  [/french press/, 'Press francés'], [/press/, 'Press'],

  [/preacher curl/, 'Curl predicador'], [/concentration curl/, 'Curl concentrado'],
  [/hammer curl/, 'Curl martillo'], [/spider curl/, 'Curl araña'],
  [/zottman curl/, 'Curl Zottman'], [/drag curl/, 'Curl drag'],
  [/wrist curl/, 'Curl de muñeca'], [/leg curl/, 'Curl femoral'],
  [/curl/, 'Curl'],

  [/upright row/, 'Remo al mentón'], [/row/, 'Remo'],
  [/pulldown|pull.down/, 'Jalón'], [/pullover/, 'Pullover'],
  [/pull.up|chin.up/, 'Dominadas'], [/muscle.up/, 'Muscle-up'],
  [/pushdown|push.down/, 'Extensión en polea'],
  [/fly|flye|flyes|crossover/, 'Aperturas'],

  [/lateral raise/, 'Elevación lateral'], [/front raise/, 'Elevación frontal'],
  [/calf raise/, 'Elevación de talones'], [/leg raise/, 'Elevación de piernas'],
  [/hip raise|hip thrust|pelvic tilt/, 'Empuje de cadera'],
  [/shoulder raise/, 'Elevación de hombros'], [/raise/, 'Elevación'],

  [/(triceps|tricep) extension/, 'Extensión de tríceps'],
  [/leg extension/, 'Extensión de cuádriceps'],
  [/back extension|hyperextension/, 'Hiperextensión'],
  [/extension/, 'Extensión'],
  [/kickback/, 'Patada de tríceps'], [/skullcrusher|skull crusher/, 'Press francés'],

  [/hack squat/, 'Hack squat'], [/split squat/, 'Sentadilla búlgara'],
  [/sissy squat/, 'Sentadilla sissy'], [/squat/, 'Sentadilla'],
  [/deadlift/, 'Peso muerto'], [/good morning/, 'Buenos días'],
  [/lunge/, 'Zancada'], [/step.up/, 'Subida al cajón'],

  [/sit.up|situp/, 'Abdominales'], [/crunch/, 'Crunch'],
  [/russian twist|twist/, 'Giro ruso'], [/plank/, 'Plancha'],
  [/bridge/, 'Puente'], [/leg lift/, 'Elevación de piernas'],
  [/dips|dip/, 'Fondos'], [/push.up|pushup/, 'Flexiones'],
  [/shrug/, 'Encogimiento de hombros'],

  [/clean/, 'Cargada'], [/snatch/, 'Arrancada'], [/jerk/, 'Envión'],
  [/swing/, 'Swing'], [/thruster/, 'Thruster'], [/burpee/, 'Burpee'],
  [/adduction/, 'Aducción'], [/abduction/, 'Abducción'],
  [/rotation/, 'Rotación'], [/pull.through/, 'Pull through'],
  [/stretch/, 'Estiramiento'], [/hold/, 'Isométrico'],

  [/mountain climber|climber/, 'Escalador'], [/bear crawl|crawl/, 'Gateo'],
  [/farmers walk|carry/, 'Paseo del granjero'], [/jumping jack|\bjack\b/, 'Jumping jack'],
  [/battling rope|battle rope/, 'Cuerdas de batalla'],
  [/turkish get.up|get.up/, 'Turkish get-up'],
  [/rollout|roller ?out|rollerer|rolleret/, 'Rueda abdominal'],
  [/jackknife|jack knife/, 'Navaja'], [/\bv.up\b|\bv up\b/, 'V-up'],
  [/windmill/, 'Molino'], [/superman/, 'Superman'], [/dead bug/, 'Dead bug'],
  [/bird dog/, 'Bird dog'], [/wiper/, 'Limpiaparabrisas'],
  [/scissor/, 'Tijeras'], [/flutter/, 'Aleteo'],
  [/face pull/, 'Face pull'], [/pull apart/, 'Pull apart'], [/pull.in/, 'Pull-in'],
  [/heel touch|toe touch|touchers|touch/, 'Toques'],
  [/side bend|bend/, 'Flexión lateral'], [/circles|circle/, 'Círculos'],
  // "calf" suelto: hay variantes sin la palabra "raise" (lever rotary calf)
  [/\bcalf\b|\bcalves\b/, 'Elevación de talones'],
  // "lever" es equipo, no movimiento: sólo vale como nombre propio del ejercicio
  [/back lever|front lever/, 'Lever'], [/planche/, 'Planche'],
  [/handstand/, 'Pino'], [/\bpike\b/, 'Pike'], [/\bbridge\b/, 'Puente'],
  [/balance/, 'Equilibrio'], [/shoulder tap|tap/, 'Toques de hombro'],
  [/air bike|bicycle|\bbike\b/, 'Bicicleta'], [/sled push|sled/, 'Empuje de trineo'],
  [/hip lift|lift/, 'Elevación'], [/kick/, 'Patada'], [/\bpose\b/, 'Postura'],
  [/jump|hop/, 'Salto'], [/run|sprint/, 'Carrera'], [/walk|march/, 'Caminata'],
  [/\brow_shoulder\b/, 'Remo'],
];

// Músculos que aparecen dentro del nombre y se añaden como "de X".
// Clave para estiramientos ("assisted prone rectus femoris stretch") y aislamientos.
const MUSCULO_EN_NOMBRE = [
  [/rectus femoris/, 'recto femoral'], [/pectoralis major|\bpec\b|\bpecs\b/, 'pectoral'],
  [/hamstrings?|femoral/, 'isquiotibiales'], [/quadriceps|\bquads?\b/, 'cuádriceps'],
  [/gluteus|\bglutes?\b/, 'glúteos'], [/\blats?\b|latissimus/, 'dorsal'],
  [/calf|calves/, 'gemelo'], [/obliques?/, 'oblicuos'],
  [/\bdelts?\b|deltoid/, 'deltoides'], [/\btraps?\b|trapezius/, 'trapecio'],
  [/tibialis/, 'tibial'], [/peroneals?/, 'peroneos'], [/serratus/, 'serrato'],
  [/adductors?|groin/, 'aductores'], [/abductors?/, 'abductores'],
  [/hip flexors?/, 'flexores de cadera'], [/\bspine\b|lumbar/, 'lumbares'],
  [/\bwrist\b/, 'muñeca'], [/\bankle\b/, 'tobillo'], [/\bneck\b/, 'cuello'],
  [/\bchest\b/, 'pecho'], [/\bbiceps?\b/, 'bíceps'], [/\btriceps?\b/, 'tríceps'],
  [/\bshoulders?\b/, 'hombro'], [/\bknees?\b/, 'rodilla'],
  [/\babs?\b|abdominal/, 'abdomen'], [/\bhips?\b/, 'cadera'],
  [/\bback\b/, 'espalda'], [/\bforearms?\b/, 'antebrazo'],
];

// Cualificadores que se pegan al movimiento, en orden de prioridad.
const CUALIF = [
  [/\bincline\b/, 'inclinado'], [/\bdecline\b/, 'declinado'],
  [/\bseated\b/, 'sentado'], [/\bstanding\b/, 'de pie'],
  [/\blying\b|\bsupine\b/, 'tumbado'], [/\bprone\b/, 'boca abajo'],
  [/\bkneeling\b/, 'de rodillas'], [/\bbent.over\b|\bbent\b/, 'inclinado al frente'],
  [/\bhanging\b/, 'colgado'], [/\bsuspended\b/, 'en suspensión'],
  [/\bclose grip\b|\bnarrow\b/, 'agarre cerrado'], [/\bwide grip\b|\bwide\b/, 'agarre abierto'],
  [/\bneutral grip\b|\bneutral\b/, 'agarre neutro'],
  [/\breverse grip\b|\bunderhand\b/, 'agarre supino'], [/\boverhand\b|\bpronated\b/, 'agarre prono'],
  [/\bbehind (the )?neck\b|\bbehind head\b/, 'tras la nuca'], [/\boverhead\b/, 'sobre la cabeza'],
  [/\bone arm\b|\bsingle arm\b|\bone.arm\b/, 'a una mano'],
  [/\bone leg\b|\bsingle leg\b|\bsingle.leg\b|\bone.leg\b/, 'a una pierna'],
  [/\balternat/, 'alterno'], [/\breverse\b/, 'inverso'],
  [/\bsumo\b/, 'sumo'], [/\bromanian\b/, 'rumano'],
  [/\bstiff.leg|\bstraight leg/, 'piernas rígidas'],
  [/\bside\b/, 'lateral'], [/\brear\b/, 'posterior'], [/\bfront\b/, 'frontal'],
  [/\bhalf\b/, 'parcial'], [/\bwall\b/, 'en la pared'],
  [/\bfloor\b/, 'en el suelo'], [/\bbench\b/, 'en banco'],
];

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

export function traducirNombre(nombreEn, equipo) {
  let s = ' ' + nombreEn.toLowerCase()
    .replace(/\(male\)|\(female\)|\(vertical\)|\(pov\)/g, '')
    .replace(/v\.\s*\d+/g, '')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ').trim() + ' ';

  let mov = null, movRe = null;
  for (const [re, es] of MOVIMIENTOS) {
    if (re.test(s)) { mov = es; movRe = re; break; }
  }
  if (!mov) return { es: null, confianza: 'sin-patron', resto: [] };
  s = s.replace(movRe, ' ');

  const movNorm = norm(mov.toLowerCase());

  // Músculo dentro del nombre -> "de X", salvo que el movimiento ya lo nombre
  let musculo = null;
  for (const [re, es] of MUSCULO_EN_NOMBRE) {
    if (re.test(s)) {
      s = s.replace(re, ' ');
      if (!movNorm.includes(norm(es))) { musculo = 'de ' + es; break; }
    }
  }

  // Palabra completa, no subcadena: "a una mano" no debe descartarse porque
  // "elevación lateral" contenga la letra "a".
  const yaDicho = palabra => new RegExp('\\b' + norm(palabra) + '\\b').test(movNorm);

  const quals = [];
  for (const [re, es] of CUALIF) {
    if (quals.length >= 2) break;
    if (re.test(s) && !yaDicho(es.split(' ').filter(p => p.length > 2)[0] ?? es)) {
      quals.push(es);
      s = s.replace(re, ' ');
    }
  }

  const eq = EQUIPO[equipo] ?? '';
  let out = [mov, musculo, ...quals, eq].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  out = out.charAt(0).toUpperCase() + out.slice(1);

  const resto = s
    .replace(/\b(the|a|an|of|on|in|with|to|and|for|up|down|over|two|both|arm|arms|leg|legs|body|exercise|machine|bar|grip|version|weighted|barbell|dumbbell|cable|band|kettlebell|lever|smith|ez|assisted|ball|stability|medicine|bosu|rope|roller|sled|weight|bodyweight)\b/g, ' ')
    .replace(/[^a-z ]/g, ' ').trim().split(/\s+/).filter(Boolean);

  return {
    es: out,
    confianza: resto.length === 0 ? 'alta' : resto.length === 1 ? 'media' : 'baja',
    resto,
  };
}

export function aliasBusqueda(es, en) {
  const set = new Set();
  const base = norm(es.toLowerCase());
  set.add(base);
  set.add(norm(en.toLowerCase()));
  // "press de banca" -> "press banca": nadie escribe las preposiciones entre series
  set.add(base.replace(/\b(de|del|la|el|en|con|al|a)\b/g, ' ').replace(/\s+/g, ' ').trim());
  return [...set].filter(Boolean);
}
