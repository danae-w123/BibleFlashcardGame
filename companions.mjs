import {career} from './progression.mjs';
export const COMPANIONS=[
 {id:'dove',name:'Dawn Dove',cell:0,cost:0,role:'Healing',desc:l=>`Every third round: restore ${4+l*2} HP before the enemy attacks.`},
 {id:'eagle',name:'Storm Eagle',cell:1,cost:80,role:'Attack',desc:l=>`Every third round: add ${4+l*3} damage to your attack.`},
 {id:'lion',name:'Brave Lion',cell:2,cost:120,role:'Protection',desc:l=>`Every third round: gain ${5+l*3} shield HP before the enemy attacks.`}
];
export const petState=s=>({selected:null,levels:{dove:1},...career(s).pets});
export const petInfo=id=>COMPANIONS.find(p=>p.id===id);
export function activePet(s){const p=petState(s),spec=petInfo(p.selected),level=p.levels[p.selected]||0;return spec&&level?{...spec,level}:null;}
export const petUpgradeCost=(s,id)=>40*(petState(s).levels[id]||1);
export function managePet(s,id,action){
 if(s.phase!=='lobby')throw Error('Prepare companions in the lobby.');
 const spec=petInfo(id);if(!spec)throw Error('Unknown companion.');
 const c=structuredClone(career(s)),p=structuredClone(petState(s));let cost=0;
 if(action==='unlock'){if(p.levels[id])throw Error('Companion already recruited.');cost=spec.cost;p.levels[id]=1;}
 else if(action==='equip'){if(!p.levels[id])throw Error('Recruit this companion first.');p.selected=id;}
 else if(action==='upgrade'){if(!p.levels[id]||p.levels[id]>=5)throw Error('Companion cannot be upgraded.');cost=petUpgradeCost(s,id);p.levels[id]++;}
 else throw Error('Unknown companion action.');
 if(s.coins<cost)throw Error('Earn more gold from a run.');c.pets=p;return {...s,coins:s.coins-cost,career:c};
}
