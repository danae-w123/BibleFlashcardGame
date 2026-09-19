import test from 'node:test';
import assert from 'node:assert/strict';
import {MAPS,mapForState} from '../maps.mjs';
import {boardSize,movePath,landmarksForSize} from '../board.mjs';
import {newProfile,startRun,planMove,arrive,tileType,runBattle,beginBattle,runCombat,finishRunBattle} from '../run.mjs';
const chapter=i=>{const s=startRun({...newProfile('Map test'),unlocked:5},i);s.upgradePending=false;return s;};
test('six distinct chapter circuits use matching tile counts and safe coordinates',()=>{
 assert.deepEqual(MAPS.map(m=>m.path.length),[20,24,18,22,26,28]);
 for(let c=0;c<6;c++){const s=chapter(c),map=mapForState(s);assert.equal(map.path.length,boardSize(s));assert.equal(new Set(map.path.map(p=>p.join(','))).size,map.path.length);for(const [x,y] of map.path)assert.ok(x>=10&&x<=90&&y>=17&&y<=85);for(const [i,type] of Object.entries(landmarksForSize(boardSize(s))))assert.equal(tileType(s,+i),type);}
});
test('all chapter lengths wrap, refresh and resume saved movement without rerolling',()=>{
 for(let c=0;c<6;c++){let s=chapter(c);const size=boardSize(s);s.position=size-2;s=planMove(s,()=>.99);const path=movePath(s.run.move.from,s.run.move.steps,size);assert.equal(path.at(-1),s.run.move.to);assert.equal(s.run.move.board.length,size);const saved=JSON.parse(JSON.stringify(s));assert.deepEqual(planMove(saved,()=>{throw Error('reroll');}),saved);s=arrive(saved);assert.equal(s.position,10);assert.equal(s.run.lap,1);assert.equal(boardSize(s),size);}
});
test('new chapter checkpoint schedules and legacy saves keep their own rules',()=>{
 for(let c=0;c<6;c++){let s=chapter(c);const events=[];for(let n=0;n<30;n++){s=arrive(planMove({...s,event:null},()=>0));events.push(s.event);}assert.deepEqual(events.flatMap((x,i)=>x==='elite'?[i+1]:[]),c===0?[15]:[10,20]);assert.equal(events[29],'boss');}
 let s=chapter(4);delete s.run.layoutVersion;s.run.board=Array(20).fill('trial');s.position=19;s.run.turn=9;assert.equal(mapForState(s).path.length,20);s=arrive(planMove(s,()=>0));assert.equal(s.position,1);assert.equal(s.event,'elite');assert.equal(s.run.board.length,20);
});
test('final boss waits for Start Battle and victory settles only after defeat',()=>{
 let s=chapter(2);s.run.turn=29;s=arrive(planMove(s,()=>.5));assert.equal(s.event,'boss');s=runBattle(s,'boss');assert.equal(s.battle.started,false);assert.equal(s.battle.monsterId,'medusa');assert.throws(()=>runCombat(s,'strike'));s=beginBattle(s);s.battle.hp=1;s=runCombat(s,'strike',()=>.99);s=finishRunBattle(s);assert.equal(s.phase,'results');assert.equal(s.run.payout.outcome,'victory');
});
