import React from 'react';
import { GRUPOS } from '../logica/generador.js';
import { prescribir, formatoDescanso, OBJETIVOS } from '../logica/contenido.js';
import { imagen } from '../media.js';

const NIVELES = { 1: 'Principiante', 2: 'Peso libre', 3: 'Avanzado' };

export default function Sesion({
  sesion, porId, ajustes, actual, onAbrir, onNivel, onObjetivo, onOtra, onQuitar, onTerminar,
}) {
  const lista = sesion.ids.map(id => porId[id]).filter(Boolean);
  const titulo = sesion.grupos.map(g => GRUPOS[g]?.nombre).filter(Boolean).join(' + ') || 'Sesión suelta';
  const claves = Object.keys(OBJETIVOS);

  return (
    // Sin barra inferior en esta pantalla: los 108 px que ocupaba dejaban ver
    // 3 ejercicios de 6 en un móvil de 360 px. Los botones van al final de la lista.
    <div className="cuerpo">
      <div className="cabsesion">
        <h2>{titulo}</h2>
        <div className="ajustes-linea">
          <button className="pastilla" onClick={() => onNivel(ajustes.nivel === 3 ? 1 : ajustes.nivel + 1)}>
            Nivel {ajustes.nivel} · {NIVELES[ajustes.nivel]}
          </button>
          <button className="pastilla"
            onClick={() => onObjetivo(claves[(claves.indexOf(ajustes.objetivo) + 1) % claves.length])}>
            {OBJETIVOS[ajustes.objetivo].nombre}
          </button>
        </div>
      </div>

      <div className="pad entra">
        {lista.map((e, i) => {
          const p = prescribir(ajustes.objetivo, e.compuesto);
          return (
            <div className={'fila' + (i === actual ? ' aqui' : '')} key={e.id + '-' + i}>
              <button className="item" onClick={() => onAbrir(i)}>
                <span className="num">{i + 1}</span>
                <img className="miniatura" src={imagen(e.img)} alt="" loading="lazy" />
                <span className="txt">
                  <span className="nom">{e.nombre}</span>
                  <span className="en">{e.en}</span>
                  <span className="pres">{p.series} × {p.reps} · {formatoDescanso(p.descanso)}</span>
                </span>
              </button>
              {lista.length > 1 && (
                <button className="quitar" onClick={() => onQuitar(i)}
                  aria-label={'Quitar ' + e.nombre}>×</button>
              )}
            </div>
          );
        })}

        <button className="cta sec" style={{ marginTop: 10 }} onClick={onOtra}>Otra sesión</button>
        <button className="cta sec" style={{ marginTop: 10 }} onClick={onTerminar}>Terminar</button>
        <div className="nota">Toca un ejercicio para ver la técnica y llevar las series.</div>
      </div>
    </div>
  );
}
