import test from 'node:test';
import assert from 'node:assert/strict';
import {newProfile,startRun,runChoice,planMove,arrive,runBattle as prepareBattle,beginBattle,runCombat,finishRunBattle,runAnswer,runEvent,campChoice,returnToLobby} from '../run.mjs';
import {makeChallenge} from '../engine.mjs';
import {readFileSync} from 'node:fs';
const runBattle=(s,kind)=>beginBattle(prepareBattle(s,kind));
const data=JSON.parse(readFileSync(new URL('../data.json',import.meta.url)));

test('complete finite run resolves every encounter and carries its permanent reward into the next attempt',()=>{
 let profile=newProfile('Integration');profile.career.level=20;profile.career.talents={might:10,vitality:10,resolve:10};
 let s=startRun(profile),steps=0,bosses=0;
 while(s.phase==='run'&&steps++<180){
  if(s.upgradePending){s=runChoice(s,s.skillChoices[0]);continue;}
  if(s.battle){
   let rounds=0;
   while(!s.battle.done&&rounds++<100)s=runCombat(s,s.battle.intent==='heavy'?'guard':s.run.charge>=100?'radiance':'strike',()=>.5);
   assert.ok(s.battle.done,'battle must terminate');if(s.battle.kind==='boss')bosses++;
   s=finishRunBattle(s);continue;
  }
  s=arrive(planMove(s,()=>.6));
  if(['battle','elite','boss'].includes(s.event)){const kind=s.event;s=runBattle(s,kind);}
  else if(s.event==='trial'){
   s={...s,event:null,pending:makeChallenge(data,s.stage,'quiz',s.seen),feedback:null};
   s=runAnswer(s,s.pending.answer);s={...s,pending:null,feedback:null};
  }else if(s.event==='camp')s=campChoice(s,'rest');
  else if(s.event==='market')s={...s,event:null,run:{...s.run,shop:null}};
  else s=runEvent(s);
 }
 assert.equal(s.phase,'results');assert.equal(s.run.payout.outcome,'victory');assert.equal(s.run.turn,30);assert.equal(bosses,1);assert.equal(s.history.length,1);assert.ok(s.armor.includes(0));assert.ok(s.coins>100);
 const gold=s.coins,attempts=s.history[0].attempts.length;s=startRun(returnToLobby(s));assert.equal(s.coins,gold);assert.equal(s.history[0].attempts.length,attempts);assert.equal(s.attempts.length,0);assert.equal(s.run.turn,0);assert.deepEqual(s.skills,{});
});
