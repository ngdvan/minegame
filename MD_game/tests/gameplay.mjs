import assert from 'node:assert/strict';
import {missions,stations,freshState,validState,perform} from '../missions.js';
import {findPath,blocked} from '../navigation.js';
const state=freshState(),buildings=stations.filter(s=>s.building).map(s=>s.building);
assert(validState(state));
assert.equal(perform(state,'work','arrive').ok,false,'cannot skip preparations');
assert.equal(perform(state,'exit','leave').ok,false,'cannot leave without finishing');
let from={...state.position};
for(const mission of missions){
 const target=stations.find(s=>s.id===mission.station),path=findPath(from,target,buildings);
 assert(path.length,`reachable: ${mission.title}`);
 for(const p of path)assert(!blocked(p.x,p.y,buildings),`path avoids walls: ${mission.title}`);
 const step=state.step;
 for(let i=0;i<mission.actions.length;i++){
  const [action]=mission.actions[i];const result=perform(state,mission.station,action);assert(result.ok);
  if(i<mission.actions.length-1){assert.equal(state.step,step,'cannot finish with missing equipment');assert.equal(perform(state,mission.station,action).ok,false,'duplicate collection rejected');}
  assert(validState(state),'save remains valid after each action');
 }
 assert.equal(state.step,step+1);from=target;
 if(mission.station==='lamp'&&step===4)assert(state.inventory.includes('lamp')&&state.inventory.includes('rescue'));
 if(step===8)assert(!state.inventory.includes('lamp')&&!state.inventory.includes('rescue'));
}
assert.equal(state.step,missions.length);assert.deepEqual(state.inventory,['order','clean']);
assert.equal(findPath({x:650,y:490},{x:200,y:800},buildings).length,0,'reject taps inside roofs');
assert(!validState({...freshState(),done:['leave']}));assert(!validState({...freshState(),step:99}));
console.log(`PASS: all ${missions.length} missions, correct ordering, individual equipment collection/return, duplicate prevention, valid saves, collision-free routes, invalid targets.`);
