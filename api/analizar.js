// Proxy a DeepSeek. La key vive solo en la variable de entorno DEEPSEEK_API_KEY (Vercel), nunca en el frontend.

const SISTEMA = `Eres el asistente de Folio, una herramienta que ayuda a una persona con una compra fallida a ordenar su evidencia. Trabajas únicamente con las notas que la persona escribió.

Reglas:
1. No inventes datos, cláusulas, plazos ni derechos. Si algo no está en las notas, escribe "pendiente".
2. No des conclusiones jurídicas ni digas si la persona tiene razón. Sí puedes señalar contradicciones entre las notas y explicar por qué importan.
3. Nunca sugieras aceptar ofertas, cupones o renuncias. Si en las notas hay presión (plazos cortos para renunciar, cupones a cambio de cerrar el caso, amenazas, insistencia en decidir hoy), márcalo en "presion" con detectada=true.
4. Español claro, frases cortas, sin tecnicismos. Trata a la persona de tú.
5. "borrador" es una solicitud de información por escrito dirigida a la empresa. Pide: quién responde legalmente y su domicilio; la versión exacta de los términos aceptados el día de la compra, con identificador y fecha; el procedimiento y plazo del diagnóstico; quién cubre el envío. No renuncia a nada, no acepta nada, no amenaza. Deja entre corchetes lo que la persona debe completar. Si presion.detectada es true, deja "borrador" vacío.
6. "limites" lista lo que este análisis no puede afirmar (por ejemplo, qué ley aplica o cuál es la causa técnica).

Responde solo con JSON con esta forma exacta:
{"clasificacion":[{"id":"id del ítem","tipo":"compra|entrega|condiciones|conversacion|falla|otro","resumen":"una frase","datos":{"fechas":[],"entidades":[],"montos":[],"promesas":[]}}],
 "senales":[{"texto":"qué no cuadra","porque":"por qué importa"}],
 "pendientes":[{"nombre":"qué falta","pedir":"cómo pedirlo"}],
 "presion":{"detectada":false,"porque":""},
 "borrador":"",
 "limites":[]}`;

function construirMensajes(items, catalogo) {
  const notas = [], faltan = [];
  catalogo.forEach(c => {
    const x = items[c.id];
    if (x && x.estado === 'tengo' && (x.nota || '').trim()) notas.push('[' + c.id + '] ' + c.nombre + ':\n' + x.nota.trim());
    else faltan.push('[' + c.id + '] ' + c.nombre);
  });
  const usuario = 'NOTAS DE LA PERSONA\n\n' + (notas.join('\n\n') || '(sin notas)') +
    '\n\nMARCADO COMO NO DISPONIBLE\n' + (faltan.join('\n') || '(nada)');
  return [{ role: 'system', content: SISTEMA }, { role: 'user', content: usuario }];
}

function normalizar(j) {
  const arr = v => Array.isArray(v) ? v : [];
  return {
    clasificacion: arr(j.clasificacion),
    senales: arr(j.senales),
    pendientes: arr(j.pendientes),
    presion: { detectada: !!(j.presion && j.presion.detectada), porque: (j.presion && j.presion.porque) || '' },
    borrador: typeof j.borrador === 'string' ? j.borrador : '',
    limites: arr(j.limites)
  };
}

function parsear(texto) {
  try { const j = JSON.parse(texto); return j && typeof j === 'object' ? normalizar(j) : null; }
  catch (e) { return null; }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Solo POST' });
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return res.status(500).json({ error: 'Falta configurar DEEPSEEK_API_KEY en Vercel' });
  const { items, catalogo } = req.body || {};
  if (!items || !Array.isArray(catalogo)) return res.status(400).json({ error: 'Faltan items o catalogo' });
  if (JSON.stringify(items).length > 40000) return res.status(413).json({ error: 'Las notas son demasiado largas' });

  let r;
  try {
    r = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + key },
      body: JSON.stringify({ model: 'deepseek-chat', temperature: 0.2, response_format: { type: 'json_object' }, messages: construirMensajes(items, catalogo) })
    });
  } catch (e) {
    return res.status(502).json({ error: 'No se pudo contactar al servicio de IA' });
  }
  if (!r.ok) return res.status(502).json({ error: 'El servicio de IA respondió ' + r.status });
  const data = await r.json();
  const j = parsear((data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '');
  if (!j) return res.status(502).json({ error: 'La respuesta de la IA no tiene el formato esperado' });
  return res.status(200).json(j);
};
module.exports.construirMensajes = construirMensajes;
module.exports.parsear = parsear;
