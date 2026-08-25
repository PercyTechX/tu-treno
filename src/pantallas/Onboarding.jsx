import React, { useState } from 'react';

// Dos preguntas binarias en vez de pedir "principiante / intermedio / avanzado".
// Motivo: la autoevaluación en el gimnasio falla en las dos direcciones — quien
// lleva tres meses se pone intermedio y quien lleva dos años se pone principiante.
// Estas dos no se pueden fallar y mapean directamente a lo que necesitamos saber:
// qué material maneja.
const PREGUNTAS = [
  {
    titulo: '¿Entrenas con barra libre?',
    sub: 'Sentadilla, peso muerto o press de banca con barra, sin máquina que guíe el movimiento.',
    opciones: [
      { n: 'Sí, la uso', s: 'Manejo la barra con soltura', valor: true },
      { n: 'Todavía no', s: 'Voy con máquinas, poleas o mancuernas', valor: false },
    ],
  },
  {
    titulo: '¿Haces ejercicios a una pierna, a un brazo o explosivos?',
    sub: 'Zancada búlgara, peso muerto a una pierna, cargadas, saltos.',
    opciones: [
      { n: 'Sí, los hago', s: 'Controlo el equilibrio y la técnica', valor: true },
      { n: 'No', s: 'Prefiero movimientos con los dos lados a la vez', valor: false },
    ],
  },
];

export default function Onboarding({ onListo }) {
  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState([]);

  function responder(valor) {
    const nuevas = [...resp];
    nuevas[paso] = valor;
    setResp(nuevas);

    if (paso < PREGUNTAS.length - 1) {
      setPaso(paso + 1);
      return;
    }
    // No/No = 1 · Sí/No = 2 · Sí/Sí = 3. El nivel es acumulativo: el 3 ve todo.
    const [barra, avanzado] = nuevas;
    onListo(avanzado ? 3 : barra ? 2 : 1);
  }

  const p = PREGUNTAS[paso];

  return (
    <div className="app">
      <div className="cuerpo">
        <div className="centrado entra" key={paso}>
          <div className="marca"><img src="logo.webp" alt="PercyTech Solutions" /></div>

          <div className="pregunta">{p.titulo}</div>
          <div className="subpregunta">{p.sub}</div>

          <div className="opciones">
            {p.opciones.map(o => (
              <button key={o.n} className="opcion" onClick={() => responder(o.valor)}>
                <span className="n">{o.n}</span>
                <span className="s">{o.s}</span>
              </button>
            ))}
          </div>

          <div className="progreso">
            {PREGUNTAS.map((_, i) => (
              <span key={i} className={'punto' + (i <= paso ? ' on' : '')} />
            ))}
          </div>

          <div className="nota" style={{ marginTop: 'auto' }}>
            Sirve para ajustar los ejercicios que te propone.<br />
            Puedes cambiarlo cuando quieras en Ajustes.
          </div>
        </div>
      </div>
    </div>
  );
}
