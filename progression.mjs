export const SLOTS=[
 {id:'belt',name:'Belt',icon:'ribbon',attack:1,hp:0,defense:0},
 {id:'chest',name:'Breastplate',icon:'shirt',attack:0,hp:12,defense:1},
 {id:'boots',name:'Boots',icon:'footprints',attack:1,hp:4,defense:0},
 {id:'shield',name:'Shield',icon:'shield',attack:0,hp:0,defense:2},
 {id:'helmet',name:'Helmet',icon:'crown',attack:0,hp:8,defense:1},
 {id:'sword',name:'Sword',icon:'sword',attack:3,hp:0,defense:0}
];
export const RARITIES=['Common','Rare','Epic','Legendary','Mythic'];
export const SETS=[
 {id:'dawn',name:'Dawn',desc:'3 pieces: +4 attack. 6 pieces: attacks add 4 burn damage.'},
 {id:'sentinel',name:'Sentinel',desc:'3 pieces: +3 defense. 6 pieces: recover 3 HP each combat round.'},
 {id:'sage',name:'Sage',desc:'3 pieces: +5 ultimate charge per action. 6 pieces: +10 ultimate charge every third round.'}
];
export const TALENTS=[
 {id:'might',name:'Might',icon:'sword',desc:'+2 attack per point'},
 {id:'vitality',name:'Vitality',icon:'heart',desc:'+10 maximum HP per point'},
 {id:'resolve',name:'Resolve',icon:'shield',desc:'+1 defense per point'}
];
export const newCareer=()=>({level:1,xp:0,points:0,talents:{might:0,vitality:0,resolve:0},inventory:{},equipped:{},slotLevels:{},ore:0,chests:1,runs:0});
export const career=s=>({...newCareer(),...(s.career||{})});
export const xpNeeded=level=>50+level*25;
export function itemInfo(key){const [slot,set,r]=String(key).split(':');const spec=SLOTS.find(x=>x.id===slot),family=SETS.find(x=>x.id===set),rarity=Number(r);if(!spec||!family||!Number.isInteger(rarity)||rarity<0||rarity>4)throw Error('Unknown equipment.');return {key,slot,set,rarity,spec,family,name:family.name+' '+spec.name};}
export function itemStats(key,level=1){const {spec,rarity}=itemInfo(key),tier=fusionTier(key);return {attack:spec.attack?spec.attack*(1+rarity)+level-1+tier*2:0,hp:spec.hp?Math.round(spec.hp*(1+rarity*.5))+(level-1)*3+tier*6:0,defense:spec.defense?spec.defense+rarity+level-1+tier:0};}
export function gearStats(state){const c=career(state),result={attack:0,hp:0,defense:0,focus:0,burn:0,regen:0,focusRegen:0,sets:{}};for(const [slot,key]of Object.entries(c.equipped)){if(!c.inventory[key])continue;const item=itemInfo(key);if(item.slot!==slot)continue;const stats=itemStats(key,c.slotLevels[slot]||1);for(const k of ['attack','hp','defense'])result[k]+=stats[k];result.sets[item.set]=(result.sets[item.set]||0)+1;}
 if(result.sets.dawn>=3)result.attack+=4;if(result.sets.dawn>=6)result.burn=4;
 if(result.sets.sentinel>=3)result.defense+=3;if(result.sets.sentinel>=6)result.regen=3;
 if(result.sets.sage>=3)result.focus=1;if(result.sets.sage>=6)result.focusRegen=1;
 result.attack+=(c.level-1)+2*(c.talents.might||0);result.hp+=(c.level-1)*5+10*(c.talents.vitality||0);result.defense+=c.talents.resolve||0;if(state.phase==='run'){for(const k of ['attack','hp','defense'])result[k]+=state.run?.stats?.[k]||0;}return result;}
export function grantGrowth(state,xp,ore=0,chests=0){const c=structuredClone(career(state));c.xp+=xp;c.ore+=ore;c.chests+=chests;while(c.level<50&&c.xp>=xpNeeded(c.level)){c.xp-=xpNeeded(c.level);c.level++;c.points++;}if(c.level===50)c.xp=0;return {...state,career:c};}
function editable(state){if(state.phase==='run')throw Error('Permanent equipment changes are available in the lobby after this run.');if(state.battle&&!state.battle.done)throw Error('Finish the battle before changing equipment.');return structuredClone(career(state));}
export function awardItem(state,key){itemInfo(key);const c=structuredClone(career(state));c.inventory[key]=(c.inventory[key]||0)+1;return {...state,career:c,lastLoot:key};}
export function openChest(state,slot,set,rng=Math.random){const c=editable(state);if(c.chests<1)throw Error('Earn a chest from battles or Bible trials.');const key=`${slot}:${set}:${rng()<.2?1:0}`;itemInfo(key);c.chests--;return awardItem({...state,career:c},key);}
export function equipItem(state,key){const c=editable(state),item=itemInfo(key);if(!c.inventory[key])throw Error('You do not own this item.');c.equipped[item.slot]=key;return {...state,career:c};}
export function upgradeCost(state,slot){const c=career(state),level=c.slotLevels[slot]||1;return {gold:15+level*10,ore:1+Math.floor(level/3),level};}
export function upgradeEquipment(state,slot){const c=editable(state),key=c.equipped[slot];if(!key)throw Error('Equip an item first.');const {rarity}=itemInfo(key),cost=upgradeCost(state,slot);if(cost.level>=(rarity+1)*5)throw Error('Combine duplicates to raise this rarity’s level limit.');if(state.coins<cost.gold||c.ore<cost.ore)throw Error('Earn more gold and forge shards.');c.ore-=cost.ore;c.slotLevels[slot]=cost.level+1;return {...state,coins:state.coins-cost.gold,career:c};}
export function combineEquipment(state,key){const c=editable(state),item=itemInfo(key);if(item.rarity===4)throw Error('Mythic is the highest rarity.');if((c.inventory[key]||0)<3)throw Error('You need three identical pieces of the same rarity.');const upgraded=`${item.slot}:${item.set}:${item.rarity+1}`;c.inventory[key]-=3;if(!c.inventory[key])delete c.inventory[key];c.inventory[upgraded]=(c.inventory[upgraded]||0)+1;if(c.equipped[item.slot]===key)c.equipped[item.slot]=upgraded;return {...state,career:c,lastLoot:upgraded};}
export function trainTalent(state,id){const c=editable(state);if(!TALENTS.some(x=>x.id===id))throw Error('Unknown talent.');if(c.points<1)throw Error('Level up to earn a talent point.');c.points--;c.talents[id]=(c.talents[id]||0)+1;return {...state,career:c};}
export function restartCareer(state,fresh){const c=structuredClone(career(state));c.runs++;return {...fresh,career:c,coins:state.coins,health:100+gearStats({...fresh,career:c}).hp};}
export const fusionTier=key=>Number(String(key).split(':')[3]||0);
export function weaponAbility(key){
 if(!key)return {name:'Radiant Strike',description:'An empowered attack when your ultimate charge reaches 100%.',damage:0,burn:0,shield:0,refund:0,heal:0};
 const {set,rarity,slot}=itemInfo(key);if(slot!=='sword')return null;
 if(set==='dawn')return {name:'Dawnfire',description:`Ultimate applies ${4+rarity*2} burn damage per round.${rarity>=2?' Epic passive: also recover 8 HP.':' Epic unlock: ultimate restores 8 HP.'}`,damage:0,burn:4+rarity*2,shield:0,refund:0,heal:rarity>=2?8:0};
 if(set==='sentinel')return {name:'Aegis Strike',description:`Ultimate creates a ${12+rarity*5} HP shield.${rarity>=2?' Epic passive: +8 ultimate damage.':' Epic unlock: +8 ultimate damage.'}`,damage:rarity>=2?8:0,burn:0,shield:12+rarity*5,refund:0,heal:0};
 return {name:'Starfall',description:`Ultimate adds ${8+rarity*4} lightning damage.${rarity>=2?' Epic passive: refund 20 ultimate charge.':' Epic unlock: refund 20 ultimate charge.'}`,damage:8+rarity*4,burn:0,shield:0,refund:rarity>=2?20:0,heal:0};
}
export const rarityLabel=key=>RARITIES[itemInfo(key).rarity]+(fusionTier(key)?` +${fusionTier(key)}`:'');
const fusionKey=(item,rarity,tier=0)=>`${item.slot}:${item.set}:${rarity}`+(tier?`:${tier}`:'');
export function fusionRecipe(state,key){
 const c=career(state),item=itemInfo(key),tier=fusionTier(key),needs=[],result={key:null,ingredients:[],ready:false,description:''};
 if(item.rarity===4&&tier>=4)return {...result,description:'Maximum fusion tier reached.'};
 if(item.rarity<2){needs.push({exact:key,count:2});result.key=fusionKey(item,item.rarity+1);}
 else if(item.rarity===2&&tier<2){needs.push({rarity:2,tier:0,count:tier+1});result.key=fusionKey(item,2,tier+1);}
 else if(item.rarity===2){needs.push({exact:key,count:2});result.key=fusionKey(item,3);}
 else if(item.rarity===3&&tier<2){needs.push({rarity:3,tier:0,count:1});result.key=fusionKey(item,3,tier+1);}
 else if(item.rarity===3&&tier===2){needs.push({exact:fusionKey(item,3),count:1});result.key=fusionKey(item,3,3);}
 else if(item.rarity===3){needs.push({exact:key,count:2});result.key=fusionKey(item,4);}
 else{needs.push({rarity:4,tier:0,count:1});result.key=fusionKey(item,4,tier+1);}
 result.description='Base piece + '+needs.map(n=>`${n.count} × ${n.exact?rarityLabel(n.exact)+' '+itemInfo(n.exact).name:'any '+RARITIES[n.rarity]+' '+item.spec.name+' at base fusion tier'}`).join(' + ');
 const available={...c.inventory};available[key]=(available[key]||0)-1;result.ingredients.push(key);
 let missing=0;
 for(const n of needs){let left=n.count;for(const candidate of Object.keys(available).sort()){
  const info=itemInfo(candidate),matches=n.exact?candidate===n.exact:info.slot===item.slot&&info.rarity===n.rarity&&fusionTier(candidate)===n.tier;
  if(!matches||c.protected?.[candidate])continue;
  const reserved=c.equipped[info.slot]===candidate&&candidate!==key?1:0;
  const take=Math.max(0,Math.min(left,(available[candidate]||0)-reserved));
  for(let i=0;i<take;i++)result.ingredients.push(candidate);available[candidate]-=take;left-=take;if(!left)break;
 }missing+=left;}
 result.missing=missing;result.ready=(c.inventory[key]||0)>0&&!c.protected?.[key]&&missing===0;return result;
}
export function fuseEquipment(state,key){const c=editable(state),recipe=fusionRecipe(state,key);if(!recipe.ready)throw Error('Recipe needs more eligible materials. Protected or other equipped items cannot be consumed.');for(const ingredient of recipe.ingredients){c.inventory[ingredient]--;if(!c.inventory[ingredient])delete c.inventory[ingredient];}c.inventory[recipe.key]=(c.inventory[recipe.key]||0)+1;const item=itemInfo(key);if(c.equipped[item.slot]===key)c.equipped[item.slot]=recipe.key;return {...state,career:c,lastLoot:recipe.key};}
export function protectEquipment(state,key){const c=editable(state);if(!c.inventory[key])throw Error('Item not owned.');c.protected={...c.protected,[key]:!c.protected?.[key]};return {...state,career:c};}
export function resetEquipmentLevel(state,slot){const c=editable(state);if(!SLOTS.some(s=>s.id===slot))throw Error('Unknown slot.');let gold=0,ore=0;for(let level=1;level<(c.slotLevels[slot]||1);level++){gold+=15+level*10;ore+=1+Math.floor(level/3);}c.slotLevels[slot]=1;c.ore+=ore;return {...state,coins:state.coins+gold,career:c};}
