import React from 'react';
import { OBJETIVOS } from '../logica/contenido.js';

const NIVELES = [
  { v: 1, n: 'Principiante', s: 'Máquinas, poleas, bandas y peso corporal' },
  { v: 2, n: 'Peso libre', s: 'Barra y mancuernas con los dos lados a la vez' },
  { v: 3, n: 'Avanzado', s: 'A una pierna o un brazo, explosivos y olímpicos' },
];

export default function Ajustes({ ajustes, onNivel, onObjetivo, onSalir }) {
  return (
    <div className="cuerpo">
      <div className="pad entra">
        <div className="rotulo">Tu nivel</div>
        <div className="opciones">
          {NIVELES.map(o => (
            <button key={o.v} className="opcion" aria-pressed={ajustes.nivel === o.v}
              onClick={() => onNivel(o.v)}>
              <span className="n">{o.n}</span>
              <span className="s">{o.s}</span>
            </button>
          ))}
        </div>
        <div className="nota">
          El nivel cambia la variante del ejercicio, nunca el movimiento:
          si no manejas la barra, la sentadilla te sale en multipower o prensa, pero te sale.
        </div>

        <div className="rotulo" style={{ marginTop: 22 }}>Objetivo</div>
        <div className="opciones">
          {Object.entries(OBJETIVOS).map(([k, o]) => (
            <button key={k} className="opcion" aria-pressed={ajustes.objetivo === k}
              onClick={() => onObjetivo(k)}>
              <span className="n">{o.nombre}</span>
              <span className="s">
                Compuestos {o.compuesto.series}×{o.compuesto.reps} · aislamiento {o.aislamiento.series}×{o.aislamiento.reps}
              </span>
            </button>
          ))}
        </div>

        <div className="rotulo" style={{ marginTop: 22 }}>Acerca de</div>
        <div className="opcion" style={{ textAlign: 'center' }}>
          <img src="logo.webp" alt="PercyTech Solutions" style={{ width: 170, margin: '6px auto 10px' }} />
          <span className="s">
            Tu Treno · versión 1.0<br />
            1.324 ejercicios, funciona sin conexión.<br />
            Animaciones © Gym visual — gymvisual.com
          </span>
        </div>

        <button className="cta" style={{ marginTop: 18 }} onClick={onSalir}>Listo</button>
        <div className="nota">
          La app no guarda tus entrenamientos. Solo recuerda estos ajustes
          y la sesión del día, que se borra sola a las 4 horas.
        </div>
      </div>
    </div>
  );
}
