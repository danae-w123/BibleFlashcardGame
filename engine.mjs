import {newCareer,career,gearStats,grantGrowth,awardItem,SLOTS,weaponAbility} from './progression.mjs';
export const STAGES=[
 {name:'The First Light',region:'The shores of John 1',chapters:[1],armor:'Belt of Truth',icon:'ribbon',verse:'Stand firm in truth.',color:'#f0c674'},
 {name:'The Wedding at Cana',region:'The hills of John 2',chapters:[2],armor:'Breastplate of Righteousness',icon:'shirt',verse:'Let righteousness guard your heart.',color:'#7de1d2'},
 {name:'Born of the Spirit',region:'The night skies of John 3',chapters:[3],armor:'Shoes of Peace',icon:'footprints',verse:'Walk with the readiness of peace.',color:'#a9b9ff'},
 {name:'The Living Water',region:'The well of John 4',chapters:[4],armor:'Shield of Faith',icon:'shield',verse:'Let faith be your shield.',color:'#70d6f1'},
 {name:'The Watchtower',region:'A review of John 1–3',chapters:[1,2,3],armor:'Helmet of Salvation',icon:'crown',verse:'Hold fast to the hope of salvation.',color:'#f5b78b'},
 {name:'The Final Ascent',region:'A review of John 1–4',chapters:[1,2,3,4],armor:'Sword of the Spirit',icon:'swords',verse:'Carry the word of God.',color:'#f0c674'}
];
export const MODES={mixed:'Mixed trials',blank:'Missing letters',reference:'Find the reference',recall:'Recall the verse',quiz:'Quiz questions'};
export const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
export function referenceKey(s){return String(s).toLowerCase().replace(/\b(?:john|jn\.?)\s*/g,'').replace(/[–—]/g,'-').replace(/\s+/g,'').replace(/^0+(?=\d)/,'');}
export function acceptedAnswers(text){
 const variants=[text,text.replace(/\([^)]*\)/g,'')];
 for(const match of text.matchAll(/\[OR\s+([^\]]+)\]/g)) variants.push(match[1]);
 return [normalize(text),...variants.map(v=>normalize(v.replace(/\[OR[^\]]*\]/g,'').replace(/[()]/g,'')))].filter(Boolean);
}
export function grade(challenge,input){
 if(challenge.mode==='reference')return referenceKey(input)===referenceKey(challenge.answer);
 if(challenge.mode==='quiz')return acceptedAnswers(challenge.answer).includes(normalize(input));
 return normalize(input)===normalize(challenge.answer);
}
export function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function makeChallenge(data,stage,mode,seen=[],rng=Math.random){
 const chapters=STAGES[stage].chapters;
 if(mode==='mixed')mode=['blank','reference','quiz','blank','recall','quiz'][seen.length%6];
 if(mode==='quiz'){
  const pool=data.questions.filter(q=>chapters.includes(q.chapter)&&!['Q','V','R'].includes(q.kind));
  const fresh=pool.filter(q=>!seen.includes('quiz:'+q.id));const q=shuffle(fresh.length?fresh:pool,rng)[0];
  return {...q,id:'quiz:'+q.id,mode,prompt:q.prompt};
 }
 const pool=data.verses.filter(v=>chapters.includes(v.chapter));
 const fresh=pool.filter(v=>!seen.includes(mode+':'+v.reference));const v=shuffle(fresh.length?fresh:pool,rng)[0];
 const base={id:mode+':'+v.reference,mode,reference:v.reference,verse:v.text};
 if(mode==='reference')return {...base,prompt:v.text,answer:v.reference};
 if(mode==='recall')return {...base,prompt:v.reference,answer:v.text};
 const words=v.text.match(/[A-Za-z’']+/g).filter(w=>w.length>=5);const word=shuffle(words,rng)[0];
 const start=v.text.indexOf(word);const masked=word[0]+word.slice(1).replace(/[a-z]/gi,'_');
 return {...base,prompt:v.text.slice(0,start)+masked+v.text.slice(start+word.length),answer:word,mask:masked};
}
export function freshState(name='',alias='',mode='mixed',character='male'){return {schema:1,name,alias,mode,character:character==='female'?'female':'male',stage:0,position:0,attempts:[],stageAttempts:0,stageCorrect:0,armor:[],pending:null,feedback:null,complete:false,ended:false,seen:[],lastRoll:null,coins:0,lanterns:1,wards:0,event:null,upgradePending:false,bossWon:false,health:100,focus:2,battle:null,battlesWon:0,battlesLost:0,rewardReason:'verse',skills:{},skillChoices:[],career:newCareer()};}
export function recordAnswer(state,input){
 if(!state.pending||state.feedback)throw Error('No unanswered challenge.');
 const challenge=state.pending;const correct=grade(challenge,input);
 const attempt={...challenge,input,correct,stage:state.stage,at:new Date().toISOString()};
 const next={...state,attempts:[...state.attempts,attempt],stageAttempts:state.stageAttempts+1,stageCorrect:state.stageCorrect+Number(correct),seen:[...state.seen,challenge.id],feedback:attempt,coins:(state.coins||0)+(correct?10:0),bossWon:state.bossWon||Boolean(challenge.boss&&correct),focus:correct?Math.min(maxFocus(state),(state.focus||0)+1):state.focus};
 const wisdom=skillLevel(state,'wisdom');if(correct&&wisdom&&summary(next).right%Math.max(1,4-wisdom)===0)next.lanterns++;
 return grantGrowth(next,correct?30:5,correct?2:0,correct&&summary(next).right%3===0?1:0);
}
export function stageReady(state){return state.stageAttempts>=6&&state.stageCorrect>=4;}
export function stagePassed(state){return stageReady(state)&&state.bossWon;}
export function advanceStage(state){
 if(!stagePassed(state))throw Error('Earn at least 4 correct answers and complete 6 trials.');
 const armor=[...new Set([...state.armor,state.stage])];state=awardItem(grantGrowth(state,75,5,2),SLOTS[state.stage].id+':dawn:1');
 if(state.stage===5)return {...state,armor,complete:true,pending:null,feedback:null};
 return {...state,armor,stage:state.stage+1,stageAttempts:0,stageCorrect:0,pending:null,feedback:null,seen:[],position:0,bossWon:false,event:null,upgradePending:false};
}
export function summary(state){const right=state.attempts.filter(a=>a.correct).length;return {right,wrong:state.attempts.length-right,total:state.attempts.length,accuracy:state.attempts.length?Math.round(right/state.attempts.length*100):0};}
export const TILE_TYPES=['camp','trial','battle','blessing','trial','market','battle','trial','storm','battle','treasure','trial','battle','trial','battle','camp','trial','storm','battle','trial'];
export const EVENTS={elite:{name:'Elite encounter',icon:'swords',description:'A stronger guardian challenges this run.'},boss:{name:'Final boss',icon:'crown',description:'Defeat this guardian to win the chapter.'},battle:{name:'Monster encounter',icon:'swords',description:'A creature blocks the path. Win a battle to earn gold and a reward.'},camp:{name:'A moment to reflect',icon:'flame',description:'Recover 35 health and one focus charge. Read a passage by the campfire before returning to the board.'},blessing:{name:'A light on the path',icon:'sparkles',description:'You found a lantern. Use it to reveal a clue during a trial.'},market:{name:'The traveler’s market',icon:'store',description:'Trade the gold you earned for supplies for your journey.'},storm:{name:'Through the storm',icon:'cloud-lightning',description:'The winds sweep across your path. A ward protects your gold; otherwise you lose up to 10 gold.'},treasure:{name:'A hidden treasure',icon:'gem',description:'A forgotten chest holds 20 gold for your journey.'}};
export function resolveEvent(state){const kind=state.event;if(!kind||kind==='battle')throw Error('No non-combat encounter to resolve.');const next={...state,event:null};if(kind==='camp'){next.health=Math.min(maxHealth(next),next.health+35);next.focus=Math.min(maxFocus(next),next.focus+1);}if(kind==='blessing')next.lanterns++;if(kind==='treasure')next.coins+=20;if(kind==='storm'){if(next.wards>0)next.wards--;else next.coins=Math.max(0,next.coins-10);}return next;}
export function buySupply(state,item){if(!['lanterns','wards','health'].includes(item))throw Error('Unknown supply.');if(state.coins<20)throw Error('You need 20 gold.');return {...state,coins:state.coins-20,[item]:item==='health'?Math.min(maxHealth(state),state.health+40):state[item]+1};}
export function chooseUpgrade(state,item){
 if(!state.upgradePending)throw Error('No reward available.');
 if(!state.skillChoices?.includes(item))throw Error('Choose one of the offered rewards.');
 const skill=SKILLS.find(s=>s.id===item);
 if(skill){const level=skillLevel(state,item);if(level>=skill.max)throw Error('Skill already mastered.');const next={...state,skills:{...state.skills,[item]:level+1},upgradePending:false,skillChoices:[]};if(item==='vigor')next.health+=20;if(item==='focus')next.focus=Math.min(maxFocus(next),next.focus+1);return next;}
 if(!['lanterns','wards','coins'].includes(item))throw Error('Unknown reward.');
 return {...state,[item]:state[item]+(item==='coins'?15:1),upgradePending:false,skillChoices:[]};
}
export function getHint(q){if(q.mode==='reference')return 'Chapter '+q.reference.match(/John (\d+)/)[1];if(q.mode==='blank')return 'Starts with “'+q.answer.slice(0,Math.min(3,q.answer.length-1))+'” · '+q.answer.length+' letters';return q.answer.split(/\s+/).map(w=>w.replace(/[A-Za-z][A-Za-z’']*/g,v=>v[0]+'_'.repeat(v.length-1))).join(' ');}
export function startBattle(state){if(state.battle)throw Error('Already in battle.');const names=['Mossback Guardian','Canyon Golem','Stormstone Sentinel'];const name=names[(state.stage+state.battlesWon+state.battlesLost)%3];const max=Math.round((48+state.stage*45+state.stage*state.stage*10)*(1+career(state).runs*.3));return {...state,event:null,battle:{name,hp:max,max,turn:1,intent:'strike',log:'The guardian steps onto the path. Your hero is ready. Your skills will trigger automatically.',done:false,outcome:null,lastAction:null,burn:0,poison:0,effects:[]}};}
export function combatTurn(state,action,rng=Math.random){
 if(!state.battle||state.battle.done)throw Error('No active battle.');
 if(!['strike','guard','radiance'].includes(action))throw Error('Unknown battle action.');
 if(action==='radiance'&&state.focus<1)throw Error('No focus charges left.');
 const b={...state.battle,effects:[],lastTurn:{damageDealt:0,lifeStolen:0,shieldGained:0,shieldBlocked:0,healthDamage:0}},next={...state,battle:b},gear=gearStats(state);if(gear.regen){next.health=Math.min(maxHealth(state),next.health+gear.regen);b.effects.push('Sentinel healing +'+gear.regen);}if(state.phase!=='run'&&gear.focusRegen&&b.turn%3===0){next.focus=Math.min(maxFocus(state),next.focus+1);b.effects.push('Sage focus +1');}
 let damage=baseDamage(state,action);
 if(state.phase==='run'&&action==='radiance'){
  const weapon=weaponAbility(career(state).equipped.sword);damage+=weapon.damage;b.burn=Math.max(b.burn||0,weapon.burn);b.shield=(b.shield||0)+weapon.shield;next.health=Math.min(maxHealth(state),next.health+weapon.heal);b.effects.push(weapon.name);
 }
 if(state.phase==='run'&&state.path==='arcanist'&&career(state).level>=5&&action==='radiance'){damage+=8;b.effects.push('Lightweaver radiance +8');}
 if(skillLevel(state,'meteor')&&b.turn%3===0){damage+=18*skillLevel(state,'meteor');b.effects.push('Meteor burst');}
 if(skillLevel(state,'tempest')&&action==='radiance'){damage+=14*skillLevel(state,'tempest');b.effects.push('Tempest surge');}
 if(skillLevel(state,'precision')&&rng()<skillLevel(state,'precision')*.1){damage=Math.round(damage*1.5);b.effects.push('Critical hit');}
 if(action!=='guard'&&skillLevel(state,'lightning')&&rng()<.3){damage+=skillLevel(state,'lightning')*6;b.effects.push('Chain lightning');}
 if(action!=='guard'){b.burn=Math.max(b.burn||0,skillLevel(state,'fire')*2+gear.burn);b.poison=Math.min(skillLevel(state,'poison')*3,(b.poison||0)+skillLevel(state,'poison'));}
 damage+=(b.burn||0)+(b.poison||0);if(b.burn)b.effects.push(`Burn +${b.burn}`);if(b.poison)b.effects.push(`Poison +${b.poison}`);
 if(action==='radiance'&&skillLevel(state,'aegis')){const shield=skillLevel(state,'aegis')*12;b.shield=(b.shield||0)+shield;b.lastTurn.shieldGained=shield;b.effects.push(`Radiant Aegis +${shield} shield`);}
 if(action==='radiance')next.focus--;
 if(b.enemyShield){const absorbed=Math.min(damage,b.enemyShield);b.enemyShield-=absorbed;damage-=absorbed;b.effects.push(`Enemy shield absorbs ${absorbed}`);}
 b.lastTurn.damageDealt=Math.min(b.hp,damage);b.hp=Math.max(0,b.hp-damage);b.lastAction=action;
 if(action==='strike'&&skillLevel(state,'leech')&&b.lastTurn.damageDealt){const heal=Math.min(maxHealth(state)-next.health,Math.ceil(b.lastTurn.damageDealt*skillLevel(state,'leech')*.15));next.health+=heal;b.lastTurn.lifeStolen=heal;if(heal)b.effects.push(`Life steal +${heal} HP`);}
 if(b.hp===0){b.done=true;b.outcome='won';b.log=`You dealt ${damage} damage. The ${b.name} is defeated!`;next.battlesWon++;next.coins+=battleGold(state);next.health=Math.min(maxHealth(state),next.health+12+skillLevel(state,'secondWind')*8);return next;}
 if(b.variant===0&&b.turn%4===0){const healing=b.burn?3:6;b.hp=Math.min(b.max,b.hp+healing);b.effects.push(`Enemy regenerates ${healing}`);}
 const rawAttack=Math.round((8+state.stage*4+(b.intent==='heavy'?10:0)+(b.variant===2&&b.hp<b.max/2?4:0)+(state.phase==='run'?Math.floor(state.run.turn*.4)+(b.kind==='boss'?9:b.kind==='elite'?4:0):0))*(1+career(state).runs*.3));const attack=Math.max(Math.ceil(rawAttack*.25),rawAttack-skillLevel(state,'frost')*2-gear.defense);
 let taken=action==='guard'?Math.ceil(attack*.25):attack;
 if(state.phase==='run'&&state.path==='guardian'&&b.turn%3===0){const block=Math.min(8,taken);taken-=block;b.effects.push(`Guardian shield blocks ${block}`);}
 if(b.shield){const block=Math.min(b.shield,taken);b.shield-=block;taken-=block;b.lastTurn.shieldBlocked=block;b.effects.push(`Shield absorbs ${block}`);}
 b.lastTurn.healthDamage=Math.min(next.health,taken);next.health=Math.max(0,next.health-taken);
 b.log=`${action==='guard'?'Guarded strike':action==='radiance'?'Radiant strike':'Sword strike'} dealt ${damage} damage. The guardian dealt ${taken}${action==='guard'?' after your block':''}.`;
 if(next.health===0){b.done=true;b.outcome='lost';b.log+=' You retreat to safety. Rest restores your health; you lose up to 10 gold.';next.battlesLost++;next.coins=Math.max(0,next.coins-10);}
 b.turn++;b.intent=b.turn%(b.kind==='boss'?2:3)===0?'heavy':'strike';return next;
}
export function finishBattle(state){if(!state.battle?.done)throw Error('Battle is not finished.');const won=state.battle.outcome==='won';if(won)state=grantGrowth(state,25,3,1);return {...state,battle:null,health:won?state.health:maxHealth(state),focus:won?state.focus:Math.max(1,state.focus),upgradePending:won,rewardReason:'battle',skillChoices:won?drawSkillChoices(state):[]};}
export const SKILLS=[
 {id:'meteor',name:'Dawn Meteor',icon:'flame',rarity:'epic',max:3,requires:s=>skillLevel(s,'fire')>=2,desc:l=>`Requires Flame Blade II. Every third combat round: +${l*18} damage.`},
 {id:'tempest',name:'Radiant Tempest',icon:'zap',rarity:'epic',max:3,requires:s=>skillLevel(s,'lightning')>=1&&skillLevel(s,'focus')>=1,desc:l=>`Requires Chain Lightning + Radiant Focus. Radiance adds ${l*14} damage.`},
 {id:'revive',name:'Last Light',icon:'heart-pulse',rarity:'epic',max:1,requires:s=>s.phase==='run'&&!s.run?.revived,desc:()=>`Once this run: survive a fatal hit and recover 40% maximum HP.`},
 {id:'fire',name:'Flame Blade',icon:'flame',rarity:'rare',max:3,desc:l=>`Weapon attacks apply burn: ${l*2} extra damage each turn for the battle.`},
 {id:'frost',name:'Frost Ward',icon:'snowflake',rarity:'common',max:3,desc:l=>`Reduce every incoming attack by ${l*2} damage before guarding.`},
 {id:'lightning',name:'Chain Lightning',icon:'zap',rarity:'epic',max:3,desc:l=>`Strike and Radiance have a 30% chance to add ${l*6} lightning damage.`},
 {id:'poison',name:'Venom Edge',icon:'droplets',rarity:'rare',max:3,desc:l=>`Weapon attacks add ${l} poison damage per turn, stacking up to ${l*3} in each battle.`},
 {id:'thorns',name:'Briar Shield',icon:'shield',rarity:'common',max:3,desc:l=>`Guard attacks deal ${l*4} extra damage while blocking 75% of incoming damage.`},
 {id:'leech',name:'Life Steal',icon:'heart-pulse',rarity:'epic',max:3,desc:l=>`Basic Strikes heal ${l*15}% of actual damage dealt (rounded up). Shielded damage gives no healing.`},
 {id:'aegis',name:'Radiant Aegis',icon:'shield-check',rarity:'rare',max:3,desc:l=>`Each ultimate grants ${l*12} shield HP before the counterattack. Absorbs damage until spent; resets after battle.`},
 {id:'secondWind',name:'Second Wind',icon:'wind',rarity:'common',max:3,desc:l=>`Recover ${l*8} extra health after every battle victory.`},
 {id:'vigor',name:'Heart of Courage',icon:'heart',rarity:'common',max:3,desc:l=>`Maximum health increases by ${l*20}. Each upgrade also heals 20 HP.`},
 {id:'focus',name:'Radiant Focus',icon:'sparkles',rarity:'rare',max:3,desc:l=>`Gain +${l*5} ultimate charge with each basic or guarded attack. Picking this skill adds 20 charge.`},
 {id:'bounty',name:'Treasure Seeker',icon:'coins',rarity:'common',max:3,desc:l=>`Earn ${l*5} additional run tokens from every monster victory.`},
 {id:'precision',name:'Eagle Eye',icon:'crosshair',rarity:'rare',max:3,desc:l=>`Every combat move has a ${l*10}% chance to deal 50% more base damage.`},
 {id:'wisdom',name:'Scholar’s Light',icon:'lamp',rarity:'rare',max:3,desc:l=>`Gain a lantern every ${Math.max(1,4-l)} correct Bible ${l===3?'answer':'answers'}.`}
];
export const skillLevel=(state,id)=>state.skills?.[id]||0;
export const maxHealth=state=>100+skillLevel(state,'vigor')*20+gearStats(state).hp;
export const maxFocus=state=>3+skillLevel(state,'focus')+gearStats(state).focus;
export const baseDamage=(state,action)=>(action==='radiance'?29:action==='guard'?8+skillLevel(state,'thorns')*4:16)+state.armor.length*3+gearStats(state).attack;
export const battleGold=state=>20+skillLevel(state,'bounty')*5;
export function drawSkillChoices(state,rng=Math.random){
 const pool=SKILLS.filter(s=>skillLevel(state,s.id)<s.max&&(!s.requires||s.requires(state))),picks=[];
 while(pool.length&&picks.length<3){const weight=s=>({common:4,rare:2,epic:1}[s.rarity]);let roll=rng()*pool.reduce((n,s)=>n+weight(s),0),index=pool.length-1;for(let i=0;i<pool.length;i++){roll-=weight(pool[i]);if(roll<0){index=i;break;}}picks.push(pool.splice(index,1)[0].id);}
 if(picks.length<3)picks.push(...shuffle(['lanterns','wards','coins'],rng).slice(0,3-picks.length));
 return picks;
}
