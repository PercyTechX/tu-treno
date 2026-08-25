// Genera el icono de Android a partir del isotipo (la "P") del logo de PercyTech.
// El logo completo es apaisado (1292x362) y como icono se vería diminuto; el
// isotipo es cuadrado y funciona tal cual.

import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

const LOGO = 'e:/DEV/TuEjercicio/app/logo.webp';
const RES = 'e:/DEV/TuEjercicio/app/android/app/src/main/res/';
const AZUL = { r: 0x3F, g: 0x8B, b: 0xE8, alpha: 1 };

// Recorte cuadrado del isotipo dentro del logo, medido sobre el archivo original.
const RECORTE = { left: 0, top: 0, width: 362, height: 362 };

const MIPMAPS = [
  ['mipmap-mdpi', 48], ['mipmap-hdpi', 72], ['mipmap-xhdpi', 96],
  ['mipmap-xxhdpi', 144], ['mipmap-xxxhdpi', 192],
];
// El icono adaptativo se recorta en círculo: la marca debe caber en el 66%
// central o Android le come las esquinas.
const ADAPTATIVO = [
  ['mipmap-mdpi', 108], ['mipmap-hdpi', 162], ['mipmap-xhdpi', 216],
  ['mipmap-xxhdpi', 324], ['mipmap-xxxhdpi', 432],
];

// La "P" es blanca sobre azul. Se separa por umbral de luminancia y se usa como
// canal alfa: así queda blanca sobre transparente y sirve igual para el icono
// adaptativo (que pone su propio fondo) y para la barra de notificaciones.
const recorte = await sharp(LOGO).extract(RECORTE).png().toBuffer();
const { width: W, height: H } = await sharp(recorte).metadata();
const alfa = await sharp(recorte).greyscale().threshold(215).raw().toBuffer();
const isotipo = await sharp({ create: { width: W, height: H, channels: 3, background: { r: 255, g: 255, b: 255 } } })
  .joinChannel(alfa, { raw: { width: W, height: H, channels: 1 } })
  .png().toBuffer();

async function escribir(carpeta, nombre, buffer) {
  mkdirSync(RES + carpeta, { recursive: true });
  writeFileSync(RES + carpeta + '/' + nombre, buffer);
}

// 1. Icono clásico: P blanca sobre cuadrado azul
for (const [carpeta, px] of MIPMAPS) {
  const marca = await sharp(isotipo).resize(Math.round(px * 0.62), Math.round(px * 0.62),
    { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const icono = await sharp({ create: { width: px, height: px, channels: 4, background: AZUL } })
    .composite([{ input: marca, gravity: 'center' }]).png().toBuffer();
  await escribir(carpeta, 'ic_launcher.png', icono);
  await escribir(carpeta, 'ic_launcher_round.png', icono);
}

// 2. Capa de primer plano del icono adaptativo (fondo aparte, en color)
for (const [carpeta, px] of ADAPTATIVO) {
  const marca = await sharp(isotipo).resize(Math.round(px * 0.42), Math.round(px * 0.42),
    { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const capa = await sharp({ create: { width: px, height: px, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: marca, gravity: 'center' }]).png().toBuffer();
  await escribir(carpeta, 'ic_launcher_foreground.png', capa);
}

// 3. Icono monocromo de la barra de notificaciones: blanco sobre transparente
const aviso = await sharp(isotipo).resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png().toBuffer();
for (const [carpeta, px] of [['drawable-mdpi', 24], ['drawable-hdpi', 36], ['drawable-xhdpi', 48], ['drawable-xxhdpi', 72]]) {
  const ic = await sharp(aviso).resize(px, px).png().toBuffer();
  await escribir(carpeta, 'ic_stat_icon.png', ic);
}

// 4. Splash: el logo completo centrado sobre el azul de marca
const logoSplash = await sharp(LOGO).resize(900, null, { fit: 'inside' }).png().toBuffer();
for (const [carpeta, w, h] of [['drawable', 1080, 1920], ['drawable-land', 1920, 1080]]) {
  const splash = await sharp({ create: { width: w, height: h, channels: 4, background: AZUL } })
    .composite([{ input: logoSplash, gravity: 'center' }]).png().toBuffer();
  await escribir(carpeta, 'splash.png', splash);
}

// 5. Colores: fondo del icono adaptativo y de la pantalla de arranque
mkdirSync(RES + 'values', { recursive: true });
writeFileSync(RES + 'values/ic_launcher_background.xml',
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#3F8BE8</color>
</resources>
`);
mkdirSync(RES + 'mipmap-anydpi-v26', { recursive: true });
const adaptativo = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
writeFileSync(RES + 'mipmap-anydpi-v26/ic_launcher.xml', adaptativo);
writeFileSync(RES + 'mipmap-anydpi-v26/ic_launcher_round.xml', adaptativo);

console.log('iconos escritos en', RES);

// Muestra suelta para revisarla antes de compilar
await sharp({ create: { width: 192, height: 192, channels: 4, background: AZUL } })
  .composite([{ input: await sharp(isotipo).resize(119, 119, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), gravity: 'center' }])
  .png().toFile('e:/DEV/TuEjercicio/app/icono-muestra.png');
console.log('muestra: app/icono-muestra.png');
