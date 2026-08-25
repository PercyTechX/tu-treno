import React, { useState, useEffect, useCallback } from 'react';
import indice from './datos/indice.json';
import {
  generarSesion, generarPorPatrones, elegirVariante,
  GRUPOS, PRESETS, MAX_GRUPOS,
} from './logica/generador.js';
import { prescribir } from './logica/contenido.js';
import { cargarAjustes, guardarAjustes, cargarSesion, guardarSesion, borrarSesion } from './estado.js';
import { vibrar, mantenerPantalla, avisarDescanso, cancelarAviso } from './nativo.js';
import { App as AppNativa } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { hayActualizacion } from './actualizacion.js';

import Onboarding from './pantallas/Onboarding.jsx';
import Entrenar from './pantallas/Entrenar.jsx';
import Sesion from './pantallas/Sesion.jsx';
import Ficha from './pantallas/Ficha.jsx';
import Explorar from './pantallas/Explorar.jsx';
import Ajustes from './pantallas/Ajustes.jsx';
import Fin from './pantallas/Fin.jsx';
import Descanso from './componentes/Descanso.jsx';

const EJERCICIOS = indice.ejercicios;
const PATRONES = indice.patrones;
const POR_ID = Object.fromEntries(EJERCICIOS.map(e => [e.id, e]));

export default function App() {
  const [ajustes, setAjustes] = useState(cargarAjustes);
  const [tab, setTab] = useState('entrenar');
  const [vista, setVista] = useState('inicio');   // inicio | sesion | ficha | ajustes | fin
  const [sel, setSel] = useState([]);
  const [sesion, setSesion] = useState(null);
  const [actual, setActual] = useState(0);
  const [serie, setSerie] = useState(1);
  const [finDescanso, setFinDescanso] = useState(null);
  const [splash, setSplash] = useState(true);
  const [actualiza, setActualiza] = useState(null);

  // Al abrir: si hay sesión de hace menos de 4 h se recupera entera —
  // ejercicio, serie y descanso en curso — y se aterriza donde lo dejaste.
  useEffect(() => {
    const g = cargarSesion();
    if (g) {
      setSesion(g);
      setActual(Math.min(g.actual ?? 0, g.ids.length - 1));
      setSerie(g.serie ?? 1);
      setVista('ficha');
      if (g.finDescanso > Date.now()) setFinDescanso(g.finDescanso);
    }
    const t = setTimeout(() => setSplash(false), 700);
    hayActualizacion().then(setActualiza);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { guardarAjustes(ajustes); }, [ajustes]);
  useEffect(() => {
    if (sesion) guardarSesion({ ...sesion, actual, serie, finDescanso });
  }, [sesion, actual, serie, finDescanso]);
  useEffect(() => { mantenerPantalla(Boolean(sesion) && vista !== 'fin'); }, [sesion, vista]);

  const ejercicio = sesion?.ids?.[actual] ? POR_ID[sesion.ids[actual]] : null;
  const series = ejercicio ? prescribir(ajustes.objetivo, ejercicio.compuesto).series : 0;

  const nuevaSesion = useCallback((lista, grupos) => {
    setSesion({ grupos, ids: lista.map(e => e.id), creada: Date.now(), inicio: Date.now() });
    setActual(0);
    setSerie(1);
    setVista('sesion');
    vibrar('ligero');
  }, []);

  const generar = useCallback((grupos, patrones, semilla = 0) => {
    const opciones = { nivel: ajustes.nivel ?? 2, objetivo: ajustes.objetivo, semilla };
    const lista = patrones?.length
      ? generarPorPatrones(EJERCICIOS, patrones, opciones)
      : generarSesion(EJERCICIOS, grupos, opciones);
    nuevaSesion(lista, grupos ?? []);
  }, [ajustes, nuevaSesion]);

  // Regenerar con otra semilla: sin esto "Otra sesión" devolvía lo mismo.
  const otraSesion = useCallback(() => {
    const s = (sesion?.semilla ?? 0) + 1;
    const opciones = { nivel: ajustes.nivel ?? 2, objetivo: ajustes.objetivo, semilla: s };
    const lista = sesion.grupos.length
      ? generarSesion(EJERCICIOS, sesion.grupos, opciones)
      : generarPorPatrones(EJERCICIOS, sesion.ids.map(id => POR_ID[id]?.patron).filter(Boolean), opciones);
    setSesion({ grupos: sesion.grupos, ids: lista.map(e => e.id), creada: Date.now(), inicio: Date.now(), semilla: s });
    setActual(0); setSerie(1); setVista('sesion');
  }, [sesion, ajustes]);

  // Cambiar de nivel NO regenera: sustituye la variante conservando el patrón.
  // Regenerar te borraba los ejercicios que hubieras cambiado o insertado, y
  // además contradecía la regla del propio generador.
  const cambiarNivel = useCallback((nivel) => {
    setAjustes(a => ({ ...a, nivel }));
    if (!sesion) return;
    const usados = new Set(), nombres = new Set();
    const ids = sesion.ids.map(id => {
      const e = POR_ID[id];
      if (!e) return id;
      const n = elegirVariante(EJERCICIOS, e.patron, nivel, usados, nombres);
      if (!n) return id;
      usados.add(n.id); nombres.add(n.nombre);
      return n.id;
    });
    setSesion(s => ({ ...s, ids }));
  }, [sesion]);

  const abrirDescanso = useCallback(() => {
    if (!ejercicio) return;
    const seg = prescribir(ajustes.objetivo, ejercicio.compuesto).descanso;
    setFinDescanso(Date.now() + seg * 1000);
    // La notificación se programa AL ABRIR el descanso, no al llegar a cero:
    // con la pantalla apagada el navegador estrangula los temporizadores y el
    // aviso llegaría tarde, justo cuando es el único aviso que existe.
    avisarDescanso(seg, ejercicio.nombre);
  }, [ejercicio, ajustes.objetivo]);

  // Al cerrar el descanso la app AVANZA sola: siguiente serie, o siguiente
  // ejercicio, o fin. Antes te devolvía a la misma ficha con el mismo botón y
  // sin decirte por qué serie ibas — 24 veces por sesión.
  const cerrarDescanso = useCallback((porTiempo) => {
    setFinDescanso(null);
    cancelarAviso();
    if (porTiempo) vibrar('fuerte');
    if (serie < series) { setSerie(serie + 1); return; }
    if (actual < sesion.ids.length - 1) { setActual(actual + 1); setSerie(1); return; }
    setVista('fin');
  }, [serie, series, actual, sesion]);

  const sustituir = useCallback((nuevoId) => {
    setSesion(s => {
      const ids = s.ids.slice();
      ids[actual] = nuevoId;
      return { ...s, ids };
    });
    setSerie(1);
    vibrar('ligero');
  }, [actual]);

  const quitar = useCallback((i) => {
    setSesion(s => {
      const ids = s.ids.filter((_, j) => j !== i);
      return ids.length ? { ...s, ids } : s;
    });
    setActual(a => Math.max(0, Math.min(a, (sesion?.ids.length ?? 1) - 2)));
    setSerie(1);
  }, [sesion]);

  // Desde Explorar. Si no hay sesión se crea una con el grupo real del
  // ejercicio: con grupos vacíos la pantalla de sesión quedaba sin título,
  // con "0 ejercicios ·" y un botón que no hacía nada.
  const insertar = useCallback((id) => {
    const e = POR_ID[id];
    setTab('entrenar');
    setVista('ficha');
    vibrar('ligero');
    if (!sesion) {
      const gid = Object.keys(GRUPOS).find(g => GRUPOS[g].patrones.includes(e.patron)) ?? null;
      setSesion({ grupos: gid ? [gid] : [], ids: [id], creada: Date.now(), inicio: Date.now() });
      setActual(0); setSerie(1);
      return;
    }
    const pos = Math.min(actual + 1, sesion.ids.length);
    setSesion(s => { const ids = s.ids.slice(); ids.splice(pos, 0, id); return { ...s, ids }; });
    setActual(pos);
    setSerie(1);
  }, [sesion, actual]);

  const terminar = useCallback(() => {
    borrarSesion(); setSesion(null); setSel([]); setActual(0); setSerie(1); setVista('inicio');
  }, []);

  const atras = useCallback(() => {
    if (vista === 'ficha') setVista('sesion');
    else if (vista === 'sesion' || vista === 'ajustes' || vista === 'fin') setVista('inicio');
  }, [vista]);

  // Botón físico de atrás de Android. Sin esto cierra la app entera: estando en
  // una ficha, eso significa perder la sesión. El descanso lo captura también,
  // o el botón lo saltaría sin querer.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      const onPop = () => { atras(); window.history.pushState(null, ''); };
      window.history.pushState(null, '');
      window.addEventListener('popstate', onPop);
      return () => window.removeEventListener('popstate', onPop);
    }
    let quitar;
    AppNativa.addListener('backButton', () => {
      if (finDescanso) { setFinDescanso(null); cancelarAviso(); return; }
      if (tab === 'explorar') { setTab('entrenar'); return; }
      if (vista !== 'inicio') { atras(); return; }
      AppNativa.exitApp();
    }).then(h => { quitar = h; });
    return () => { quitar?.remove(); };
  }, [atras, vista, tab, finDescanso]);

  if (ajustes.nivel == null) {
    return <Onboarding onListo={(nivel) => setAjustes(a => ({ ...a, nivel }))} />;
  }

  const enExplorar = tab === 'explorar';
  // La cabecera depende de la PESTAÑA, no de la vista: si no, al pasar a
  // Explorar con una sesión viva la cabecera decía "‹ Ejercicio" sobre la
  // búsqueda, y esa flecha no hacía nada visible.
  const hayAtras = !enExplorar && vista !== 'inicio';
  const titulo = enExplorar ? 'Explorar'
    : vista === 'sesion' ? 'Tu sesión'
    : vista === 'ficha' ? `Ejercicio ${actual + 1} de ${sesion?.ids.length ?? 0}`
    : vista === 'ajustes' ? 'Ajustes'
    : vista === 'fin' ? 'Sesión terminada' : 'Tu Treno';

  return (
    <div className="app">
      {splash && <div className="splash"><img src="logo.webp" alt="PercyTech Solutions" /></div>}

      <header className="cab">
        {hayAtras
          ? <button className="icono" onClick={atras} aria-label="Atrás">‹</button>
          : <img className="logo" src="logo.webp" alt="PercyTech" />}
        <span className="titulo">{titulo}</span>
        {!hayAtras && !enExplorar && (
          <button className="icono der" onClick={() => setVista('ajustes')} aria-label="Ajustes">⚙︎</button>
        )}
      </header>

      {actualiza && vista === 'inicio' && !enExplorar && (
        <a className="aviso-version" href={actualiza.enlace} target="_blank" rel="noreferrer"
           onClick={() => setActualiza(null)}>
          <span>Versión <b>{actualiza.version}</b> disponible</span>
          <span className="descargar">Descargar</span>
        </a>
      )}

      {enExplorar ? (
        <Explorar ejercicios={EJERCICIOS} patrones={PATRONES}
          haySesion={Boolean(sesion)} onElegir={insertar} />
      ) : vista === 'ajustes' ? (
        <Ajustes ajustes={ajustes} onNivel={cambiarNivel}
          onObjetivo={(o) => setAjustes(a => ({ ...a, objetivo: o }))}
          onSalir={() => setVista('inicio')} />
      ) : vista === 'fin' ? (
        <Fin sesion={sesion} porId={POR_ID} onOtra={terminar} />
      ) : vista === 'inicio' ? (
        <Entrenar ejercicios={EJERCICIOS} sel={sel} setSel={setSel}
          sesionViva={sesion} ajustes={ajustes}
          onGenerar={generar} onContinuar={() => setVista('ficha')} />
      ) : vista === 'sesion' ? (
        <Sesion sesion={sesion} porId={POR_ID} ajustes={ajustes} actual={actual}
          onAbrir={(i) => { setActual(i); setSerie(1); setVista('ficha'); }}
          onNivel={cambiarNivel}
          onObjetivo={(o) => setAjustes(a => ({ ...a, objetivo: o }))}
          onOtra={otraSesion} onQuitar={quitar} onTerminar={terminar} />
      ) : (
        <Ficha ejercicio={ejercicio} ejercicios={EJERCICIOS} ajustes={ajustes}
          indice={actual} total={sesion?.ids.length ?? 0}
          serie={serie} series={series}
          idsEnSesion={sesion?.ids ?? []}
          onDescanso={abrirDescanso} onSustituir={sustituir}
          onSerie={setSerie}
          onNavegar={(d) => { setActual(a => Math.min(Math.max(a + d, 0), sesion.ids.length - 1)); setSerie(1); }} />
      )}

      <nav className="tabs">
        {[['entrenar', '🏋️', 'Entrenar'], ['explorar', '🔍', 'Explorar']].map(([id, ic, n]) => (
          <button key={id} className="tab" aria-selected={tab === id}
            onClick={() => { setTab(id); if (id === 'entrenar' && !sesion) setVista('inicio'); }}>
            <span className="ic">{ic}</span>{n}
          </button>
        ))}
      </nav>

      {finDescanso && (
        <Descanso finEn={finDescanso} ejercicio={ejercicio}
          serie={serie} series={series}
          siguiente={sesion?.ids?.[actual + 1] ? POR_ID[sesion.ids[actual + 1]] : null}
          onMas={(s) => setFinDescanso(f => f + s * 1000)}
          onCerrar={cerrarDescanso} />
      )}
    </div>
  );
}
