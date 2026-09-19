import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,startBattle,combatTurn,maxHealth,SKILLS} from '../engine.mjs';
import {newProfile,startRun,enterShop,buyRunOffer,refreshShop} from '../run.mjs';
test('life steal uses actual HP damage, excludes absorbed damage and caps healing',()=>{
 let s=startBattle(freshState());s.health=50;s.skills={leech:3};s.battle.enemyShield=100;
 let n=combatTurn(s,'strike',()=>.99);assert.equal(n.battle.lastTurn.lifeStolen,0);
 s.battle.enemyShield=10;n=combatTurn(s,'strike',()=>.99);assert.equal(n.battle.lastTurn.damageDealt,6);assert.equal(n.battle.lastTurn.lifeStolen,3);
 s.health=maxHealth(s)-1;s.battle.enemyShield=0;n=combatTurn(s,'strike',()=>.99);assert.equal(n.battle.lastTurn.lifeStolen,1);
 s.health=50;s.battle.hp=1;n=combatTurn(s,'strike',()=>.99);assert.equal(n.battle.lastTurn.lifeStolen,1);assert.equal(n.battle.lastTurn.healthDamage,0);
});
test('aegis grants shield before counterattack and leftover shield absorbs later damage',()=>{
 let s=startBattle(freshState());s.battle.hp=s.battle.max=500;s.skills={aegis:2};
 let n=combatTurn(s,'radiance',()=>.99);assert.equal(n.battle.lastTurn.shieldGained,24);assert.equal(n.battle.lastTurn.shieldBlocked,8);assert.equal(n.health,s.health);assert.equal(n.battle.shield,16);
 n=combatTurn(n,'strike',()=>.99);assert.equal(n.battle.shield,8);assert.equal(n.battle.lastTurn.shieldGained,0);assert.equal(n.health,s.health);
 n.battle=null;n=startBattle(n);assert.equal(n.battle.shield||0,0);
});
test('shop provides three unique eligible skills and saved stock does not reroll',()=>{
 let s=startRun(newProfile('Shop test'));s.upgradePending=false;s.tokens=200;s=enterShop(s,()=>.5);
 assert.equal(s.run.shop.offers.length,6);assert.equal(new Set(s.run.shop.offers.slice(3).map(x=>x.id)).size,3);
 const saved=JSON.parse(JSON.stringify(s));assert.deepEqual(enterShop(saved,()=>0).run.shop,s.run.shop);
 const gold=s.coins;s=buyRunOffer(s,3);assert.equal(s.coins,gold);assert.equal(s.tokens,160);assert.throws(()=>buyRunOffer(s,3));
 s=refreshShop(s,()=>.2);assert.equal(s.tokens,150);assert.equal(s.run.shop.refreshes,1);assert.deepEqual(s.run.shop.bought,[]);
 s.skills=Object.fromEntries(SKILLS.map(x=>[x.id,x.max]));s=refreshShop(s,()=>.2);assert.equal(s.run.shop.offers.length,3);
});
