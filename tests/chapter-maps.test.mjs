import test from 'node:test';
import assert from 'node:assert/strict';
import {MAPS,mapForState} from '../maps.mjs';
import {boardSize,movePath,landmarksForSize} from '../board.mjs';
import {newProfile,startRun,planMove,arrive,tileType,runBattle,beginBattle,runCombat,finishRunBattle} from '../run.mjs';
const chapter=i=>{const s=startRun({...newProfile('Map test'),unlocked:5},i);s.upgradePending=false;return s;};
test('six distinct chapter circuits use matching tile counts and safe coordinates',()=>{
 assert.deepEqual(MAPS.map(m=>m.path.length),[20,24,18,22,26,28]);
 for(let c=0;c<6;c++){const s=chapter(c),map=mapForState(s);assert.equal(map.path.length,boardSize(s));assert.equal(new Set(map.path.map(p=>p.join(','))).size,map.path.length);for(const [x,y] of map.path)assert.ok(x>=10&&x<=90&&y>=17&&y<=85);for(const [i,type] of Object.entries(landmarksForSize(boardSize(s))))assert.equal(s.run.board[+i],type);}
});
test('all chapter lengths wrap, refresh and resume saved movement without rerolling',()=>{
 for(let c=0;c<6;c++){let s=chapter(c);const size=boardSize(s);s.position=size-2;s.run.distance=size-2;s=planMove(s,()=>.99);const path=movePath(s.run.move.from,s.run.move.steps,size);assert.equal(path.at(-1),s.run.move.to);assert.equal(s.run.move.board.length,size);const saved=JSON.parse(JSON.stringify(s));assert.deepEqual(planMove(saved,()=>{throw Error('reroll');}),saved);s=arrive(saved);assert.equal(s.position,0);assert.equal(s.run.lap,1);assert.equal(boardSize(s),size);}
});
test('every chapter stops exactly after three laps, with a lap-two mini-boss',()=>{
 for(let c=0;c<6;c++){let s=chapter(c);const n=boardSize(s),events=[];while(s.run.distance<3*n){s=arrive(planMove({...s,event:null},()=>.99));events.push([s.run.distance,s.event]);}assert.deepEqual(events.filter(x=>x[1]==='elite'),[[2*n,'elite']]);assert.deepEqual(events.filter(x=>x[1]==='boss'),[[3*n,'boss']]);assert.equal(s.position,0);assert.equal(s.run.lap,3);assert.ok(events.filter(x=>x[1]==='trial').length>=4);assert.throws(()=>planMove({...s,event:null}));}
 let s=chapter(4);delete s.run.lapLimit;delete s.run.layoutVersion;s.run.total=30;s.run.board=Array(20).fill('trial');s.position=19;s.run.turn=9;assert.equal(mapForState(s).path.length,20);s=arrive(planMove(s,()=>0));assert.equal(s.position,1);assert.equal(s.event,'elite');
});
test('final boss waits for Start Battle and victory settles only after defeat',()=>{
 let s=chapter(2);s.run.distance=boardSize(s)*3-1;s.run.lap=2;s.position=boardSize(s)-1;s=arrive(planMove(s,()=>.5));assert.equal(s.event,'boss');s=runBattle(s,'boss');assert.equal(s.battle.started,false);assert.equal(s.battle.monsterId,'medusa');assert.throws(()=>runCombat(s,'strike'));s=beginBattle(s);s.battle.hp=1;s=runCombat(s,'strike',()=>.99);s=finishRunBattle(s);assert.equal(s.phase,'results');assert.equal(s.run.payout.outcome,'victory');
});
