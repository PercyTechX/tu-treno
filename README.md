<div align="center">
  <img src="logo.webp" width="320" alt="PercyTech Solutions" />

  # Tu Treno

  **Aplicación de gimnasio para Android. En español, sin conexión y sin cuentas.**

  1.324 ejercicios con animación · sesiones generadas según tu nivel y tu objetivo ·
  técnica y errores comunes · temporizador de descanso

</div>

---

## Qué hace

Eliges qué vas a entrenar hoy — un día completo (empuje, tirón, pierna, cuerpo
completo) o los músculos sueltos que quieras — y la app arma **una sesión
coherente**: el compuesto pesado primero, el aislamiento al final, sin repetir
patrón de movimiento y sin apilar dos bisagras de cadera cargadas.

De cada ejercicio te da la animación, cuántas series y repeticiones te tocan,
cuánto descansar, la técnica clave y los errores más comunes. Llevas la cuenta
de las series con un toque y el temporizador de descanso avanza solo al
siguiente.

**Funciona entera sin internet.** En el sótano de un gimnasio no hay cobertura,
así que todo — datos, imágenes y animaciones — va dentro del APK.

**No guarda tu historial.** Sólo recuerda tus ajustes y la sesión del día, que
se borra sola a las 4 horas. No hay cuentas, ni servidores, ni nada que salga
del teléfono.

---

## Cómo está pensada

Está hecha para usarse **de pie, sudando, entre series de 60 a 180 segundos**,
con el móvil apoyado en el banco y mirándolo desde medio metro. Eso explica casi
todas las decisiones:

- **Zonas de toque de 56 px como mínimo**, y de 96 px en el temporizador. Con
  las manos con magnesio la precisión del dedo cae mucho.
- **Contraste alto y tema claro**. Se lee bajo fluorescente y con sol de frente.
- **Vibración, no sonido.** La música del gimnasio tapa cualquier pitido.
- **El descanso se guarda como hora de fin, no como cuenta atrás.** Así sigue
  siendo correcto aunque se apague la pantalla o Android congele la app.
- **La pantalla no se apaga mientras hay sesión abierta**, y se suelta al
  terminar para que el móvil no se caliente en la taquilla.
- **Al volver, aterrizas donde lo dejaste**: mismo ejercicio, misma serie.

### La regla que sostiene el generador

**El nivel cambia la variante del ejercicio, nunca el movimiento.**

Si un principiante pide pierna, no puede recibir sólo extensiones y curls: tiene
que salirle una sentadilla y una bisagra de cadera, aunque sean en multipower y
en máquina. Por eso el generador elige primero el **patrón de movimiento** y
sólo después decide con qué aparato se hace. Si un patrón no tiene variante para
tu nivel, se coge la del nivel más cercano — jamás desaparece de la sesión.

| Patrón: sentadilla | |
|---|---|
| Nivel 1 | Sentadilla en multipower · prensa de piernas |
| Nivel 2 | Sentadilla con barra |
| Nivel 3 | Frontal · búlgara |

---

## Estructura

```
app/
├── src/
│   ├── App.jsx              Estado de la app: sesión, serie, descanso, navegación
│   ├── estado.js            Ajustes permanentes y sesión efímera de 4 h
│   ├── nativo.js            Vibración, notificaciones y pantalla encendida
│   ├── media.js             Rutas a los WebP y carga diferida de los pasos
│   ├── actualizacion.js     Aviso de versión nueva
│   ├── logica/
│   │   ├── generador.js     Genera sesiones, reparte volumen, busca alternativas
│   │   └── contenido.js     Técnica, errores y prescripción por patrón
│   ├── pantallas/           Onboarding · Entrenar · Sesión · Ficha · Explorar · Ajustes · Fin
│   ├── componentes/         Temporizador de descanso
│   └── datos/indice.json    Los 1.324 ejercicios ya procesados
├── public/
│   ├── media/               Animaciones y miniaturas en WebP (43 MB)
│   └── pasos.json           Instrucciones paso a paso, se piden al abrir una ficha
├── scripts/                 Preparación de datos, media, iconos y firma
├── maqueta/                 Maqueta HTML previa, sólo como referencia
└── android/                 Proyecto de Capacitor
```

### De dónde salen los datos

El origen es [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset).
Los scripts lo transforman en lo que la app necesita:

| Script | Qué hace |
|---|---|
| `nombres.mjs` | Traduce los 1.324 nombres al español por plantilla estructural, no palabra por palabra: `barbell incline bench press` → *Press de banca inclinado con barra*. Genera además alias de búsqueda, porque nadie escribe el nombre canónico entre series. |
| `patrones.mjs` | Clasifica cada ejercicio en uno de los **31 patrones de movimiento**, deduce su nivel (1-3) y si es compuesto o de aislamiento. El patrón manda sobre el músculo del dataset: si no, la sentadilla aparecería como ejercicio de glúteo. |
| `build-datos.mjs` | Junta todo y separa el índice (612 KB, va en el bundle) de los pasos (694 KB, se piden aparte). |
| `build-media.mjs` | Convierte los GIFs a WebP animado: **131 MB → 43 MB**, sin pérdida visible a 180×180. |
| `build-iconos.mjs` | Saca el icono de Android del isotipo del logo. |
| `crear-keystore.mjs` | Crea el almacén de firma. Se ejecuta **una sola vez**. |

Regenerar todo:

```bash
npm run datos     # vuelve a procesar el dataset
npm run media     # reconvierte las animaciones (tarda unos minutos)
npm run build     # compila la web
```

---

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173, y por wifi desde el móvil
```

El servidor escucha en toda la red, así que puedes abrirlo en el teléfono con la
IP del PC y probarlo con el dedo, que es como se prueba de verdad.

---

## Compilar el APK

Lo hace **GitHub Actions**: no hace falta instalar Java ni el SDK de Android.

1. Ve a la pestaña **Actions** del repositorio
2. Elige **Compilar APK** → **Run workflow**
3. Al terminar, el APK está en **Artifacts**, y también como *release* con enlace fijo

Cada subida a `main` compila automáticamente.

### La firma

Todos los APK van firmados con la **misma clave**. Android sólo permite
actualizar una app instalada si la firma coincide: con una clave distinta, quien
la tenga puesta tendría que desinstalarla y perder sus ajustes.

Los secretos del repositorio (*Settings → Secrets and variables → Actions*):

| Secreto | Qué es |
|---|---|
| `KEYSTORE_BASE64` | El archivo `tu-treno.keystore` en base64 |
| `KEYSTORE_PASSWORD` | La contraseña del almacén |
| `KEY_ALIAS` | `tutreno` |

> **El archivo `tu-treno.keystore` y su contraseña no están en este repositorio
> y no deben estarlo.** Guárdalos fuera del ordenador. Si se pierden, no hay
> forma de recuperarlos ni de volver a generarlos iguales.

### Instalar

Descarga el `.apk` en el móvil y ábrelo. La primera vez Android pedirá permiso
para instalar aplicaciones de origen desconocido: es lo normal al instalar fuera
de la Play Store.

---

## Créditos y uso

Las **animaciones y miniaturas son © [Gym visual](https://gymvisual.com/)** y
provienen de [exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset),
donde se redistribuyen con permiso a 180×180. Este repositorio es **privado y de
uso personal**. Para cualquier uso comercial o distribución pública hace falta
una licencia propia de Gym visual — consulta sus
[términos](https://gymvisual.com/content/3-terms-and-conditions-of-use).

El código es de **PercyTech Solutions**.

<div align="center">
  <br />
  <sub>Hecho para llevárselo al gimnasio, no para mirarlo desde el sofá.</sub>
</div>
