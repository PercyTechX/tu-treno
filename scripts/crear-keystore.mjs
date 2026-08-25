// Crea el almacén de firma de la app.
//
// POR QUÉ IMPORTA: Android sólo acepta actualizar una app si el APK nuevo está
// firmado con la MISMA clave. Si este archivo se pierde, quien tenga Tu Treno
// instalada tendrá que desinstalarla para poder poner una versión nueva.
// Se crea UNA vez y se guarda fuera del PC.
//
// Se genera en PKCS12 (con node-forge) en lugar de con keytool porque no hace
// falta tener instalado el JDK: Gradle acepta PKCS12 igual que un .jks.

import forge from 'node-forge';
import { writeFileSync, existsSync } from 'fs';
import { randomBytes } from 'crypto';

const DESTINO = 'e:/DEV/TuEjercicio/app/tu-treno.keystore';
const CLAVES = 'e:/DEV/TuEjercicio/app/CLAVES-NO-SUBIR.txt';
const ALIAS = 'tutreno';

if (existsSync(DESTINO)) {
  console.log('Ya existe', DESTINO, '— no se toca.');
  console.log('Si de verdad quieres uno nuevo, borra ese archivo antes. Aviso:');
  console.log('las apps ya instaladas dejarán de poder actualizarse.');
  process.exit(0);
}

const password = randomBytes(18).toString('base64').replace(/[+/=]/g, '').slice(0, 20);

console.log('Generando clave RSA de 2048 bits…');
const par = forge.pki.rsa.generateKeyPair(2048);

const cert = forge.pki.createCertificate();
cert.publicKey = par.publicKey;
cert.serialNumber = '01' + forge.util.bytesToHex(forge.random.getBytesSync(8));
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
// 30 años: Google exige que el certificado dure más que la vida de la app.
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 30);

const sujeto = [
  { name: 'commonName', value: 'Tu Treno' },
  { name: 'organizationName', value: 'PercyTech Solutions' },
  { name: 'countryName', value: 'PE' },
];
cert.setSubject(sujeto);
cert.setIssuer(sujeto);
cert.sign(par.privateKey, forge.md.sha256.create());

const p12 = forge.pkcs12.toPkcs12Asn1(par.privateKey, [cert], password, {
  algorithm: '3des',
  friendlyName: ALIAS,
  generateLocalKeyId: true,
});
writeFileSync(DESTINO, Buffer.from(forge.asn1.toDer(p12).getBytes(), 'binary'));

writeFileSync(CLAVES,
`CLAVES DE FIRMA DE TU TRENO — GUARDA ESTO FUERA DEL PC
=======================================================

Archivo de firma : tu-treno.keystore
Alias            : ${ALIAS}
Contraseña       : ${password}
   (la misma para el almacén y para la clave)

QUÉ ES
  Es la identidad de la app. Android sólo deja actualizar Tu Treno si el APK
  nuevo va firmado con esta clave.

SI LO PIERDES
  Nadie podrá actualizar la app: tendrán que desinstalarla e instalar de cero.
  No hay forma de recuperarlo ni de regenerarlo igual.

QUÉ HACER AHORA
  1. Copia tu-treno.keystore y este archivo a otro sitio: un pendrive, tu
     Google Drive, donde sea que no sea sólo este ordenador.
  2. No los subas a GitHub. Ya están excluidos en .gitignore.

PARA COMPILAR EN GITHUB ACTIONS
  Añade estos tres secretos en el repositorio
  (Settings > Secrets and variables > Actions):

    KEYSTORE_BASE64    -> el contenido de tu-treno.keystore convertido a base64
    KEYSTORE_PASSWORD  -> ${password}
    KEY_ALIAS          -> ${ALIAS}

  Para sacar el base64, en esta carpeta:
    node -e "console.log(require('fs').readFileSync('tu-treno.keystore').toString('base64'))"
`);

console.log('\nCreado:', DESTINO);
console.log('Claves guardadas en:', CLAVES);
console.log('\n>>> Copia esos dos archivos fuera de este ordenador. <<<');
