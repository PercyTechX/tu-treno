// Puente con lo nativo.
//
// Los plugins de Capacitor traen implementación web, así que estas funciones
// valen igual en el navegador durante el desarrollo. Aun así todo va dentro de
// try/catch: que falle la vibración no puede tumbar un entrenamiento.

import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { KeepAwake } from '@capacitor-community/keep-awake';

const esNativo = () => Capacitor.isNativePlatform();
const ID_AVISO = 1;

// La música del gimnasio tapa cualquier sonido; la vibración no.
export async function vibrar(tipo = 'ligero') {
  try {
    if (esNativo()) {
      if (tipo === 'fuerte') await Haptics.vibrate({ duration: 500 });
      else await Haptics.impact({ style: ImpactStyle.Light });
      return;
    }
  } catch { /* seguimos por la vía web */ }
  try {
    navigator.vibrate?.(tipo === 'fuerte' ? [400, 120, 400] : 12);
  } catch { /* nada */ }
}

// Mientras hay sesión abierta la pantalla no se apaga: sin esto, cada descanso
// obliga a desbloquear y volver a buscar por dónde ibas.
let bloqueoWeb = null;
export async function mantenerPantalla(activo) {
  try {
    if (esNativo()) {
      activo ? await KeepAwake.keepAwake() : await KeepAwake.allowSleep();
      return;
    }
    if (activo && navigator.wakeLock && !bloqueoWeb) {
      bloqueoWeb = await navigator.wakeLock.request('screen');
    } else if (!activo && bloqueoWeb) {
      await bloqueoWeb.release();
      bloqueoWeb = null;
    }
  } catch { /* el navegador puede negarlo; no es crítico */ }
}

let permisoPedido = false;

// Se programa AL ABRIR el descanso, no al llegar a cero: con la pantalla
// apagada el sistema estrangula los temporizadores de JavaScript y el aviso
// llegaría tarde, justo cuando es el único aviso que existe.
export async function avisarDescanso(segundos, nombreEjercicio) {
  if (!esNativo()) return;
  try {
    if (!permisoPedido) {
      permisoPedido = true;
      const { display } = await LocalNotifications.checkPermissions();
      if (display !== 'granted') await LocalNotifications.requestPermissions();
    }
    await LocalNotifications.schedule({
      notifications: [{
        id: ID_AVISO,
        title: 'Descanso terminado',
        body: nombreEjercicio ? 'Te toca: ' + nombreEjercicio : 'A por la siguiente serie',
        schedule: { at: new Date(Date.now() + segundos * 1000), allowWhileIdle: true },
      }],
    });
  } catch { /* sin permiso: la vibración sigue funcionando */ }
}

export async function cancelarAviso() {
  if (!esNativo()) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: ID_AVISO }] });
  } catch { /* nada */ }
}
