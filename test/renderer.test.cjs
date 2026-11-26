const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),z=require('node:zlib');
const {spawnSync}=require('node:child_process');
const {render}=require('../skills/noted/scripts/render.cjs');
const {loadBitmap}=require('../skills/noted/scripts/bitmap.cjs');
const {traceRows}=require('../skills/noted/scripts/trace.cjs');
const dir=path.join(__dirname,'../skills/noted/assets');
const manifest=require('../skills/noted/assets/example.json');
const date=new Date('2020-01-02T03:04:05Z');
test('two ink rows, holes and intact radical contour',()=>{
 const bitmap=loadBitmap(path.join(dir,'example.bmp'));
 const [first,second]=traceRows(bitmap,[30,72],115);
 assert.ok(first.length>=5);
 assert.ok(second.some(contour=>{
   const xs=contour.map(p=>p[0]),ys=contour.map(p=>p[1]);
   return Math.max(...xs)-Math.min(...xs)>40 && Math.max(...ys)-Math.min(...ys)>17;
 }));
 assert.ok(second.length>=5);
});
test('valid PDF offsets, ruled lines, vector ink and repeatable output',()=>{
 const pdf=render(manifest,dir,date);
 assert.deepEqual(pdf,render(manifest,dir,date));
 const source=pdf.toString('latin1');
 const start=Number(source.match(/startxref\n(\d+)/)[1]);
 assert.equal(source.slice(start,start+4),'xref');
 const table=source.slice(start).split('\n');
 for(let i=1;i<Number(table[1].split(' ')[1]);i++){
   const offset=Number(table[2+i].slice(0,10));
   assert.ok(source.startsWith(i+' 0 obj',offset));
 }
 const stream=source.indexOf('stream\n')+7;
 const content=z.inflateSync(pdf.subarray(stream)).toString();
 assert.equal((content.match(/ l S/g)||[]).length,34);
 assert.equal((content.match(/B\*/g)||[]).length,2);
 assert.ok(content.includes(' c\n'));
 assert.ok(source.includes('/Producer (noted)'));
});
test('flows across pages and skips extra gap at a page boundary',()=>{
 const repeated={...manifest,profile:{ruleCount:3},sources:[...manifest.sources,...manifest.sources]};
 const result=render(repeated,dir,date).toString('latin1');
 assert.ok(result.includes('/Count 3 '));
});
test('invalid row centers, geometry, blank inputs and wrong file formats fail',()=>{
 assert.throws(()=>render({sources:[{file:'example.bmp',centers:[72,30]}]},dir,date),/centers/);
 assert.throws(()=>render({...manifest,profile:{ruleSpacing:100}},dir,date),/geometry/);
 assert.throws(()=>render({...manifest,profile:{width:12}},dir,date),/beyond the page/);
 assert.throws(()=>loadBitmap(path.join(dir,'example.json')),/BMP/);
 assert.throws(()=>render({sources:[]},dir,date),/source/);
 assert.throws(()=>render({...manifest,sources:[{file:'example.bmp',centers:[5,30,72]}]},dir,date),/No ink/);
});
test('CLI does not overwrite an existing output',t=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'noted-'));
 t.after(()=>fs.rmSync(temp,{recursive:true,force:true}));
 const out=path.join(temp,'out.pdf'),cli=path.join(__dirname,'../skills/noted/scripts/render.cjs');
 const args=[cli,path.join(dir,'example.json'),out];
 assert.equal(spawnSync(process.execPath,args).status,0);
 const before=fs.readFileSync(out);
 assert.equal(spawnSync(process.execPath,args).status,1);
 assert.deepEqual(fs.readFileSync(out),before);
});
