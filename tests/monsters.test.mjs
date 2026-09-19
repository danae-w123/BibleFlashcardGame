import test from 'node:test';
import assert from 'node:assert/strict';
import {MONSTERS,selectMonster} from '../monsters.mjs';
import {newProfile,startRun,runBattle} from '../run.mjs';
test('all 24 creatures have distinct atlas cells and encounters do not repeat within a cycle',()=>{let s=startRun(newProfile('Test'));const ids=[];for(let i=0;i<24;i++){s=runBattle(s,'battle',()=>0);ids.push(s.battle.monsterId);s.battle=null;}assert.equal(new Set(ids).size,24);assert.equal(new Set(MONSTERS.map(m=>m.cell)).size,24);const next=selectMonster(s,'battle',()=>.999);assert.notEqual(next.monster.id,ids.at(-1));});
test('chapter bosses are distinct and saved enemy identity and rotation survive reload',()=>{const s=startRun(newProfile('Test'));const bosses=Array.from({length:6},(_,stage)=>runBattle({...s,stage},'boss').battle.monsterId);assert.equal(new Set(bosses).size,6);const b=runBattle(s,'elite',()=>.5);const restored=JSON.parse(JSON.stringify(b));assert.equal(restored.battle.monsterId,b.battle.monsterId);assert.deepEqual(restored.run.monstersSeen,b.run.monstersSeen);assert.match(b.battle.name,/^Elite /);assert.equal(b.battle.started,false);});
