export const BOARD_SIZE=20;
export const CORNERS={0:'camp',5:'market',10:'treasure',15:'blessing'};
export function boardForLap(id,lap=0){
 let seed=2166136261;for(const c of `${id}:${lap}`)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const deck=['battle','trial','battle','storm','trial','battle','trial','battle','trial','storm','battle','trial','battle','trial','battle','trial'];
 for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
 return Array.from({length:BOARD_SIZE},(_,i)=>CORNERS[i]||deck.shift());
}
export function rollDice(rng=Math.random){return Array.from({length:2},()=>Math.min(6,Math.max(1,1+Math.floor(rng()*6))));}
export const movePath=(from,steps)=>Array.from({length:steps},(_,i)=>(from+i+1)%BOARD_SIZE);
