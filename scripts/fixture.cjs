#!/usr/bin/env node
// Draw a public test card from geometric primitives, without handwriting samples.
const fs=require('node:fs');
const path=require('node:path');
const width=320,height=112,stride=3*width;
const image=Buffer.alloc(54+stride*height,255);
image.fill(0,0,54);
image.write('BM');image.writeUInt32LE(image.length,2);image.writeUInt32LE(54,10);
image.writeUInt32LE(40,14);image.writeInt32LE(width,18);image.writeInt32LE(height,22);
image.writeUInt16LE(1,26);image.writeUInt16LE(24,28);
function dot(x,y,gray){
  const p=54+(height-1-y)*stride+3*x;
  image.fill(gray,p,p+3);
}
function stroke(x1,y1,x2,y2,radius=1.25,gray=12){
  const dx=x2-x1,dy=y2-y1,len=dx*dx+dy*dy;
  for(let y=Math.max(0,Math.floor(Math.min(y1,y2)-radius));y<=Math.min(height-1,Math.ceil(Math.max(y1,y2)+radius));y++){
    for(let x=Math.max(0,Math.floor(Math.min(x1,x2)-radius));x<=Math.min(width-1,Math.ceil(Math.max(x1,x2)+radius));x++){
      const t=Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/len));
      if(Math.hypot(x-x1-t*dx,y-y1-t*dy)<=radius)dot(x,y,gray);
    }
  }
}
for(const y of [10,48,94])stroke(0,y,width-1,y,0.65,210);
// 1 + 1 = 2
for(const x of [24,62]){stroke(x-4,27,x,23);stroke(x,23,x,37);}
stroke(37,30,50,30);stroke(44,24,44,36);
stroke(77,28,88,28);stroke(77,33,88,33);
stroke(99,25,106,23);stroke(106,23,110,27);stroke(110,27,99,37);stroke(99,37,111,37);
// sqrt(4) = 2
stroke(19,73,23,71);stroke(23,71,27,80);stroke(27,80,33,60);stroke(33,60,62,60);
stroke(50,64,42,73);stroke(42,73,55,73);stroke(52,64,52,80);
stroke(73,69,86,69);stroke(73,75,86,75);
stroke(96,67,103,65);stroke(103,65,107,69);stroke(107,69,96,79);stroke(96,79,108,79);
fs.writeFileSync(path.join(__dirname,'../assets/example.bmp'),image);
