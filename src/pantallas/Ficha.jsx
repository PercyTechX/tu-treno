import React, { useEffect, useState } from 'react';
import { CONTENIDO, prescribir, formatoDescanso } from '../logica/contenido.js';
import { alternativas } from '../logica/generador.js';
import { imagen, animacion, cargarPasos, pasosDe } from '../media.js';

export default function Ficha({
  ejercicio, ejercicios, ajustes, indice, total, serie, series,
  idsEnSesion, onDescanso, onSustituir, onSerie, onNavegar,
}) {
  const [pasos, setPasos] = useState(null);

  useEffect(() => {
    let vivo = true;
    setPasos(null);
    cargarPasos().then(() => { if (vivo) setPasos(pasosDe(ejercicio?.id) ?? []); });
    return () => { vivo = false; };
  }, [ejercicio?.id]);

  if (!ejercicio) return <div className="cuerpo"><div className="vacio">Sin ejercicio.</div></div>;

  const p = prescribir(ajustes.objetivo, ejercicio.compuesto);
  const c = CONTENIDO[ejercicio.patron] ?? { tecnica: [], errores: [] };
  const alts = alternativas(ejercicios, ejercicio, 3, { nivel: ajustes.nivel, excluirIds: idsEnSesion });

  return (
    <>
      <div className="cuerpo">
        <div className="gifcaja">
          <img src={animacion(ejercicio.gif)} alt={ejercicio.nombre} />
        </div>

        <div className="pad entra" key={ejercicio.id}>
          <div className="fichanom">{ejercicio.nombre}</div>
          <div className="fichaen">{ejercicio.en}</div>

          {/* Contador de series: es lo que convierte el catálogo en un entreno
              guiado. Tocable, por si pierdes la cuenta o repites una serie. */}
          <div className="series">
            {Array.from({ length: p.series }, (_, i) => (
              <button key={i} className={'punto-serie' + (i + 1 === serie ? ' activa' : i + 1 < serie ? ' hecha' : '')}
                onClick={() => onSerie(i + 1)} aria-label={`Serie ${i + 1}`}>{i + 1}</button>
            ))}
            <span className="series-txt">Serie {serie} de {p.series}</span>
          </div>

          <div className="prescaja">
            <span className="gr">{p.series} × {p.reps}</span>
            <span className="lb">descanso {formatoDescanso(p.descanso)}</span>
          </div>

          {/* Sin aproximaciones, la sesión abre con una serie pesada a frío —
              justo donde ocurren las lesiones que describe el bloque de errores. */}
          {ejercicio.compuesto && serie === 1 && (
            <div className="aviso">
              <b>Antes de la primera serie:</b> 2 series de aproximación ligeras
              — 10 repeticiones con la barra vacía y 5 con la mitad del peso.
            </div>
          )}

          <div className="meta">
            <span className="etq">Trabaja <b>{ejercicio.musculo}</b></span>
            {ejercicio.secundarios.length > 0 && (
              <span className="etq">También {ejercicio.secundarios.join(', ')}</span>
            )}
            <span className="etq">{ejercicio.equipoEs || 'peso corporal'}</span>
            <span className="etq">Nivel <b>{ejercicio.nivel}</b></span>
          </div>

          <details className="bloque" open>
            <summary>Técnica y errores</summary>
            <div className="in">
              <ul className="lista">{c.tecnica.slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}</ul>
              {c.errores.length > 0 && (
                <>
                  <div className="rotulo" style={{ marginTop: 14 }}>Errores comunes</div>
                  <ul className="lista mal">{c.errores.map((t, i) => <li key={i}>{t}</li>)}</ul>
                </>
              )}
            </div>
          </details>

          <details className="bloque">
            <summary>Paso a paso</summary>
            <div className="in">
              {pasos === null
                ? <div className="nota">Cargando…</div>
                : pasos.length
                  ? <ol className="pasos">{pasos.map((t, i) => <li key={i}>{t}</li>)}</ol>
                  : <div className="nota">Sin pasos para este ejercicio.</div>}
            </div>
          </details>

          <details className="bloque">
            <summary>Cambiar por otro</summary>
            <div className="in">
              {alts.length ? alts.map(a => (
                <button key={a.id} className="item" onClick={() => onSustituir(a.id)}>
                  <img className="miniatura" src={imagen(a.img)} alt="" loading="lazy" />
                  <span className="txt">
                    <span className="nom">{a.nombre}</span>
                    <span className="en">{a.equipoEs || 'peso corporal'} · nivel {a.nivel}</span>
                  </span>
                </button>
              )) : <div className="vacio">No hay alternativas para este movimiento.</div>}
              <div className="nota">Ordenadas por tu nivel: las primeras las puedes hacer ya.</div>
            </div>
          </details>

          {total > 1 && (
            <div className="navegar">
              <button className="cta sec" disabled={indice === 0} onClick={() => onNavegar(-1)}>‹ Anterior</button>
              <button className="cta sec" disabled={indice >= total - 1} onClick={() => onNavegar(1)}>Siguiente ›</button>
            </div>
          )}
        </div>
      </div>

      <div className="barra">
        <button className="cta" onClick={onDescanso}>
          Serie {serie} de {p.series} hecha · descansar {formatoDescanso(p.descanso)}
        </button>
      </div>
    </>
  );
}
