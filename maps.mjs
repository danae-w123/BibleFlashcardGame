// Equal-distance samples keep movement legible around differently shaped circuits.
function circuit(vertices,count){
 const lengths=vertices.map((a,i)=>Math.hypot(a[0]-vertices[(i+1)%vertices.length][0],a[1]-vertices[(i+1)%vertices.length][1]));
 const total=lengths.reduce((a,b)=>a+b,0);
 return Array.from({length:count},(_,i)=>{let d=i*total/count,j=0;while(j<lengths.length-1&&d>=lengths[j])d-=lengths[j++];const a=vertices[j],b=vertices[(j+1)%vertices.length],t=d/lengths[j];return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];});
}
const definitions=[
 ['Dawn Coast','Coastal diamond',20,[[50,85],[10,51],[50,17],[90,51]]],
 ['Cana Vineyards','Vineyard terraces',24,[[20,83],[12,70],[12,29],[25,19],[78,19],[89,31],[89,72],[76,83]]],
 ['Starlit Highlands','Highland hexagon',18,[[50,85],[13,68],[13,34],[50,17],[87,34],[87,68]]],
 ['Oasis of Living Water','Oasis ring',22,Array.from({length:44},(_,i)=>{const a=Math.PI/2+i*Math.PI/22;return[50+40*Math.cos(a),51+34*Math.sin(a)];})],
 ['Ember Watchtower','Citadel battlements',26,[[32,85],[12,70],[12,32],[29,18],[50,28],[71,18],[88,32],[88,70],[68,85],[50,74]]],
 ['Frostbound Summit','Summit crown',28,[[50,85],[12,70],[17,46],[10,30],[29,17],[50,28],[71,17],[90,30],[83,46],[88,70]]]
];
export const MAPS=definitions.map(([name,shape,count,vertices],i)=>({name,shape,art:`maps/chapter-${i+1}.svg`,path:circuit(vertices,count)}));
export function mapForState(s){const map=MAPS[s.stage];if(s.run?.layoutVersion===2)return map;const corners=[[50,83],[12+s.stage%2*3,51],[50,19],[88-s.stage%2*3,51]];return {...map,shape:'Classic circuit',path:Array.from({length:20},(_,i)=>{const a=corners[Math.floor(i/5)],b=corners[(Math.floor(i/5)+1)%4],t=i%5/5;return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];})};}
