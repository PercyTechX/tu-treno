// Los datos guardan las rutas del dataset original (images/x.jpg, videos/x.gif),
// pero la app sirve los WebP convertidos: 131 MB pasaron a 43 MB.
// Sin barra inicial a propósito: dentro del APK las rutas absolutas no resuelven.

const aWebp = ruta => 'media/' + ruta.replace(/\.(gif|jpe?g|png)$/i, '.webp');

export const imagen = ruta => aWebp(ruta);
export const animacion = ruta => aWebp(ruta);

// Los pasos no van en el bundle: son 694 KB que sólo hacen falta al abrir una
// ficha. Se piden una vez y quedan en memoria para el resto de la sesión.
let cache = null;
let pidiendo = null;

export async function cargarPasos() {
  if (cache) return cache;
  if (!pidiendo) {
    pidiendo = fetch('pasos.json')
      .then(r => r.json())
      .then(d => { cache = d; return d; })
      .catch(() => ({}));
  }
  return pidiendo;
}

export function pasosDe(id) {
  return cache?.[id] ?? null;
}
