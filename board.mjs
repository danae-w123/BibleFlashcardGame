export const BOARD_SIZE=20;
export const CORNERS={0:'camp',5:'market',10:'treasure',15:'blessing'};
export const landmarksForSize=size=>({0:'camp',[Math.floor(size/4)]:'market',[Math.floor(size/2)]:'treasure',[Math.floor(size*3/4)]:'blessing'});
export const boardSize=s=>s.run?.board?.length||BOARD_SIZE;
export const eliteTurns=s=>s.run?.layoutVersion===2&&s.stage===0?[15]:[10,20];
export function boardForLap(id,lap=0,size=BOARD_SIZE){
 let seed=2166136261;for(const c of `${id}:${lap}`)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const deck=['battle','trial','battle','storm','trial','battle','trial','battle','trial','storm','battle','trial','battle','trial','battle','trial'];
 for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
 const corners=landmarksForSize(size);let cursor=0;return Array.from({length:size},(_,i)=>corners[i]||deck[cursor++%deck.length]).map((kind,i)=>lap>0&&kind==='battle'&&i%2===0?'pack':kind);
}
export function rollDice(rng=Math.random){return Array.from({length:2},()=>Math.min(6,Math.max(1,1+Math.floor(rng()*6))));}
export const movePath=(from,steps,size=BOARD_SIZE)=>Array.from({length:steps},(_,i)=>(from+i+1)%size);
