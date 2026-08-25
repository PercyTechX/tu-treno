import React, { useEffect, useState, useRef } from 'react';
import { segundosRestantes } from '../estado.js';

const R = 108;
const PERIMETRO = 2 * Math.PI * R;

export default function Descanso({ finEn, ejercicio, serie, series, siguiente, onMas, onCerrar }) {
  const [quedan, setQuedan] = useState(() => segundosRestantes(finEn));
  const total = useRef(segundosRestantes(finEn));
  const disparado = useRef(false);

  // Se recalcula desde la marca de fin en cada tic. Si Android congela la app o
  // se apaga la pantalla, al volver la cuenta es correcta y no una parada.
  useEffect(() => {
    const tic = setInterval(() => {
      const q = segundosRestantes(finEn);
      setQuedan(q);
      if (q <= 0 && !disparado.current) { disparado.current = true; onCerrar(true); }
    }, 250);
    return () => clearInterval(tic);
  }, [finEn, onCerrar]);

  useEffect(() => {
    const q = segundosRestantes(finEn);
    if (q > total.current) total.current = q;
  }, [finEn]);

  const progreso = total.current ? quedan / total.current : 0;

  // La verdad, no una suposición: durante el descanso entre la serie 1 y la 2
  // la pantalla decía "Después: Aperturas con mancuernas", que era falso en 18
  // de los 24 descansos de una sesión.
  const quedanSeries = serie < series;
  const despues = quedanSeries
    ? <>Después: <b>serie {serie + 1} de {series}</b> · {ejercicio?.nombre}</>
    : siguiente
      ? <>Después: <b>{siguiente.nombre}</b></>
      : 'Última serie de la sesión';

  return (
    <div className="descanso">
      <div className="rot">Descanso</div>

      <div className="aro">
        <svg width="244" height="244" aria-hidden="true">
          <circle className="pista" cx="122" cy="122" r={R} fill="none" strokeWidth="12" />
          <circle className="barra-progreso" cx="122" cy="122" r={R} fill="none" strokeWidth="12"
            strokeLinecap="round" strokeDasharray={PERIMETRO}
            strokeDashoffset={PERIMETRO * (1 - progreso)} />
        </svg>
        <div className={'reloj' + (quedan <= 10 ? ' final' : '')}>
          {Math.floor(quedan / 60)}:{String(quedan % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="sig">{despues}</div>

      <div className="botones">
        <button className="btn96" onClick={() => onMas(30)}>+30 s</button>
        <button className="btn96 pri" onClick={() => onCerrar(false)}>
          {quedanSeries ? 'Siguiente serie' : 'Continuar'}
        </button>
      </div>
    </div>
  );
}
