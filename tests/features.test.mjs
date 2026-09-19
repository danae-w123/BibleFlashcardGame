import test from 'node:test';
import assert from 'node:assert/strict';
import {newProfile,startRun,runBattle,beginBattle,runCombat,runEvent,runChoice} from '../run.mjs';
import {managePet,activePet,petState} from '../companions.mjs';
import {revealDiscovery,finishDiscovery,claimQuest,QUESTS,questReady} from '../discoveries.mjs';
import {SKILLS} from '../engine.mjs';
const profile=()=>({...newProfile('Feature test'),coins:500});
function battle(pet){let s=profile();if(pet!=='dove')s=managePet(s,pet,'unlock');s=managePet(s,pet,'equip');s=startRun(s);s.upgradePending=false;s=beginBattle(runBattle(s,'battle',()=>0));s.battle.hp=s.battle.max=500;s.battle.turn=3;s.path='wayfarer';s.health=50;return s;}
test('companions are permanent, singular, affordable and locked during runs',()=>{
 let s=profile();assert.equal(activePet(s),null);assert.equal(petState(s).levels.dove,1);s=managePet(s,'eagle','unlock');assert.equal(s.coins,420);assert.throws(()=>managePet(s,'eagle','unlock'));s=managePet(s,'eagle','equip');s=managePet(s,'eagle','upgrade');assert.equal(s.coins,380);assert.equal(activePet(s).level,2);const saved=JSON.parse(JSON.stringify(s));s=startRun(saved);assert.equal(activePet(s).id,'eagle');assert.throws(()=>managePet(s,'dove','equip'));assert.throws(()=>managePet({...profile(),coins:0},'lion','unlock'));
});
test('companion attacks, healing and shielding trigger on round three, before retaliation',()=>{
 let s=battle('dove'),n=runCombat(s,'strike',()=>.99);assert.equal(n.battle.lastTurn.companion.heal,6);assert.equal(n.health,56-n.battle.lastTurn.healthDamage);s.battle.turn=2;assert.equal(runCombat(s,'strike',()=>.99).battle.lastTurn.companion,undefined);
 s=battle('eagle');n=runCombat(s,'strike',()=>.99);assert.equal(n.battle.lastTurn.companion.damage,7);assert.equal(n.battle.lastTurn.damageDealt,23);
 s=battle('lion');n=runCombat(s,'strike',()=>.99);assert.equal(n.battle.lastTurn.companion.shield,8);assert.ok(n.battle.lastTurn.shieldBlocked>0);assert.ok(n.health>=s.health);
});
test('treasure results survive reloading and cannot be credited twice or rerolled',()=>{
 let s=startRun(profile());s.event='treasure';s.run.turn=4;s=revealDiscovery(s,()=>.99);assert.equal(s.tokens,50);assert.equal(s.run.discovery.die,6);s=JSON.parse(JSON.stringify(s));assert.deepEqual(revealDiscovery(s,()=>{throw Error('reroll');}),s);s=runEvent(s);assert.equal(s.tokens,50);assert.equal(s.event,null);assert.throws(()=>finishDiscovery(s));assert.throws(()=>revealDiscovery(s));
});
test('shrine choices persist and use normal eligibility and one-choice rules',()=>{
 let s=startRun(profile());s.event='blessing';s.run.turn=4;s=revealDiscovery(s,()=>.2);const choices=s.run.discovery.choices;assert.equal(choices.length,3);assert.equal(new Set(choices).size,3);assert.deepEqual(revealDiscovery(JSON.parse(JSON.stringify(s)),()=>.9).run.discovery.choices,choices);s=finishDiscovery(s);assert.equal(s.rewardReason,'shrine');s=runChoice(s,choices[0]);assert.equal(s.skills[choices[0]],1);assert.throws(()=>runChoice(s,choices[1]));
 s.event='blessing';s.skills=Object.fromEntries(SKILLS.map(x=>[x.id,x.max]));s=revealDiscovery(s);const lamps=s.lanterns;s=finishDiscovery(s);assert.equal(s.lanterns,lamps+1);assert.equal(s.upgradePending,false);
});
test('quest rewards require completed milestones and can only be claimed once',()=>{
 let s=profile();assert.throws(()=>claimQuest(s,'student'));s.career.runs=1;s=claimQuest(s,'first-run');assert.equal(s.coins,540);assert.equal(s.career.ore,2);s=JSON.parse(JSON.stringify(s));assert.throws(()=>claimQuest(s,'first-run'));assert.equal(questReady(s,QUESTS[0]),false);s.history=[{attempts:Array.from({length:10},()=>({correct:true}))}];s=claimQuest(s,'student');assert.equal(s.coins,600);assert.equal(s.career.chests,2);s=startRun(s);assert.throws(()=>claimQuest(s,'growing'));
});

