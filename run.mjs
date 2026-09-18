import {freshState,STAGES,TILE_TYPES,startBattle as oldStart,combatTurn as oldTurn,recordAnswer as oldAnswer,chooseUpgrade as oldChoose,resolveEvent as oldEvent,drawSkillChoices,maxHealth,maxFocus,skillLevel,summary,SKILLS} from './engine.mjs';
import {career,grantGrowth,awardItem,SLOTS,gearStats,weaponAbility} from './progression.mjs';

export const PATHS=[
 {id:'guardian',name:'Guardian',icon:'shield',desc:'Every third round: gain a shield that absorbs 8 damage. Level 5: counter for 6 damage.'},
 {id:'wayfarer',name:'Wayfarer',icon:'heart-pulse',desc:'After victory: recover 8 extra HP. Level 5: gain 5 extra shop tokens.'},
 {id:'arcanist',name:'Lightweaver',icon:'sparkles',desc:'Every third round: gain 20 ultimate charge. Level 5: ultimate attacks deal 8 extra damage.'}
];
export function migrate(s){
 if(s.schema===2)return s;
 return {...s,schema:2,phase:'lobby',path:'guardian',unlocked:Math.min(5,s.complete?5:s.stage||0),history:[],run:null,tokens:0,pending:null,feedback:null,event:null,battle:null,upgradePending:false,skills:{},skillChoices:[],complete:false,ended:false};
}
export const newProfile=(...args)=>migrate(freshState(...args));
export function startRun(s,chapter=s.stage){
 if(s.phase==='run')throw Error('Finish this run first.');
 if(!Number.isInteger(chapter)||chapter<0||chapter>s.unlocked||chapter>=STAGES.length)throw Error('Chapter is locked.');
 const next={...freshState(s.name,s.alias,s.mode,s.character),schema:2,phase:'run',path:s.path||'guardian',career:structuredClone(career(s)),coins:s.coins,unlocked:s.unlocked,history:s.history||[],armor:[...s.armor],stage:chapter,tokens:0,
 run:{id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,turn:0,total:30,move:null,paused:false,settled:false,xp:0,ore:0,chests:0,charge:50,stats:{attack:0,hp:0,defense:0},shop:null,revived:false},upgradePending:true,rewardReason:'start'};
 next.health=maxHealth(next);next.focus=maxFocus(next);next.skillChoices=drawSkillChoices(next);return next;
}
export function planMove(s,rng=Math.random){
 if(s.phase!=='run'||s.run.settled||s.pending||s.event||s.upgradePending||s.battle)throw Error('Resolve the current encounter first.');
 if(s.run.move)return s;
 if(s.run.turn>=s.run.total)throw Error('The final encounter must be resolved before another run.');
 const turn=s.run.turn+1,steps=1+Math.floor(rng()*6),to=(s.position+steps)%TILE_TYPES.length;
 // Guaranteed scripture and elite checkpoints keep every finite run varied.
 const kind=turn===30?'boss':turn%10===0?'elite':turn%5===0?'market':turn%3===0?'trial':TILE_TYPES[to];
 return {...s,lastRoll:steps,run:{...s.run,turn,currentKind:null,move:{from:s.position,to,steps,kind}}};
}
export function arrive(s){if(!s.run?.move)throw Error('No planned movement.');return {...s,position:s.run.move.to,event:s.run.move.kind,run:{...s.run,currentKind:s.run.move.kind,move:null}};}
export const tileType=(s,i)=>s.position===i&&s.run?.currentKind?s.run.currentKind:TILE_TYPES[i];
function temporary(s,action){const next=action({...s,coins:s.tokens});return {...next,coins:s.coins,tokens:next.coins,career:s.career};}
export function runAnswer(s,input){let next=temporary(s,x=>oldAnswer(x,input));const right=next.feedback.correct;return {...next,run:{...s.run,charge:Math.min(100,(s.run.charge||0)+(right?10:0)),xp:s.run.xp+(right?30:5),ore:s.run.ore+(right?2:0),chests:s.run.chests+(right&&summary(next).right%3===0?1:0)}};}
export function runChoice(s,id){const next=temporary(s,x=>oldChoose(x,id));return id==='focus'?{...next,run:{...next.run,charge:Math.min(100,(next.run.charge||0)+20)}}:next;}
export function runEvent(s){const next=temporary(s,oldEvent);return s.event==='camp'?{...next,run:{...next.run,charge:Math.min(100,(next.run.charge||0)+25)}}:next;}
export function campChoice(s,choice,rng=Math.random){
 if(s.event!=='camp'||!['rest','train'].includes(choice))throw Error('Choose rest or training at a camp.');
 if(choice==='rest')return runEvent(s);
 const pool=SKILLS.filter(sk=>skillLevel(s,sk.id)>0&&skillLevel(s,sk.id)<sk.max).map(sk=>sk.id),picks=[];
 while(pool.length&&picks.length<3)picks.push(pool.splice(Math.floor(rng()*pool.length),1)[0]);
 if(picks.length)return {...s,event:null,upgradePending:true,rewardReason:'camp',skillChoices:picks};
 return {...s,event:null,run:{...s.run,stats:{...s.run.stats,attack:s.run.stats.attack+3}}};
}
export function runBattle(s,kind='battle'){
 const next=oldStart({...s,career:{...career(s),runs:0}});next.career=s.career;
 const elite=kind==='elite',boss=kind==='boss',scale=1+s.run.turn*.028;
 const max=Math.round((52+s.stage*24)*scale*(boss?3:elite?1.6:1));
 const variant=(s.stage+s.battlesWon+s.battlesLost)%3;
 const traits=['Regenerates 6 HP every fourth round. Burn halves this healing.','Starts with a 12 HP stone shield.','Below half health, attacks deal 4 extra damage.'];
 next.battle={...next.battle,kind,variant,trait:traits[variant],enemyShield:variant===1?12:0,name:boss?['Gatekeeper of the Dawn','Cana Stonewarden','Nightshade Colossus','Keeper of the Well','Watchtower Warden','Tempest Sovereign'][s.stage]:elite?'Elite '+next.battle.name:next.battle.name,hp:max,max,shield:0};
 return next;
}
export function runCombat(s,action,rng=Math.random){
 if(action==='radiance'&&(s.run.charge||0)<100)throw Error('Your ultimate is still charging.');
 let prepared={...s,career:{...career(s),runs:0}};
 const level=career(s).level,round=s.battle.turn;
 if(action==='radiance')prepared.focus=Math.max(1,s.focus);
 const next=temporary(prepared,x=>oldTurn(x,action,rng));next.career=s.career;
 const weapon=weaponAbility(career(s).equipped.sword),g=gearStats(s),gain=(action==='guard'?20:25)+skillLevel(s,'focus')*5+g.focus*5;
 next.run={...next.run,charge:Math.min(100,(action==='radiance'?weapon.refund:(s.run.charge||0)+gain)+(s.path==='arcanist'&&round%3===0?20:0)+(g.focusRegen&&round%3===0?10:0))};
 if(s.path==='guardian'&&round%3===0&&level>=5&&next.health>0&&next.battle.outcome!=='won'){next.battle.hp=Math.max(0,next.battle.hp-6);next.battle.effects.push('Guardian counter +6');}
 if(next.battle.hp===0&&next.health>0&&next.battle.outcome!=='won'){next.battle.done=true;next.battle.outcome='won';next.battlesWon++;next.tokens+=20+skillLevel(s,'bounty')*5;next.health=Math.min(maxHealth(next),next.health+12+skillLevel(s,'secondWind')*8);}
 if(next.health===0&&skillLevel(s,'revive')&&!s.run.revived){next.health=Math.ceil(maxHealth(s)*.4);next.run={...next.run,revived:true};next.battle.done=false;next.battle.outcome=null;next.battlesLost=s.battlesLost;next.tokens=s.tokens;next.battle.log='Last Light revives your hero. This rescue can only happen once per run.';next.battle.effects.push('Last Light: revived once');}
 if(next.battle.outcome==='won'&&s.path==='wayfarer'){next.health=Math.min(maxHealth(next),next.health+8);if(level>=5)next.tokens+=5;}
 if(next.battle.outcome==='lost')next.battle.log='Your hero has fallen. This run is over. Your earned rewards and Bible results are kept.';
 return next;
}
export function finishRunBattle(s){
 if(!s.battle?.done)throw Error('Battle is still running.');
 if(s.battle.outcome==='lost')return settleRun(s,'defeat');
 const next={...s,battle:null,run:{...s.run,xp:s.run.xp+25,ore:s.run.ore+3,chests:s.run.chests+1},upgradePending:true,rewardReason:'battle',skillChoices:drawSkillChoices(s)};
 if(s.battle.kind==='boss')return settleRun({...next,battle:s.battle},'victory');
 return next;
}
export function settleRun(s,outcome){
 if(s.run?.settled)return s;
 if(s.phase!=='run'||!['victory','defeat','retired'].includes(outcome))throw Error('No active run to settle.');
 if(outcome==='victory'&&!(s.battle?.kind==='boss'&&s.battle?.outcome==='won'))throw Error('Defeat the final boss first.');
 const gold=s.run.turn*5+s.battlesWon*12+summary(s).right*8+(outcome==='victory'?100:0);
 const payout={gold,xp:s.run.xp,ore:s.run.ore,chests:s.run.chests+(outcome==='victory'?2:0),outcome};
 let next=grantGrowth({...s,coins:s.coins+gold},payout.xp,payout.ore,payout.chests);
 if(outcome==='victory'&&s.stageCorrect>=4&&!s.armor.includes(s.stage)){next=awardItem(next,`${SLOTS[s.stage].id}:dawn:1`);next.armor=[...s.armor,s.stage];payout.armor=STAGES[s.stage].armor;}
 next.career={...next.career,runs:next.career.runs+1};
 return {...next,phase:'results',skills:{},tokens:0,unlocked:outcome==='victory'?Math.max(s.unlocked,Math.min(5,s.stage+1)):s.unlocked,battle:null,pending:null,feedback:null,event:null,upgradePending:false,skillChoices:[],run:{...s.run,move:null,settled:true,payout},history:[...(s.history||[]),{id:s.run.id,chapter:s.stage,...payout,build:structuredClone(s.skills),attempts:structuredClone(s.attempts)}]};
}
export function returnToLobby(s){if(s.phase==='run')throw Error('Finish the run first.');return {...s,phase:'lobby',skills:{},tokens:0,run:s.run?{...s.run,stats:{attack:0,hp:0,defense:0}}:null};}
export const trainingCost=(s,id)=>30+15*(career(s).talents[id]||0);
export function trainWithGold(s,id){
 if(s.phase!=='lobby'||!['might','vitality','resolve'].includes(id))throw Error('Train in the character lobby.');
 const price=trainingCost(s,id);if(s.coins<price)throw Error('Earn more gold from a run.');
 const c=structuredClone(career(s));c.talents[id]=(c.talents[id]||0)+1;return {...s,coins:s.coins-price,career:c};
}
export function shopStock(s,rng=Math.random){const skills=drawSkillChoices(s,rng).filter(id=>!['coins','lanterns','wards'].includes(id));return [{id:'heal',name:'Healing spring',desc:'Restore 40 HP',price:20},{id:'attack',name:'Tempered edge',desc:'+4 attack this run',price:30},{id:'defense',name:'Iron resolve',desc:'+2 defense this run',price:30},...skills.slice(0,1).map(id=>({id:'skill:'+id,name:'Skill discovery',desc:id,price:40}))];}
export function enterShop(s,rng=Math.random){return {...s,event:'market',run:{...s.run,shop:s.run.shop||{offers:shopStock(s,rng),bought:[],refreshes:0}}};}
export function buyRunOffer(s,index){
 const shop=s.run?.shop,offer=shop?.offers[index];if(s.phase!=='run'||s.event!=='market'||!offer||shop.bought.includes(index))throw Error('Offer is unavailable.');if(s.tokens<offer.price)throw Error('Not enough run tokens.');
 let next={...s,tokens:s.tokens-offer.price,run:{...s.run,stats:{...s.run.stats},shop:{...shop,bought:[...shop.bought,index]}}};
 if(offer.id==='heal')next.health=Math.min(maxHealth(next),next.health+40);else if(offer.id==='attack')next.run.stats.attack+=4;else if(offer.id==='defense')next.run.stats.defense+=2;else {next=runChoice({...next,upgradePending:true,skillChoices:[offer.id.slice(6)]},offer.id.slice(6));}
 return next;
}
export function refreshShop(s,rng=Math.random){if(s.event!=='market'||!s.run?.shop)throw Error('Visit a shop first.');const cost=10+5*s.run.shop.refreshes;if(s.tokens<cost)throw Error('Not enough run tokens.');return {...s,tokens:s.tokens-cost,run:{...s.run,shop:{offers:shopStock(s,rng),bought:[],refreshes:s.run.shop.refreshes+1}}};}
export function buyLobbyItem(s,slot,set){if(s.phase!=='lobby')throw Error('Visit the lobby shop.');if(s.coins<60)throw Error('You need 60 gold.');return awardItem({...s,coins:s.coins-60},`${slot}:${set}:0`);}
