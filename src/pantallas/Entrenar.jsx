import React, { useState, useMemo } from 'react';
import { GRUPOS, PRESETS, MAX_GRUPOS, repartoTexto } from '../logica/generador.js';

export default function Entrenar({ ejercicios, sel, setSel, sesionViva, ajustes, onGenerar, onContinuar }) {
  const [confirmar, setConfirmar] = useState(null);

  // El reparto sale de generar de verdad, no de una fórmula: la fórmula
  // prometía "Bíceps 6" y la sesión traía 2.
  const reparto = useMemo(
    () => repartoTexto(ejercicios, sel, { nivel: ajustes.nivel, objetivo: ajustes.objetivo }),
    [ejercicios, sel, ajustes.nivel, ajustes.objetivo],
  );

  function pedir(grupos, patrones) {
    if (sesionViva) setConfirmar({ grupos, patrones });
    else onGenerar(grupos, patrones);
  }

  function alternar(id) {
    setSel(s => s.includes(id) ? s.filter(x => x !== id)
      : s.length < MAX_GRUPOS ? [...s, id] : s);
  }

  const tope = sel.length >= MAX_GRUPOS;

  return (
    <>
      <div className="cuerpo">
        <div className="pad entra">
          {sesionViva && (
            <button className="item" onClick={onContinuar} style={{ marginBottom: 18 }}>
              <span className="txt">
                <span className="nom">
                  Continuar: {sesionViva.grupos.map(g => GRUPOS[g]?.nombre).filter(Boolean).join(' + ') || 'tu sesión'}
                </span>
                <span className="pres">{sesionViva.ids.length} ejercicios · en curso</span>
              </span>
              <span style={{ fontSize: 22, color: 'var(--azul)', flexShrink: 0 }}>›</span>
            </button>
          )}

          <div className="rotulo">Días listos</div>
          <div className="presets">
            {PRESETS.map((p, i) => (
              <button key={p.id} className={'preset' + (i === PRESETS.length - 1 ? ' ancho' : '')}
                onClick={() => pedir(p.grupos, p.patrones)}>
                <span className="n">{p.nombre}</span>
                <span className="s">
                  {p.grupos.length
                    ? p.grupos.map(g => GRUPOS[g].nombre).join(' · ')
                    : 'Un ejercicio de cada movimiento básico'}
                </span>
              </button>
            ))}
          </div>

          <div className="rotulo">O elige tus músculos</div>
          <div className="chips">
            {Object.entries(GRUPOS).map(([id, g]) => {
              const on = sel.includes(id);
              return (
                <button key={id} className="chip" aria-pressed={on}
                  disabled={!on && tope} onClick={() => alternar(id)}>
                  <span className="txt">{g.nombre}</span>
                  <span className="tick">✓</span>
                </button>
              );
            })}
          </div>

          {tope && (
            <div className="aviso">
              Máximo {MAX_GRUPOS} grupos por sesión. Para trabajar más, usa <b>Torso</b> o <b>Cuerpo completo</b>.
            </div>
          )}

          <div className="nota">El primer músculo que tocas es el principal y se lleva más volumen.</div>
        </div>
      </div>

      <div className="barra">
        <div className="reparto">{reparto}</div>
        <button className="cta" disabled={!sel.length} onClick={() => pedir(sel, null)}>
          {sel.length ? 'Generar · ' + sel.map(g => GRUPOS[g].nombre).join(' + ') : 'Elige qué entrenas'}
        </button>
      </div>

      {confirmar && (
        <div className="descanso">
          <div className="pregunta" style={{ textAlign: 'center' }}>¿Empezar otra sesión?</div>
          <div className="subpregunta" style={{ textAlign: 'center' }}>Se pierde la que tienes en curso.</div>
          <div className="botones" style={{ marginTop: 10 }}>
            <button className="btn96" onClick={() => setConfirmar(null)}>Seguir con la actual</button>
            <button className="btn96 pri"
              onClick={() => { const c = confirmar; setConfirmar(null); onGenerar(c.grupos, c.patrones); }}>
              Empezar otra
            </button>
          </div>
        </div>
      )}
    </>
  );
}
