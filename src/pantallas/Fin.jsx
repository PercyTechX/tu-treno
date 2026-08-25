import React from 'react';

// Cerrar el bucle. Sin historial no hay números que celebrar, pero terminar sin
// nada es lo que separa una herramienta de un cacharro.
export default function Fin({ sesion, porId, onOtra }) {
  const minutos = sesion?.inicio ? Math.round((Date.now() - sesion.inicio) / 60000) : null;
  const lista = (sesion?.ids ?? []).map(id => porId[id]).filter(Boolean);

  return (
    <div className="cuerpo">
      <div className="centrado entra">
        <div style={{ textAlign: 'center', padding: '30px 0 10px' }}>
          <div style={{ fontSize: 54 }}>💪</div>
          <div className="pregunta" style={{ marginTop: 10 }}>Sesión terminada</div>
          <div className="subpregunta">
            {lista.length} ejercicios{minutos != null && minutos > 0 ? ` · ${minutos} min` : ''}
          </div>
        </div>

        <div>
          {lista.map((e, i) => (
            <div className="item" key={e.id + '-' + i} style={{ pointerEvents: 'none' }}>
              <span className="num">✓</span>
              <span className="txt"><span className="nom">{e.nombre}</span></span>
            </div>
          ))}
        </div>

        <button className="cta" style={{ marginTop: 18 }} onClick={onOtra}>Empezar otra</button>
        <div className="nota">
          No se guarda nada de esto. La próxima vez empiezas de cero, como querías.
        </div>
      </div>
    </div>
  );
}
