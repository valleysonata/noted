#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const {loadBitmap} = require('./bitmap.cjs');
const {traceRows,drawRow} = require('./trace.cjs');
const {makePdf} = require('./pdf.cjs');
const defaults = require('../assets/profile.json');

function render(manifest, directory, date = new Date()) {
  const profile = {...defaults,...manifest.profile};
  for(const key of Object.keys(profile)){
    if(!(key in defaults) || !Number.isFinite(profile[key])) throw Error('Invalid profile field: '+key);
  }
  if(!Number.isInteger(profile.ruleCount) || profile.ruleCount<2 || profile.ruleCount>1000 ||
    profile.width<=0 || profile.height<=0 || profile.scale<=0 || profile.ruleSpacing<=0 ||
    profile.firstRule<0 || profile.firstRule+(profile.ruleCount-1)*profile.ruleSpacing>=profile.height ||
    profile.threshold<=0 || profile.threshold>=255 || profile.ruleGray<0 || profile.ruleGray>1 ||
    profile.ruleWidth<=0 || profile.penWidth<Math.abs(profile.penVariation)) throw Error('Invalid paper or ink geometry');
  if(!Array.isArray(manifest.sources) || !manifest.sources.length) throw Error('Supply at least one source');
  const sheets=[[]];
  let slot=0;
  for(const [sourceIndex,source] of manifest.sources.entries()){
    const bitmap=loadBitmap(path.resolve(directory,source.file));
    const centers=source.centers;
    if(!Array.isArray(centers) || !centers.length || centers.some((v,i)=>!Number.isInteger(v)||v<0||v>=bitmap.height||(i&&v<=centers[i-1]))) throw Error('Row centers must increase within the image');
    const gaps=source.gapBefore||[];
    if(!Array.isArray(gaps)||gaps.some(v=>!Number.isInteger(v)||v<0||v>=centers.length)) throw Error('Invalid gapBefore row');
    const rows=traceRows(bitmap,centers,profile.threshold);
    for(const [rowIndex,row] of rows.entries()){
      if(!row.length) throw Error('No ink found in source '+sourceIndex+', row '+rowIndex);
      if(slot && gaps.includes(rowIndex)) slot++;
      if(slot>=profile.ruleCount-1){sheets.push([]);slot=0;}
      const baseline=profile.firstRule+(slot+1)*profile.ruleSpacing-profile.baselineOffset;
      sheets.at(-1).push(drawRow(row,sourceIndex,rowIndex,centers[rowIndex],baseline,profile));
      slot++;
    }
  }
  return makePdf(sheets,profile,date);
}
if(require.main===module){
  try{
    const [input,output]=process.argv.slice(2);
    if(!input||!output) throw Error('Usage: node scripts/render.cjs manifest.json output.pdf');
    const manifest=JSON.parse(fs.readFileSync(input,'utf8').replace(/^\uFEFF/,''));
    const pdf=render(manifest,path.dirname(path.resolve(input)));
    fs.writeFileSync(output,pdf,{flag:'wx'});
    console.log('Saved '+output);
  }catch(error){console.error(error.message);process.exitCode=1;}
}
module.exports={render};
