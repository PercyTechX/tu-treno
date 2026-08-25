// Persistencia.
//
// Dos cosas distintas y deliberadamente separadas:
//
//  1. AJUSTES — nivel y objetivo. Se recuerdan siempre. Son preferencias, no
//     historial: sin esto tendrías que reelegir tu nivel cada vez que abres.
//
//  2. SESIÓN EN CURSO — qué estás entrenando ahora, por qué ejercicio vas y
//     cuánto descanso queda. Caduca sola a las 4 horas. No es un registro:
//     no guarda pesos, ni repeticiones, ni queda nada que consultar después.
//     Existe sólo para que la app no se contradiga entre serie y serie.

const CLAVE_AJUSTES = 'tutreno.ajustes';
const CLAVE_SESION = 'tutreno.sesion';
const VIDA_SESION = 4 * 60 * 60 * 1000;   // 4 horas

const AJUSTES_INICIALES = {
  nivel: null,          // null = aún no ha pasado por el onboarding
  objetivo: 'hipertrofia',
};

function leer(clave, porDefecto) {
  try {
    const s = localStorage.getItem(clave);
    return s ? JSON.parse(s) : porDefecto;
  } catch {
    return porDefecto;   // modo incógnito, almacenamiento lleno o bloqueado
  }
}

function escribir(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* da igual */ }
}

export function cargarAjustes() {
  return { ...AJUSTES_INICIALES, ...leer(CLAVE_AJUSTES, {}) };
}

export function guardarAjustes(ajustes) {
  escribir(CLAVE_AJUSTES, ajustes);
}

export function cargarSesion() {
  const s = leer(CLAVE_SESION, null);
  if (!s) return null;
  if (Date.now() - s.creada > VIDA_SESION) {
    borrarSesion();
    return null;
  }
  return s;
}

export function guardarSesion(sesion) {
  escribir(CLAVE_SESION, sesion);
}

export function borrarSesion() {
  try { localStorage.removeItem(CLAVE_SESION); } catch { /* da igual */ }
}

// El descanso se guarda como MARCA DE FIN, nunca como contador en memoria.
// Así sigue corriendo aunque se apague la pantalla o Android congele la app:
// al volver, la cuenta es correcta en lugar de haberse quedado parada.
export function segundosRestantes(finEn) {
  if (!finEn) return 0;
  return Math.max(0, Math.round((finEn - Date.now()) / 1000));
}
