// Funciones puras (sin DOM). Se cargan en index.html y se prueban con check.js.
'use strict';

// ---------- Catálogo de evidencia ----------
const CATALOGO = [
  { id: 'pedido', grupo: 'Compra', nombre: 'Confirmación del pedido', para: 'Prueba qué compraste, cuándo y a qué precio.', pedir: 'Búscala en tu correo o en la app donde compraste; pide al vendedor que te la reenvíe con tu número de pedido.' },
  { id: 'pago', grupo: 'Compra', nombre: 'Comprobante del pago', para: 'Muestra quién te cobró realmente (a veces no es quien creías).', pedir: 'En tu app bancaria, el movimiento del cargo. Basta ese movimiento, no todo el estado de cuenta.' },
  { id: 'oferta', grupo: 'Compra', nombre: 'Captura de la oferta', para: 'Lo que te prometieron antes de pagar: garantía, batería, soporte.', pedir: 'Si no la guardaste, busca la página o el anuncio y toma captura hoy; anota la fecha.' },
  { id: 'guia', grupo: 'Entrega', nombre: 'Etiqueta o guía de envío', para: 'Quién te lo envió y desde dónde.', pedir: 'Está en la caja o en el mensaje de la paquetería; pide el número de guía al vendedor.' },
  { id: 'caja', grupo: 'Entrega', nombre: 'Papeles dentro de la caja', para: 'Tarjetas de garantía, folletos, códigos QR.', pedir: 'Revisa la caja; si un QR no abre, toma foto de la tarjeta y del error.' },
  { id: 'serie', grupo: 'Entrega', nombre: 'Foto del número de serie', para: 'Identifica tu equipo exacto.', pedir: 'Etiqueta debajo del equipo y, si puedes, la que muestra el sistema.' },
  { id: 'terminos_compra', grupo: 'Condiciones', nombre: 'Términos del día que compraste', para: 'La versión que aceptaste. Casi nadie la guarda; es normal.', pedir: 'Pide por escrito la versión exacta de términos que aceptaste, con su identificador y fecha de publicación. Si te mandan otra versión, anótalo.' },
  { id: 'terminos_despues', grupo: 'Condiciones', nombre: 'Términos que te mandaron después', para: 'Puede ser una versión distinta a la que aceptaste.', pedir: 'Pide que te envíen el archivo y anota su identificador de versión.' },
  { id: 'chat', grupo: 'Conversaciones', nombre: 'Mensajes con soporte', para: 'Qué te pidieron, qué te ofrecieron, qué te dijeron.', pedir: 'Toma capturas completas con fecha y hora visibles.' },
  { id: 'reclamo', grupo: 'Conversaciones', nombre: 'Tu reclamación por escrito', para: 'Si ya la enviaste.', pedir: 'Aún no la envías: este resumen te sirve para prepararla.' },
  { id: 'respuesta', grupo: 'Conversaciones', nombre: 'Respuesta de la empresa', para: 'Su postura oficial.', pedir: 'Pide que respondan por escrito; guarda el correo completo.' },
  { id: 'video', grupo: 'La falla', nombre: 'Video o fotos del problema', para: 'Muestra lo que pasa.', pedir: 'Graba el fallo con fecha visible; no hace falta editar.' },
  { id: 'informe', grupo: 'La falla', nombre: 'Informe técnico o de batería', para: 'Aunque sea el que genera el propio equipo.', pedir: 'Muchos sistemas generan un informe de batería; si no sabes cómo, márcalo como pendiente.' }
];

// ---------- Demo: caso Brisa ----------
const DEMO = {
  pedido: { estado: 'tengo', nota: 'Pedido BTMX 2026 0820 1147. 20 de agosto de 2026, 19:42. Portátil reacondicionada Krak R14 grado B. $4,200 MXN envío incluido. Canal: brisatech.example/mx. Estado: pago aprobado, preparación local.' },
  pago: { estado: 'tengo', nota: '20 de agosto de 2026. $4,200.00 MXN. Descriptor: PUENTE DIGITAL ANDINO BOG CO (Puente Digital Andino SAS, Colombia). Procesador PagoNube Latam ref PN 663190. Autorización 847215.' },
  oferta: { estado: 'tengo', nota: 'Captura 20 de agosto de 2026 19:39. Marca: Brisa Tech México, tecnología circular con soporte local. Reacondicionada grado B, funcionamiento verificado. Batería: al menos tres horas en uso de estudio. Garantía: seis meses de respaldo Brisa en México. Devolución: compra protegida, consulta condiciones. No aparecía razón social junto al botón de pago.' },
  guia: { estado: 'tengo', nota: 'Remitente: Vístula Devices México S de RL de CV. Origen: centro de reacondicionamiento Huejotzingo, Puebla. Guía MXR 420 881 269. Entregado 24 de agosto de 2026 13:18. Serie externa KR14 MX 08317.' },
  caja: { estado: 'tengo', nota: 'Tarjeta: Garantía limitada de noventa días, diagnóstico en México. Sin razón social ni domicilio. QR lleva a Error 404.' },
  serie: { estado: 'tengo', nota: 'Serie exterior KR14 MX 08317. En el sistema la placa reporta KR14 PL 08318.' },
  terminos_compra: { estado: 'no', nota: '' },
  terminos_despues: { estado: 'tengo', nota: 'Recibidos 2 de septiembre de 2026. Versión CO 2026 3, publicada 25 de agosto de 2026. Vendedor: Puente Digital Andino SAS, Bogotá. Garantía comercial de treinta días. Batería consumible. Compradora cubre transporte inicial. Diagnóstico quince días hábiles. Ley de Colombia, jueces de Bogotá. El registro de aceptación dice que acepté CO 2026 2 el 21 de agosto de 2026, pero esa versión no está disponible.' },
  chat: { estado: 'tengo', nota: '29 de agosto de 2026: reporté que se apaga sin cargador. El asistente LIA pidió identificación por ambos lados, estado de cuenta completo, video y diagnóstico; dijo que tenía cinco días desde la entrega. Dijo que el vendedor es Brisa Tech México. 2 de septiembre de 2026: el agente dijo que la venta es de Puente Digital Andino SAS y ofreció cupón del 25% si cierro el caso hoy. Respondí que me siento presionada.' },
  reclamo: { estado: 'tengo', nota: '3 de septiembre de 2026. Pedí por escrito identidad y domicilio del responsable, versión de condiciones que acepté, procedimiento, plazo y quién paga el envío. No autorizo usar mis datos para entrenar sistemas. No acepto cupón por cerrar el caso.' },
  respuesta: { estado: 'tengo', nota: '5 de septiembre de 2026. Puente Digital Andino SAS: vendedor registrado, ley colombiana, Bogotá. Garantía 30 días, excluye desgaste de batería. Revisión en Vístula Devices México sin reconocer defecto; yo pago envío inicial; 15 días hábiles. Cupón 25% si respondo "Acepto solución final y renuncio a reclamaciones"; vence en 48 horas.' },
  video: { estado: 'tengo', nota: 'Video de 18 segundos, 29 de agosto de 2026: se apaga a los pocos segundos de desconectar.' },
  informe: { estado: 'tengo', nota: '1 de septiembre de 2026. Capacidad de diseño 50,040 mWh; carga completa 16,180 mWh (32.3%). 612 ciclos. Con otro cargador pasa lo mismo.' }
};

// ---------- Extracción ----------
// ponytail: reglas simples; sustituir por llamada a modelo cuando haya conexión
const MESES = { enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10, noviembre: 11, diciembre: 12 };
const PALABRAS_NUM = { un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, quince: 15, treinta: 30, sesenta: 60, noventa: 90 };
const NUM = '(\\d{1,3}|' + Object.keys(PALABRAS_NUM).join('|') + ')';
const CAP = '[A-ZÁÉÍÓÚÑ][\\wáéíóúñÁÉÍÓÚÑ]*';
const SUFIJO = '(?:S\\.?\\s?A\\.?\\s?S|S\\.?\\s?de\\s?R\\.?\\s?L\\.?\\s?de\\s?C\\.?\\s?V|S\\.?\\s?A\\.?\\s?de\\s?C\\.?\\s?V|S\\.?\\s?R\\.?\\s?L|sp\\.?\\s?z\\s?o\\.?\\s?o|Ltda|Inc|LLC|S\\.?\\s?A)';

const RE_FECHA_ES = new RegExp('\\b(\\d{1,2})\\s+(?:de\\s+)?(' + Object.keys(MESES).join('|') + ')\\s+(?:de\\s+|del\\s+)?(\\d{4})\\b', 'gi');
const RE_FECHA_NUM = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g;
const RE_FECHA_ISO = /\b(\d{4})-(\d{2})-(\d{2})\b/g;
const RE_MONTO = /\$\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:MXN|USD|COP|pesos))?|\b\d{1,3}(?:\.\d{3})+\b/g;
const RE_ENTIDAD = new RegExp('((?:' + CAP + '\\s+){1,5})' + SUFIJO + '(?=[\\s,.;:)]|$)', 'g');
const RE_ETIQUETA = /(?:marca|vendedor|remitente|empresa|fabricante|raz[oó]n social)\s*(?::|es)\s*([A-ZÁÉÍÓÚÑ][^.,;:\n()]*)/gi;
const RE_SUFIJO_FIN = new RegExp('\\s*' + SUFIJO + '\\.?$', 'i');
const RE_PREFIJO = /^(?:Remitente|Vendedor|Marca|Empresa|Fabricante|Es|De|El|La|En|Con|Por|Para)\s+/;
const RE_VERSION = /\b[A-Z]{2,4}[ -]\d{4}[ -]\d{1,3}\b/g;
const RE_GARANTIA = new RegExp('garant[ií]a[^.;\\n]{0,40}?\\b' + NUM + '\\s+(mes(?:es)?|d[ií]as?|a[ñn]os?)\\b', 'gi');
const RE_BAT_ANTES = new RegExp('(?:bater[ií]a|autonom[ií]a)[^.;\\n]{0,60}?\\b' + NUM + '\\s+horas?\\b', 'gi');
const RE_BAT_DESPUES = new RegExp('\\b' + NUM + '\\s+horas?\\b[^.;\\n]{0,40}?(?:bater[ií]a|autonom[ií]a)', 'gi');

const numero = s => PALABRAS_NUM[s.toLowerCase()] || parseInt(s, 10);
const dosDigitos = n => String(n).padStart(2, '0');
const isoDe = (d, m, y) => y + '-' + dosDigitos(m) + '-' + dosDigitos(d);
const unidadDe = u => u[0].toLowerCase() === 'm' ? 'meses' : u[0].toLowerCase() === 'a' ? 'años' : 'días';
const unico = arr => arr.filter((x, i) => arr.indexOf(x) === i);

function claveEntidad(nombre) {
  return nombre.replace(RE_SUFIJO_FIN, '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim().replace(/\s+/g, ' ');
}

function extraer(texto) {
  const t = String(texto || '');
  const fechas = [];
  for (const m of t.matchAll(RE_FECHA_ES)) fechas.push({ iso: isoDe(m[1], MESES[m[2].toLowerCase()], m[3]), texto: m[0] });
  for (const m of t.matchAll(RE_FECHA_NUM)) fechas.push({ iso: isoDe(m[1], m[2], m[3]), texto: m[0] });
  for (const m of t.matchAll(RE_FECHA_ISO)) fechas.push({ iso: m[0], texto: m[0] });

  const montos = unico([...t.matchAll(RE_MONTO)].map(m => m[0].trim()));

  const entidades = [];
  const agregar = nombre => {
    nombre = nombre.replace(RE_PREFIJO, '').trim();
    const k = claveEntidad(nombre);
    if (!k || entidades.some(e => { const ke = claveEntidad(e); return ke.startsWith(k) || k.startsWith(ke); })) return;
    entidades.push(nombre);
  };
  for (const m of t.matchAll(RE_ENTIDAD)) agregar(m[0]);
  for (const m of t.matchAll(RE_ETIQUETA)) agregar(m[1]);

  const versiones = unico([...t.matchAll(RE_VERSION)].map(m => m[0]));
  const garantias = [...t.matchAll(RE_GARANTIA)].map(m => ({ n: numero(m[1]), unidad: unidadDe(m[2]) }));
  const horasBateria = unico([...t.matchAll(RE_BAT_ANTES), ...t.matchAll(RE_BAT_DESPUES)].map(m => numero(m[1])));

  return { fechas, montos, entidades, versiones, garantias, horasBateria };
}

// ---------- Análisis del expediente ----------
const ROLES = {
  pago: 'te cobró', guia: 'te envió', terminos_compra: 'vendedor según los términos', terminos_despues: 'vendedor según los términos',
  oferta: 'marca que viste', pedido: 'marca que viste', chat: 'nombrado en el chat', respuesta: 'firma la respuesta', caja: 'aparece en la caja'
};
const RE_PRESION = /cup[oó]n|renunci|cierr\w* el caso hoy|vence en 48|48 horas/i;
const RE_DATOS = /identificaci[oó]n|estado de cuenta|\bINE\b|pasaporte/i;
const RE_SERIE = /\b[A-Z]{2,4}\d{1,3} [A-Z]{2} \d{4,6}\b/g;
const RE_PUBLICADA = /publicad[ao]s?[^.,;]{0,20}?(\d{1,2}\s+(?:de\s+)?[a-záéíóú]+\s+(?:de\s+)?\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i;

const enDias = g => g.unidad === 'meses' ? g.n * 30 : g.unidad === 'años' ? g.n * 365 : g.n;
const fmtGarantia = g => g.n + ' ' + (g.n === 1 ? g.unidad.replace(/es$|s$/, '') : g.unidad);

function analizar(estado) {
  const items = (estado && estado.items) || {};
  const catalogo = (estado && estado.catalogo) || CATALOGO;
  const nombreDe = id => (catalogo.find(c => c.id === id) || { nombre: id }).nombre;
  const nota = id => (items[id] && items[id].estado === 'tengo' && items[id].nota) || '';
  const ex = {};
  catalogo.forEach(c => { if (nota(c.id)) ex[c.id] = extraer(nota(c.id)); });

  const lineaTiempo = [];
  Object.keys(ex).forEach(id => ex[id].fechas.forEach(f => {
    if (lineaTiempo.some(x => x.iso === f.iso && x.item === id)) return;
    const frase = (nota(id).split(/[.;]\s+/).find(s => s.includes(f.texto)) || '').replace(/[.;]$/, '').trim();
    const contexto = frase === f.texto ? '' : frase.length > 90 ? frase.slice(0, 90).replace(/\s\S*$/, '') + '…' : frase;
    lineaTiempo.push({ iso: f.iso, texto: f.texto, item: id, nombre: nombreDe(id), contexto });
  }));
  lineaTiempo.sort((a, b) => a.iso.localeCompare(b.iso));

  const mapa = new Map();
  Object.keys(ex).forEach(id => ex[id].entidades.forEach(e => {
    const k = claveEntidad(e);
    if (!mapa.has(k)) mapa.set(k, { nombre: e, apariciones: [] });
    mapa.get(k).apariciones.push({ item: id, nombre: nombreDe(id), rol: ROLES[id] || 'aparece en ' + nombreDe(id).toLowerCase() });
  }));
  const quienAparece = [...mapa.values()];

  const garantiasDe = ids => ids.filter(id => ex[id] && ex[id].garantias.length).map(id => Object.assign({ item: id, nombre: nombreDe(id) }, ex[id].garantias[0]));
  const promesas = {
    garantiaOferta: (ex.oferta && ex.oferta.garantias[0]) || null,
    bateriaOferta: (ex.oferta && ex.oferta.horasBateria[0]) || null,
    garantiasTerminos: garantiasDe(['terminos_compra', 'terminos_despues']),
    otrasGarantias: garantiasDe(Object.keys(ex).filter(id => !/^(oferta|terminos_)/.test(id)))
  };

  const senales = [];
  const cobro = ex.pago && ex.pago.entidades, envio = ex.guia && ex.guia.entidades;
  if (cobro && cobro.length && envio && envio.length && !cobro.some(a => envio.some(b => claveEntidad(a) === claveEntidad(b)))) {
    senales.push({ id: 'cobro_envio', items: ['pago', 'guia'],
      texto: 'Quien te cobró (' + cobro[0] + ') no es quien te envió el equipo (' + envio[0] + ').',
      porque: 'Cada empresa puede decir que la responsable es la otra. Pide por escrito quién responde por la garantía y con qué domicilio.' });
  }

  const compra = ['pedido', 'pago', 'oferta'].map(id => ex[id] && ex[id].fechas[0]).find(Boolean);
  ['terminos_despues', 'terminos_compra'].forEach(id => {
    const m = nota(id).match(RE_PUBLICADA);
    const pub = m && extraer(m[1]).fechas[0];
    if (compra && pub && pub.iso > compra.iso) {
      const v = ex[id].versiones[0];
      senales.push({ id: 'version_posterior', items: [id, 'pedido'],
        texto: 'Los términos que te mandaron' + (v ? ' (versión ' + v + ')' : '') + ' se publicaron el ' + pub.texto + ', después de tu compra del ' + compra.texto + '.',
        porque: 'Valen las condiciones que aceptaste al comprar, no las que publicaron después. Pide esa versión exacta por escrito.' });
    }
  });

  const go = promesas.garantiaOferta;
  promesas.garantiasTerminos.forEach(gt => {
    if (go && enDias(go) !== enDias(gt)) {
      senales.push({ id: 'garantia_distinta', items: ['oferta', gt.item],
        texto: 'Te anunciaron ' + fmtGarantia(go) + ' de garantía; los ' + gt.nombre.toLowerCase() + ' dicen ' + fmtGarantia(gt) + '.',
        porque: 'La oferta que viste antes de pagar forma parte del trato. Tu captura con fecha es la prueba.' });
    }
  });

  const conversacion = nota('chat') + '\n' + nota('respuesta');
  if (RE_PRESION.test(conversacion)) {
    senales.push({ id: 'presion', items: ['chat', 'respuesta'].filter(nota),
      texto: 'Te ofrecen cerrar a cambio de renunciar. No tienes que decidir hoy.',
      porque: 'Un plazo corto sirve para presionar. Puedes pedir la propuesta por escrito y tomarte el tiempo de revisarla con alguien.' });
  }
  if (RE_DATOS.test(nota('chat'))) {
    senales.push({ id: 'datos', items: ['chat'],
      texto: 'Pidieron datos que no hacen falta para diagnosticar una falla.',
      porque: 'Para revisar un equipo basta el número de pedido y la serie. Tu identificación y tus movimientos bancarios no son necesarios.' });
  }

  const series = unico((nota('serie') + ' ' + nota('guia')).match(RE_SERIE) || []);
  if (series.length > 1) {
    senales.push({ id: 'serie_distinta', items: ['serie'],
      texto: 'El número de serie del exterior (' + series[0] + ') no coincide con el que reporta el sistema (' + series[1] + ').',
      porque: 'Puede indicar que la carcasa y la placa vienen de equipos distintos. Anótalo tal cual; no lo interpretes todavía.' });
  }

  const pendientes = catalogo.filter(c => !items[c.id] || items[c.id].estado !== 'tengo')
    .map(c => ({ id: c.id, nombre: c.nombre, estado: (items[c.id] && items[c.id].estado) || 'sin marcar', pedir: c.pedir }));

  return { lineaTiempo, quienAparece, promesas, senales, pendientes };
}

if (typeof module !== 'undefined') module.exports = { extraer, analizar, CATALOGO, DEMO };
