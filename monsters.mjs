// Original mythological creature roster, ordered to match the 6 by 4 atlas.
export const MONSTERS=[
 {
  "id": "python",
  "name": "Python",
  "cell": 0,
  "variant": 0
 },
 {
  "id": "harpy",
  "name": "Harpy",
  "cell": 1,
  "variant": 2
 },
 {
  "id": "minotaur",
  "name": "Minotaur",
  "cell": 2,
  "variant": 1
 },
 {
  "id": "echidna",
  "name": "Echidna",
  "cell": 3,
  "variant": 0
 },
 {
  "id": "chimera",
  "name": "Chimera",
  "cell": 4,
  "variant": 2
 },
 {
  "id": "fury",
  "name": "Fury",
  "cell": 5,
  "variant": 2
 },
 {
  "id": "giant",
  "name": "Giant",
  "cell": 6,
  "variant": 1
 },
 {
  "id": "empousa",
  "name": "Empousa",
  "cell": 7,
  "variant": 2
 },
 {
  "id": "blemmyae",
  "name": "Blemmyae",
  "cell": 8,
  "variant": 1
 },
 {
  "id": "stymphalian-bird",
  "name": "Stymphalian Bird",
  "cell": 9,
  "variant": 1
 },
 {
  "id": "laestrygonian-giant",
  "name": "Laestrygonian Giant",
  "cell": 10,
  "variant": 2
 },
 {
  "id": "cyclops",
  "name": "Cyclops",
  "cell": 11,
  "variant": 1
 },
 {
  "id": "dracaena",
  "name": "Dracaena",
  "cell": 12,
  "variant": 1
 },
 {
  "id": "hellhound",
  "name": "Hellhound",
  "cell": 13,
  "variant": 2
 },
 {
  "id": "myrmekes",
  "name": "Myrmekes",
  "cell": 14,
  "variant": 1
 },
 {
  "id": "karpoi",
  "name": "Karpoi",
  "cell": 15,
  "variant": 0
 },
 {
  "id": "nosoi",
  "name": "Nosoi",
  "cell": 16,
  "variant": 0
 },
 {
  "id": "medusa",
  "name": "Medusa",
  "cell": 17,
  "variant": 1
 },
 {
  "id": "euryale",
  "name": "Euryale",
  "cell": 18,
  "variant": 2
 },
 {
  "id": "stheno",
  "name": "Stheno",
  "cell": 19,
  "variant": 1
 },
 {
  "id": "nemean-lion",
  "name": "Nemean Lion",
  "cell": 20,
  "variant": 1
 },
 {
  "id": "hydra",
  "name": "Hydra",
  "cell": 21,
  "variant": 0
 },
 {
  "id": "scylla",
  "name": "Scylla",
  "cell": 22,
  "variant": 2
 },
 {
  "id": "charybdis",
  "name": "Charybdis",
  "cell": 23,
  "variant": 0
 }
];
const BOSSES=['python','chimera','medusa','hydra','scylla','charybdis'];
export function monsterInfo(id){return MONSTERS.find(m=>m.id===id)||MONSTERS[0];}
export function selectMonster(s,kind,rng=Math.random){
 if(kind==='boss')return {monster:monsterInfo(BOSSES[s.stage]),seen:s.run.monstersSeen||[]};
 const seen=s.run.monstersSeen||[];
 let pool=MONSTERS.filter(m=>!seen.includes(m.id));
 const cycle=pool.length?seen:[];
 if(!pool.length)pool=MONSTERS.filter(m=>m.id!==seen.at(-1));
 const monster=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
 return {monster,seen:[...cycle,monster.id]};
}
