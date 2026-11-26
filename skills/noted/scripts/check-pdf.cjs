#!/usr/bin/env node
// Rasterize each page for inspection; optionally compare with an earlier export.
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {createHash} = require('node:crypto');
function run(command,args) {
  const result=spawnSync(command,args,{encoding:'utf8'});
  if(result.error)throw result.error;
  if(result.status!==0)throw Error(result.stderr||command+' failed');
  return result.stdout;
}
function raster(file,dir) {
  fs.mkdirSync(dir);
  console.log(run('pdfinfo',[file]));
  run('pdftoppm',['-r','144','-png',file,path.join(dir,'page')]);
  return fs.readdirSync(dir).sort().map(name=>createHash('sha256').update(fs.readFileSync(path.join(dir,name))).digest('hex'));
}
try {
  const [file,folder,comparison]=process.argv.slice(2);
  if(!file||!folder)throw Error('Usage: node scripts/check-pdf.cjs document.pdf fresh-folder [earlier.pdf]');
  const hashes=raster(file,folder);
  console.log('Rendered '+hashes.length+' page(s) to '+folder);
  if(comparison){
    const previous=raster(comparison,path.join(folder,'comparison'));
    if(JSON.stringify(hashes)!==JSON.stringify(previous))throw Error('Rendered pages differ');
    console.log('All rendered PNG files match at 144 dpi');
  }
}catch(error){console.error(error.message);process.exitCode=1;}
