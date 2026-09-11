// node check.js
'use strict';
const assert = require('assert');
const { extraer, analizar, CATALOGO, DEMO } = require('./extraer.js');

// Fechas en varios formatos
assert.deepStrictEqual(
  extraer('20 de agosto de 2026, 25 agosto 2026, 20/08/2026 y 2026-08-20').fechas.map(f => f.iso),
  ['2026-08-20', '2026-08-25', '2026-08-20', '2026-08-20']
);

// Montos
assert.deepStrictEqual(extraer('Pagué $4,200 MXN (4.200 en la factura). 50,040 mWh no es dinero.').montos, ['$4,200 MXN', '4.200']);

// Entidades por sufijo legal y por etiqueta, sin duplicar
assert.deepStrictEqual(
  extraer('Remitente: Vístula Devices México S de RL de CV. Fabricante: Vístula Circular Devices sp. z o.o. Vendedor: Puente Digital Andino S.A.S., Bogotá. Marca: Brisa Tech México, soporte local.').entidades,
  ['Vístula Devices México S de RL de CV', 'Vístula Circular Devices sp. z o.o', 'Puente Digital Andino S.A.S', 'Brisa Tech México']
);

// Versiones, garantías (números en palabras) y horas de batería
const t = extraer('Versión CO 2026 3. Garantía: seis meses. Garantía comercial de treinta días. Batería: al menos tres horas. Vence en 48 horas.');
assert.deepStrictEqual(t.versiones, ['CO 2026 3']);
assert.deepStrictEqual(t.garantias, [{ n: 6, unidad: 'meses' }, { n: 30, unidad: 'días' }]);
assert.deepStrictEqual(t.horasBateria, [3]);

// Análisis del caso Brisa
const a = analizar({ items: DEMO, catalogo: CATALOGO });
const ids = a.senales.map(s => s.id);
['cobro_envio', 'version_posterior', 'garantia_distinta', 'presion', 'datos', 'serie_distinta'].forEach(id => assert.ok(ids.includes(id), 'falta señal ' + id));
assert.deepStrictEqual(a.pendientes.map(p => p.id), ['terminos_compra']);
assert.ok(a.lineaTiempo.every((f, i, arr) => i === 0 || arr[i - 1].iso <= f.iso), 'línea de tiempo desordenada');
assert.strictEqual(a.lineaTiempo[0].item, 'pedido');
assert.ok(a.quienAparece.find(q => q.nombre === 'Puente Digital Andino SAS').apariciones.some(x => x.rol === 'te cobró'));

// Sin notas no se inventa nada
const vacio = analizar({ items: {}, catalogo: CATALOGO });
assert.deepStrictEqual(vacio.senales, []);
assert.strictEqual(vacio.pendientes.length, CATALOGO.length);

console.log('check.js: todo en orden (' + a.senales.length + ' señales en el caso Brisa)');
