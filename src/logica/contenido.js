// Técnica, errores comunes y prescripción.
//
// El dataset no trae nada de esto: ni series, ni reps, ni descansos, ni cues.
// Se escribe por PATRÓN de movimiento (31) en lugar de por ejercicio (1.324),
// que es lo que hace el trabajo abarcable sin perder calidad: los cues de una
// sentadilla con barra y de una sentadilla en multipower son los mismos.
//
// Máximo 3 cues por patrón: entre series nadie lee diez viñetas.

export const CONTENIDO = {
  'empuje-horizontal': {
    tecnica: [
      'Junta los omóplatos y llévalos hacia abajo antes de empezar. Ese es tu apoyo: mantenlo toda la serie.',
      'Baja controlado hasta la mitad del pecho, con los codos a unos 45° del torso, no abiertos en cruz.',
      'Pies firmes en el suelo y empuja como si quisieras separarte del banco.',
    ],
    errores: [
      'Abrir los codos a 90°: castiga el hombro y no añade pecho.',
      'Rebotar la barra en el pecho para sacar la repetición.',
      'Levantar la cadera del banco al fallar.',
    ],
  },
  'apertura': {
    tecnica: [
      'Codos con una flexión fija y ligera durante todo el recorrido. No se abren ni se cierran.',
      'Abre hasta sentir estiramiento en el pecho, sin pasar de la línea de los hombros.',
      'Cierra pensando en juntar los codos, no las manos.',
    ],
    errores: [
      'Convertirlo en un press doblando y estirando los codos.',
      'Llevar los brazos por detrás de la línea del hombro buscando rango extra.',
    ],
  },
  'empuje-vertical': {
    tecnica: [
      'Aprieta glúteos y abdomen antes de empujar: evita que la espalda se arquee.',
      'La barra o mancuernas suben en línea recta sobre la cabeza, no por delante.',
      'Al bloquear, mete la cabeza hacia delante hasta que el peso quede justo encima de la coronilla.',
    ],
    errores: [
      'Arquear la zona lumbar para compensar falta de movilidad de hombro.',
      'Empujar hacia delante en vez de hacia arriba.',
    ],
  },
  'traccion-vertical': {
    tecnica: [
      'Empieza bajando los omóplatos antes de doblar los codos. El brazo tira, la espalda manda.',
      'Lleva el pecho hacia la barra, no la barbilla.',
      'Baja del todo entre repeticiones para conservar el rango completo.',
    ],
    errores: [
      'Balancearse para subir con impulso.',
      'Parar a media bajada y perder el estiramiento del dorsal.',
      'Encoger los hombros hacia las orejas al tirar.',
    ],
  },
  'traccion-horizontal': {
    tecnica: [
      'Pecho alto y espalda neutra: la fuerza sale de la espalda, no de la lumbar.',
      'Tira llevando el codo hacia atrás y pasa el peso hacia el ombligo o las costillas bajas.',
      'Aguanta un instante con los omóplatos juntos antes de soltar.',
    ],
    errores: [
      'Tirar con los bíceps y dejar la espalda quieta.',
      'Redondear la espalda al estirar los brazos.',
      'Usar el balanceo del torso como motor.',
    ],
  },
  'pullover': {
    tecnica: [
      'Codos casi fijos: el movimiento sale del hombro, no del codo.',
      'Estira hasta notar tensión en el dorsal y las costillas, sin forzar el hombro.',
      'Costillas hacia abajo y abdomen apretado para que no se arquee la espalda.',
    ],
    errores: [
      'Dejar que la lumbar se arquee al llevar el peso atrás.',
      'Ir demasiado pesado y perder el control en el estiramiento.',
    ],
  },
  'elevacion-lateral': {
    tecnica: [
      'Codo ligeramente flexionado y fijo. Sube guiando con el codo, no con la mano.',
      'Sube solo hasta la altura del hombro: más arriba entra el trapecio.',
      'Baja lento — es donde está el trabajo real.',
    ],
    errores: [
      'Impulsar con las piernas o la espalda.',
      'Encoger los hombros hacia las orejas.',
      'Usar demasiado peso: aquí la carga sobra siempre.',
    ],
  },
  'elevacion-frontal': {
    tecnica: [
      'Sube hasta la altura de los ojos, no más.',
      'Abdomen apretado para que el torso no se vaya hacia atrás.',
      'Controla la bajada en lugar de dejar caer el peso.',
    ],
    errores: [
      'Balancear el cuerpo para arrancar el movimiento.',
      'Alternar sin control y perder tensión.',
    ],
  },
  'deltoide-posterior': {
    tecnica: [
      'Inclina el torso y déjalo quieto: si se mueve, ya no es el hombro trabajando.',
      'Abre llevando los codos hacia fuera y atrás, no hacia arriba.',
      'Poco peso y pausa arriba: es un músculo pequeño.',
    ],
    errores: [
      'Convertirlo en un remo tirando con la espalda.',
      'Subir el torso a la vez que los brazos.',
    ],
  },
  'encogimiento': {
    tecnica: [
      'Sube los hombros recto hacia las orejas y aguanta un segundo arriba.',
      'Brazos relajados: solo cuelgan del peso.',
      'Baja del todo para estirar el trapecio.',
    ],
    errores: [
      'Rotar los hombros en círculos: no aporta nada y castiga la articulación.',
      'Ayudarte con los bíceps.',
    ],
  },
  'curl-biceps': {
    tecnica: [
      'Codos pegados al costado y quietos durante toda la serie.',
      'Sube sin mover el codo y aprieta arriba del todo un instante.',
      'Baja controlado hasta estirar el brazo por completo.',
    ],
    errores: [
      'Balancear el torso para subir el peso.',
      'Adelantar los codos: convierte el curl en una elevación de hombro.',
      'Parar a media bajada y perder la mitad del recorrido.',
    ],
  },
  'extension-triceps': {
    tecnica: [
      'Codos fijos y pegados al cuerpo: el hombro no se mueve, sólo el antebrazo.',
      'Estira del todo y aprieta un instante al final.',
      'Vuelve controlado hasta sentir estiramiento en el tríceps.',
    ],
    errores: [
      'Abrir los codos hacia los lados al fatigarte.',
      'Mover el hombro para ayudar en las últimas repeticiones.',
      'Bajar el peso a tirones en vez de acompañarlo.',
    ],
  },
  // Los fondos tienen patrón propio: son un empuje multiarticular con riesgo de
  // hombro en el punto bajo. Recibían los cues de extensión de tríceps
  // ("codos fijos, sólo se mueve el antebrazo"), que para un fondo son falsos.
  'fondo': {
    tecnica: [
      'Hombros abajo y atrás, nunca encogidos hacia las orejas.',
      'Baja hasta que el codo forme algo más de 90°. Más abajo castiga el hombro sin ganar nada.',
      'Torso vertical si buscas tríceps; inclinado hacia delante si buscas pecho.',
    ],
    errores: [
      'Bajar hasta el fondo dejando caer los hombros.',
      'Balancear las piernas para sacar la repetición.',
      'Empezar con lastre antes de dominar el movimiento con tu peso.',
    ],
  },
  'antebrazo': {
    tecnica: [
      'Apoya el antebrazo y deja que solo trabaje la muñeca.',
      'Recorrido completo: baja hasta abrir un poco los dedos y sube apretando.',
      'Series largas — el antebrazo responde al tiempo bajo tensión.',
    ],
    errores: [
      'Levantar el antebrazo del apoyo.',
      'Cargar demasiado y reducir el recorrido a un temblor.',
    ],
  },
  'sentadilla': {
    tecnica: [
      'Aprieta el abdomen como si fueras a recibir un golpe antes de bajar.',
      'Rodillas hacia fuera, en la línea de las puntas de los pies.',
      'Baja hasta donde puedas mantener la espalda recta; con la práctica llegarás a pasar la paralela.',
    ],
    errores: [
      'Que las rodillas se metan hacia dentro al subir.',
      'Levantar los talones del suelo.',
      'Redondear la espalda baja en el punto más profundo.',
    ],
  },
  'bisagra': {
    tecnica: [
      'Aprieta el abdomen y toma aire antes de cada repetición: es lo que sostiene la espalda.',
      'Lleva la cadera atrás manteniendo la espalda recta: es una bisagra, no una sentadilla.',
      'La barra o el peso van pegados al cuerpo todo el recorrido.',
    ],
    errores: [
      'Redondear la espalda baja: es la lesión más común del gimnasio.',
      'Separar la barra de las piernas.',
      'Hiperextender la espalda al final en vez de bloquear con glúteo.',
    ],
  },
  'zancada': {
    tecnica: [
      'Torso erguido y mirada al frente.',
      'Baja recto hasta que la rodilla de atrás casi toque el suelo.',
      'Empuja con el talón de la pierna de delante para volver.',
    ],
    errores: [
      'Dar un paso corto y castigar la rodilla delantera.',
      'Inclinar el torso hacia delante.',
      'Perder el equilibrio por mirar al suelo.',
    ],
  },
  'extension-rodilla': {
    tecnica: [
      'Ajusta el respaldo para que la rodilla coincida con el eje de la máquina.',
      'Estira del todo y aprieta el cuádriceps arriba.',
      'Baja controlado sin dejar que las pesas choquen.',
    ],
    errores: [
      'Impulsar con la cadera despegando la espalda del respaldo.',
      'Cargar tanto que la rodilla haga tope de golpe.',
    ],
  },
  'flexion-rodilla': {
    tecnica: [
      'Cadera pegada al banco durante toda la serie.',
      'Sube hasta el final del recorrido y aguanta un instante.',
      'Baja lento: el isquio trabaja sobre todo al estirarse.',
    ],
    errores: [
      'Despegar la cadera para ayudarte.',
      'Dejar caer el peso en la fase de bajada.',
    ],
  },
  'gemelo': {
    tecnica: [
      'Recorrido completo: baja el talón hasta estirar y sube hasta la punta del pie.',
      'Aguanta un segundo arriba en cada repetición.',
      'Ritmo lento: el gemelo aguanta mucho y responde al tiempo bajo tensión.',
    ],
    errores: [
      'Rebotar aprovechando el tendón sin trabajar el músculo.',
      'Recorrido de dos dedos con mucho peso.',
    ],
  },
  'aductor': {
    tecnica: [
      'Movimiento lento y controlado en las dos direcciones.',
      'Espalda apoyada y abdomen activo.',
      'Rango cómodo: la ingle no se fuerza.',
    ],
    errores: [
      'Soltar el peso de golpe al volver.',
      'Buscar rango extra empujando con las manos.',
    ],
  },
  'gluteo-aislado': {
    tecnica: [
      'Abdomen apretado para que el movimiento salga de la cadera y no de la espalda.',
      'Aprieta el glúteo arriba y aguanta un instante.',
      'Recorrido corto y controlado, sin impulso.',
    ],
    errores: [
      'Arquear la lumbar para subir más la pierna.',
      'Ir rápido y perder la contracción.',
    ],
  },
  'core-flexion': {
    tecnica: [
      'Enrolla la columna vértebra a vértebra en vez de subir en bloque.',
      'Exhala al subir y aprieta el abdomen arriba.',
      'Baja lento sin dejarte caer.',
    ],
    errores: [
      'Tirar del cuello con las manos.',
      'Usar impulso de brazos o piernas.',
      'Arquear la lumbar al bajar las piernas.',
    ],
  },
  'core-antiextension': {
    tecnica: [
      'Cuerpo en línea recta de la cabeza a los talones.',
      'Mete la pelvis y aprieta glúteos: evita que la lumbar se hunda.',
      'Respira con normalidad — si aguantas la respiración, no llegas.',
    ],
    errores: [
      'Subir la cadera para descansar.',
      'Hundir la zona lumbar.',
      'Aguantar más tiempo con la postura rota en vez de parar.',
    ],
  },
  'core-rotacion': {
    tecnica: [
      'La rotación sale del tronco, no de los brazos.',
      'Abdomen apretado y movimiento controlado en ambos sentidos.',
      'Mantén el pecho alto y la espalda recta.',
    ],
    errores: [
      'Mover solo los brazos de lado a lado.',
      'Redondear la espalda al girar.',
    ],
  },
  'core-lateral': {
    tecnica: [
      'Baja por el costado sin girar el torso ni echarlo hacia delante.',
      'Recorrido corto y contracción marcada.',
      'Trabaja los dos lados por igual.',
    ],
    errores: [
      'Inclinarte hacia delante en vez de al lateral.',
      'Cargar tanto peso que el recorrido desaparece.',
    ],
  },
  'olimpico': {
    tecnica: [
      'La barra sube pegada al cuerpo, siempre.',
      'La potencia sale de la extensión de cadera, no de los brazos.',
      'Recibe el peso con las rodillas flexionadas y el torso firme.',
    ],
    errores: [
      'Tirar con los brazos antes de extender la cadera.',
      'Separar la barra del cuerpo y perder la línea.',
      'Intentar cargas altas antes de dominar la técnica.',
    ],
  },
  'pliometrico': {
    tecnica: [
      'Aterriza suave, con la rodilla flexionada y el pie completo.',
      'Calidad sobre cantidad: si el salto pierde altura, se acabó la serie.',
      'Descansa lo suficiente: es trabajo de sistema nervioso, no de fatiga.',
    ],
    errores: [
      'Caer con las piernas rígidas.',
      'Encadenar repeticiones cuando ya no hay potencia.',
    ],
  },
  'carry': {
    tecnica: [
      'Pecho alto, hombros atrás y abdomen apretado.',
      'Pasos cortos y firmes, sin balancear el peso.',
      'Mide por distancia o tiempo, no por repeticiones.',
    ],
    errores: [
      'Encorvar la espalda al fatigarte.',
      'Andar deprisa y perder el control del peso.',
    ],
  },
  'cardio': {
    tecnica: [
      'Empieza suave unos minutos antes de subir la intensidad.',
      'Mantén una postura erguida y relajada.',
      'Si no puedes decir una frase corta, has pasado tu ritmo.',
    ],
    errores: ['Agarrarte a la máquina y descargar el peso del cuerpo.'],
  },
  'estiramiento': {
    tecnica: [
      'Entra en la postura lento y para donde notes tensión, no dolor.',
      'Mantén 20-30 segundos respirando con normalidad.',
      'Mejor al terminar de entrenar que antes.',
    ],
    errores: ['Rebotar dentro del estiramiento.', 'Aguantar la respiración.'],
  },
  'cuello': {
    tecnica: [
      'Recorrido corto y muy controlado.',
      'Nada de peso hasta dominar el movimiento sin él.',
      'Para al primer signo de molestia.',
    ],
    errores: ['Usar impulso.', 'Buscar rango máximo en una zona delicada.'],
  },
};

// — Prescripción —
// El dataset no trae series ni reps. Se derivan del objetivo del usuario y de si
// el ejercicio es compuesto (multiarticular, va primero y pesado) o de
// aislamiento (un solo grupo, más repeticiones y menos descanso).

export const OBJETIVOS = {
  fuerza: {
    nombre: 'Fuerza',
    compuesto: { series: 5, reps: '3-5', descanso: 180 },
    aislamiento: { series: 3, reps: '6-8', descanso: 120 },
    ejerciciosPorSesion: 5,
  },
  hipertrofia: {
    nombre: 'Hipertrofia',
    compuesto: { series: 4, reps: '6-10', descanso: 120 },
    aislamiento: { series: 3, reps: '10-15', descanso: 60 },
    ejerciciosPorSesion: 6,
  },
  resistencia: {
    nombre: 'Resistencia',
    compuesto: { series: 3, reps: '12-15', descanso: 60 },
    aislamiento: { series: 3, reps: '15-20', descanso: 30 },
    ejerciciosPorSesion: 7,
  },
};

export function prescribir(objetivo, compuesto) {
  const o = OBJETIVOS[objetivo] ?? OBJETIVOS.hipertrofia;
  return o[compuesto ? 'compuesto' : 'aislamiento'];
}

export function formatoDescanso(segundos) {
  if (segundos < 60) return segundos + ' s';
  const m = Math.floor(segundos / 60), s = segundos % 60;
  return s ? `${m}:${String(s).padStart(2, '0')} min` : `${m} min`;
}
