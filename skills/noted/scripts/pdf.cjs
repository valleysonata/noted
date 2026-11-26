const zlib = require('node:zlib');
const fixed = value => Number(value.toFixed(3));

function pdfText(value) {
  const utf16 = Buffer.from(value, 'utf16le').swap16();
  return '<FEFF' + utf16.toString('hex') + '>';
}

function makePdf(sheets, profile, date, metadata = {}) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw Error('Metadata must be an object');
  }
  const fields = {title: 'Title', author: 'Author'};
  const entries = Object.entries(metadata).map(([key, value]) => {
    if (!Object.hasOwn(fields, key) || typeof value !== 'string') {
      throw Error('Invalid PDF metadata field: ' + key);
    }
    return ' /' + fields[key] + ' ' + pdfText(value);
  });
  const chunks = [], offsets = [0];
  let length = 0;
  function add(value) {
    const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);
    chunks.push(buffer);
    length += buffer.length;
  }
  function object(id, ...parts) {
    offsets[id] = length;
    add(id + ' 0 obj\n');
    parts.forEach(add);
    add('\nendobj\n');
  }
  add('%PDF-1.3\n');
  const ids = sheets.map((_, i) => 3 + 2*i);
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Count '+ids.length+' /Kids ['+ids.map(id=>id+' 0 R').join(' ')+'] >>');
  for (const [i,rows] of sheets.entries()) {
    const id=ids[i], {width,height,ruleCount,firstRule,ruleSpacing,ruleGray,ruleWidth}=profile;
    const rules=Array.from({length:ruleCount}, (_,j)=>{
      const y=fixed(height-firstRule-j*ruleSpacing);
      return '0 '+y+' m '+width+' '+y+' l S';
    });
    const stream=zlib.deflateSync(Buffer.from([ruleGray+' G '+ruleWidth+' w',...rules,...rows].join('\n')));
    object(id,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+width+' '+height+'] /Resources << >> /Contents '+(id+1)+' 0 R >>');
    object(id+1,'<< /Filter /FlateDecode /Length '+stream.length+' >>\nstream\n',stream,'\nendstream');
  }
  const stamp='D:'+date.toISOString().slice(0,19).replace(/[-:T]/g,'')+'Z';
  const info=offsets.length;
  object(info,'<< /Producer (noted) /CreationDate ('+stamp+') /ModDate ('+stamp+')'+entries.join('')+' >>');
  const xref=length;
  add('xref\n0 '+offsets.length+'\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join(''));
  add('trailer\n<< /Size '+offsets.length+' /Info '+info+' 0 R /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n');
  return Buffer.concat(chunks);
}
module.exports={makePdf};
