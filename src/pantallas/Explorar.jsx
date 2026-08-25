import React, { useState, useMemo } from 'react';
import { imagen } from '../media.js';

const EQUIPOS = [
  ['dumbbell', 'Mancuerna'], ['barbell', 'Barra'], ['cable', 'Polea'],
  ['leverage machine', 'Máquina'], ['body weight', 'Peso corporal'],
  ['smith machine', 'Multipower'], ['kettlebell', 'Kettlebell'], ['band', 'Banda'],
];

const sinTildes = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Explorar({ ejercicios, patrones, haySesion, onElegir }) {
  const [q, setQ] = useState('');
  const [equipo, setEquipo] = useState(null);

  const grupos = useMemo(() => {
    const busca = sinTildes(q.trim());
    let lista = ejercicios;
    // Busca por alias: el dataset sólo trae "barbell bench press", así que sin
    // esto "press banca" no encontraría nada.
    if (busca) lista = lista.filter(e => e.alias.some(a => a.includes(busca)));
    if (equipo) lista = lista.filter(e => e.equipo === equipo);

    const porPatron = {};
    lista.forEach(e => { (porPatron[e.patron] = porPatron[e.patron] || []).push(e); });
    return { total: lista.length, entradas: Object.entries(porPatron).sort((a, b) => b[1].length - a[1].length) };
  }, [ejercicios, q, equipo]);

  return (
    <div className="cuerpo">
      <div className="pad">
        <div className="buscador">
          <span aria-hidden="true">🔍</span>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="press banca, dominadas, sentadilla…"
            autoComplete="off" autoCorrect="off" spellCheck="false" />
          {q && <button className="limpiar" onClick={() => setQ('')} aria-label="Limpiar">×</button>}
        </div>

        <div className="filtros">
          {EQUIPOS.map(([k, n]) => (
            <button key={k} className="fchip" aria-pressed={equipo === k}
              onClick={() => setEquipo(equipo === k ? null : k)}>{n}</button>
          ))}
        </div>

        {grupos.total === 0 ? (
          <div className="vacio">
            Nada con ese nombre.<br />Prueba con «press», «curl» o «sentadilla».
          </div>
        ) : (
          // Agrupado por patrón: una lista plana de 150 ejercicios no se lee en
          // los diez segundos que dura un descanso.
          grupos.entradas.map(([pid, exs]) => (
            <details className="grupo" key={pid} open={Boolean(q) && grupos.entradas.length <= 3}>
              <summary>
                <span>{patrones[pid]?.nombre ?? 'Otros'}</span>
                <span className="cont">{exs.length}</span>
              </summary>
              <div>
                {exs.slice(0, 25).map(e => (
                  <button key={e.id} className="item" onClick={() => onElegir(e.id)}>
                    <img className="miniatura" src={imagen(e.img)} alt="" loading="lazy" />
                    <span className="txt">
                      <span className="nom">{e.nombre}</span>
                      <span className="en">{e.equipoEs || 'peso corporal'} · nivel {e.nivel}</span>
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--azul)', fontWeight: 700, flexShrink: 0 }}>
                      {haySesion ? 'Añadir' : 'Ver'}
                    </span>
                  </button>
                ))}
                {exs.length > 25 && <div className="nota">y {exs.length - 25} más — afina la búsqueda</div>}
              </div>
            </details>
          ))
        )}

        <div className="nota">{grupos.total} ejercicios</div>
      </div>
    </div>
  );
}
