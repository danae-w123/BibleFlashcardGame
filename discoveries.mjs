import {career} from './progression.mjs';
import {drawSkillChoices,skillLevel,SKILLS} from './engine.mjs';
const right=s=>(s.history||[]).reduce((sum,r)=>sum+(r.attempts||[]).filter(a=>a.correct).length,0);
export const QUESTS=[
 {id:'first-run',name:'First expedition',desc:'Complete one run, win or lose.',target:1,value:s=>career(s).runs,gold:40,ore:2,chests:0},
 {id:'student',name:'Keep the Word',desc:'Answer 10 Bible trials correctly across completed runs.',target:10,value:right,gold:60,ore:3,chests:1},
 {id:'growing',name:'Growing stronger',desc:'Reach hero level 3.',target:3,value:s=>career(s).level,gold:60,ore:4,chests:1},
 {id:'armor',name:'Stand firm',desc:'Earn your first Armor of God milestone.',target:1,value:s=>s.armor.length,gold:100,ore:5,chests:1},
 {id:'explorer',name:'Return with courage',desc:'Complete five expeditions.',target:5,value:s=>career(s).runs,gold:100,ore:5,chests:2},
 {id:'scholar',name:'A light to the path',desc:'Answer 30 Bible trials correctly across completed runs.',target:30,value:right,gold:150,ore:8,chests:2}
];
export const questReady=(s,q)=>q.value(s)>=q.target&&!(career(s).questClaims||[]).includes(q.id);
export function claimQuest(s,id){
 if(s.phase!=='lobby')throw Error('Claim permanent rewards in the lobby.');const q=QUESTS.find(q=>q.id===id);if(!q||!questReady(s,q))throw Error('This reward is not ready.');
 const c=structuredClone(career(s));c.questClaims=[...(c.questClaims||[]),id];c.ore+=q.ore;c.chests+=q.chests;return {...s,coins:s.coins+q.gold,career:c};
}
export function revealDiscovery(s,rng=Math.random){
 if(s.phase!=='run'||!['treasure','blessing'].includes(s.event))throw Error('Visit a discovery tile first.');
 if(s.run.discovery?.turn===s.run.turn&&s.run.discovery.kind===s.event)return s;
 const base={turn:s.run.turn,kind:s.event};
 if(s.event==='treasure'){const die=Math.min(6,Math.max(1,Math.floor(rng()*6)+1)),tokens=20+die*5;return {...s,tokens:s.tokens+tokens,run:{...s.run,discovery:{...base,die,tokens}}};}
 const choices=drawSkillChoices(s,rng).filter(id=>SKILLS.some(sk=>sk.id===id&&skillLevel(s,id)<sk.max));
 return {...s,run:{...s.run,discovery:{...base,choices}}};
}
export function finishDiscovery(s){
 const d=s.run?.discovery;if(!d||d.turn!==s.run.turn||d.kind!==s.event)throw Error('Reveal the discovery first.');
 const next={...s,event:null,run:{...s.run,discovery:null}};
 if(d.kind==='blessing'&&d.choices.length)return {...next,upgradePending:true,rewardReason:'shrine',skillChoices:d.choices};
 if(d.kind==='blessing')next.lanterns++;return next;
}
