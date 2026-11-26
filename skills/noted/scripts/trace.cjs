// Marching squares with interpolated crossings. Assign complete outlines to rows.
const format = value => Number(value.toFixed(3));
function traceRows({width:w,height,ink:gray},centers,level) {
 const borders=centers.slice(1).map((c,j)=>{const prev=centers[j];let best=Infinity,bound=0;for(let y=Math.floor(prev+.25*(c-prev));y<=Math.ceil(prev+.75*(c-prev));y++){
 let count=0;for(let x=0;x<w;x++)count+=Math.max(0,gray[y*w+x]-50);const score=count+Math.abs(y-(prev+c)/2)*.3;if(score<best){best=score;bound=y;}}
 return bound;});
 const rows=centers.map(()=>[]),adj=new Map(),points=new Map();
 function link(a,b){if(!adj.has(a))adj.set(a,[]);if(!adj.has(b))adj.set(b,[]);adj.get(a).push(b);adj.get(b).push(a);}
 for(let y=0;y<height-1;y++)for(let x=0;x<w-1;x++){
 let i=y*w+x,vs=[gray[i],gray[i+1],gray[i+1+w],gray[i+w]],ids=[2*i,2*(i+1)+1,2*(i+w),2*i+1],cross=[];
 for(let e=0;e<4;e++){let a=vs[e],b=vs[(e+1)%4];if((a>level)===(b>level))continue;
 const t=(level-a)/(b-a),u=[t,1,1-t,0][e],v=[0,t,1,1-t][e];cross.push(ids[e]);points.set(ids[e],[x+u,y+v]);}
 if(cross.length===2)link(...cross);else if(cross.length===4){if((vs.reduce((a,b)=>a+b)/4>level)===(vs[0]>level)){link(cross[0],cross[1]);link(cross[2],cross[3]);}else{link(cross[0],cross[3]);link(cross[1],cross[2]);}}
 }
 const seen=new Set();
 for(const start of adj.keys()){
 if(seen.has(start))continue;let pts=[],at=start,prev=-1;
 while(!seen.has(at)){if(!adj.has(at)||adj.get(at).length!==2)throw Error('Ink touches an image edge; pad the source image with white space');seen.add(at);pts.push(points.get(at));let next=adj.get(at).find(n=>n!==prev);prev=at;at=next;}
 if(pts.length<4)continue;
 let area=0,min=Infinity,max=-Infinity;
 for(let i=0;i<pts.length;i++){let [x,y]=pts[i],[xx,yy]=pts[(i+1)%pts.length];area+=x*yy-y*xx;min=Math.min(min,y);max=Math.max(max,y);}
 if(Math.abs(area)<.45)continue;
 let row=borders.findIndex(v=>(min+max)/2<v);if(row<0)row=rows.length-1;
 rows[row].push(pts);
 }

 return rows;
}
// Keep expression geometry together while smoothing long fraction and radical bars.
function drawRow(contours,k,j,baseline,dst,profile) {
 const cmds=[];
 const phase=(k+1)*11.46+j*3.72;
 const rowScale=profile.scale*(1+.035*Math.sin(phase));
 let bar=null;
 function pos(p){
  const x=p[0],y=p[1]-baseline;
  const lean=.105*Math.sin(x*.109+phase)+.045*Math.sin(x*.037-phase);
  const dx=1.65*Math.sin(x*.057+phase)+.48*Math.sin(x*.19-phase)+lean*y;
  const dy=1.05*Math.sin(x*.082+phase)+.46*Math.sin(x*.23-phase)+.85*Math.sin(x*.018+phase);
  const height=1+.082*Math.sin(x*.115-phase);
  let inkY=y*height+dy;
  if(bar){
   const t=Math.max(0,Math.min(1,(x-bar.start)/3));
   inkY=(1-t)*inkY+t*(y+bar.offset-bar.bend(x));
  }
  const pageX=(x+dx)*rowScale+2.5*Math.sin(phase);
  const pageY=profile.height-(dst+inkY*rowScale);
  if(pageX<0 || pageX>profile.width || pageY<0 || pageY>profile.height){
    throw Error('Ink extends beyond the page in source '+k+', row '+j+'; adjust scale or input margins');
  }
  return format(pageX)+' '+format(pageY);
 }
 for(const pts of contours){
 const xs=pts.map(p=>p[0]),left=Math.min(...xs),right=Math.max(...xs),width=right-left;
 bar=null;
 if(width>=7){
  const slices=Array.from({length:Math.ceil(width)+1},()=>[]);
  for(const [x,y] of pts)slices[Math.round(x-left)].push(y);
  for(const start of [1,Math.max(4,Math.floor(width*.27))]){
   const section=slices.slice(start,-1);
   if(section.length<5||section.some(v=>!v.length||Math.max(...v)-Math.min(...v)>3.1))continue;
   const center=section.map(v=>(Math.min(...v)+Math.max(...v))/2);
   const slope=(center.at(-1)-center[0])/(center.length-1);
   if(Math.abs(slope)>.19||center.some((v,i)=>Math.abs(v-center[0]-i*slope)>2.4))continue;
   const midX=(left+right)/2,y=center[Math.floor(center.length/2)]-baseline;
   const offset=y*.082*Math.sin(midX*.115-phase)+1.05*Math.sin(midX*.082+phase)+.46*Math.sin(midX*.23-phase)+.85*Math.sin(midX*.018+phase);
   bar={start:left-3,offset,bend(x){
    const i=Math.max(0,Math.min(center.length-1,x-left-start)),a=Math.floor(i),b=Math.ceil(i);
    return .85*(center[a]+(center[b]-center[a])*(i-a)-center[0]-i*slope);
   }};break;
  }
 }
 const n=pts.length,mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];let a=mid(pts[n-1],pts[0]);cmds.push(pos(a)+' m');
 for(let i=0;i<n;i++){let b=pts[i],c=mid(b,pts[(i+1)%n]);const blend=(a,b)=>[.26*a[0]+.74*b[0],.26*a[1]+.74*b[1]];cmds.push(pos(blend(a,b))+' '+pos(blend(c,b))+' '+pos(c)+' c');a=c;}cmds.push('h');}
 const penWidth=profile.penWidth+profile.penVariation*Math.sin(phase);
 return '0.025 G 0.025 g 1 j 1 J '+format(penWidth)+' w\n'+cmds.join('\n')+'\nB*';
 }
module.exports={traceRows,drawRow};
