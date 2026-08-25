// Aviso de versión nueva.
//
// Android no deja que una app instalada fuera de la Play Store se actualice
// sola: hace falta que la persona toque y confirme. Lo que sí se puede es
// avisarla. La app pregunta a GitHub por la última versión publicada y, si hay
// una más nueva, enseña un aviso con el enlace de descarga.
//
// Si no hay internet — el caso normal en el gimnasio — no pasa nada: falla en
// silencio y la app funciona igual.

import { version as VERSION_ACTUAL } from '../package.json';

// Cámbialo por tu repositorio cuando lo crees: "usuario/repo".
export const REPO = 'PercyTechX/tu-treno';

const CLAVE = 'tutreno.ultimaComprobacion';
const CADA = 24 * 60 * 60 * 1000;   // una vez al día basta

function mayor(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map(Number);
  const pb = String(b).replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return true;
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return false;
  }
  return false;
}

export async function hayActualizacion() {
  try {
    const ultima = Number(localStorage.getItem(CLAVE) ?? 0);
    if (Date.now() - ultima < CADA) return null;

    const control = new AbortController();
    const corte = setTimeout(() => control.abort(), 4000);
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      signal: control.signal,
      headers: { Accept: 'application/vnd.github+json' },
    });
    clearTimeout(corte);
    if (!r.ok) return null;

    const datos = await r.json();
    localStorage.setItem(CLAVE, String(Date.now()));

    if (!mayor(datos.tag_name, VERSION_ACTUAL)) return null;
    const apk = (datos.assets ?? []).find(a => a.name.endsWith('.apk'));
    return {
      version: String(datos.tag_name).replace(/^v/, ''),
      enlace: apk?.browser_download_url ?? datos.html_url,
    };
  } catch {
    return null;   // sin red, o GitHub caído: da igual
  }
}

export { VERSION_ACTUAL };
