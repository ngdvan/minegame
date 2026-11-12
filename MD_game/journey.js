import * as THREE from './vendor/three.module.min.js';

// Learning chapters, not a map of a mine or a prescribed route through facilities.
const chapters = [
  ['Đầu ca', 'Ôn trình tự chuẩn bị, bắt đầu bằng báo công.'],
  ['Bảo hộ', 'Nhận diện trang bị và trách nhiệm sử dụng đầy đủ bảo hộ.'],
  ['Nhận lệnh', 'Ôn việc nhận đèn, bình tự cứu, nhận lệnh và giao ca.'],
  ['Cuối ca', 'Ôn báo cáo, trả trang bị và vệ sinh cá nhân sau ca.']
];
const shell = document.createElement('div');
shell.className = 'journey-map';
shell.innerHTML = `<div class="map-heading"><span class="eyebrow">CA ĐẦU TIÊN CỦA TÔI</span><span class="map-badge">HÀNH TRÌNH 2D</span></div><div class="map-viewport" role="img" aria-label="Nhân vật thợ mỏ đi qua bốn chặng học tập trên bản đồ minh họa"></div><div class="map-stations" role="group" aria-label="Khám phá các chặng">${chapters.map(([name],i)=>`<button type="button" data-station="${i}"><span>${String(i+1).padStart(2,'0')}</span>${name}</button>`).join('')}</div><p class="map-status" role="status" aria-live="polite"></p><p class="map-disclaimer">Sơ đồ chặng học minh họa · Không dùng để dẫn đường thực tế</p>`;
const viewport = shell.querySelector('.map-viewport');
const status = shell.querySelector('.map-status');
let current = {stage:0,mode:'home'}, renderer, scene, camera, observer;
let player, marker, targetX = -330, lastTime = 0, visible = true;
const positions = [-330,-110,110,330];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const materials = new Map();
const geometries = new Set();
function material(color){
  if(!materials.has(color)) materials.set(color,new THREE.MeshBasicMaterial({color}));
  return materials.get(color);
}
function rect(parent,x,y,w,h,color,z=0){
  const geometry=new THREE.PlaneGeometry(w,h);geometries.add(geometry);
  const mesh=new THREE.Mesh(geometry,material(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}
function circle(parent,x,y,r,color,z=0){
  const geometry=new THREE.CircleGeometry(r,32);geometries.add(geometry);
  const mesh=new THREE.Mesh(geometry,material(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}
function polygon(parent,points,color,z=0){
  const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
  const geometry=new THREE.ShapeGeometry(shape);geometries.add(geometry);
  const mesh=new THREE.Mesh(geometry,material(color));mesh.position.z=z;parent.add(mesh);return mesh;
}
function building(x,index){
  const g=new THREE.Group();g.position.set(x,0,0);scene.add(g);
  rect(g,0,-8,134,92,index===3?'#a7b8a1':'#d9decb',2);
  polygon(g,[[-80,38],[0,79],[80,38]],'#456b59',3);
  rect(g,0,40,155,9,'#294f42',4);
  rect(g,0,-32,26,43,'#254c40',4);
  [-43,43].forEach(wx=>{rect(g,wx,0,24,27,'#f7df95',4);rect(g,wx,0,3,27,'#54705a',5);});
  rect(g,0,-58,152,12,'#7d987b',4);
  // Distinct station signs: sunrise, helmet, document, completion.
  circle(g,0,30,19,'#f2c75b',6);
  if(index===0){circle(g,0,30,8,'#fff2c1',7);}
  if(index===1){circle(g,0,32,10,'#294f42',7);rect(g,0,26,26,5,'#294f42',8);}
  if(index===2){rect(g,0,30,17,23,'#fff2c1',7);[24,30,36].forEach(y=>rect(g,0,y,10,2,'#294f42',8));}
  if(index===3){polygon(g,[[-10,30],[-3,23],[11,38],[7,42],[-3,31],[-7,35]],'#294f42',7);}
}
function setup(){
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setClearColor('#e8eddd');
  renderer.domElement.setAttribute('aria-hidden','true');viewport.append(renderer.domElement);
  scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-460,460,200,-200,.1,100);camera.position.z=50;
  circle(scene,319,127,35,'#f4d783',-5);
  polygon(scene,[[-500,-20],[-340,136],[-160,-20],[55,146],[270,-20],[400,124],[520,-20]],'#c6d4be',-4);
  polygon(scene,[[-500,-70],[-245,74],[-65,-52],[170,83],[510,-64]],'#b6c9af',-3);
  rect(scene,0,-130,1000,150,'#a0b69a',-2);
  rect(scene,0,-100,950,46,'#e2d8b6',0);
  for(let x=-420;x<450;x+=35)rect(scene,x,-100,15,3,'#b3a47d',1);
  positions.forEach(building);
  // Sparse trees frame the buildings without hiding the path.
  [-430,-218,218,430].forEach(x=>{rect(scene,x,-34,7,44,'#71846a',1);circle(scene,x,-4,22,'#87a780',2);circle(scene,x+8,10,17,'#91af87',3);});
  marker=circle(scene,-330,-101,20,'#f5cf63',3);marker.scale.y=.35;
  player=new THREE.Group();player.position.set(-330,-89,10);scene.add(player);
  rect(player,-8,-9,10,24,'#284e42',1);rect(player,8,-9,10,24,'#284e42',1);
  rect(player,-10,-22,16,7,'#173b33',2);rect(player,10,-22,16,7,'#173b33',2);
  rect(player,0,11,33,36,'#efb743',3);rect(player,-9,11,5,36,'#fff0aa',4);rect(player,9,11,5,36,'#fff0aa',4);rect(player,0,4,33,5,'#fff0aa',4);
  circle(player,0,40,14,'#d5a178',4);circle(player,0,50,17,'#f2c455',5);rect(player,0,45,40,6,'#e1ad37',6);rect(player,10,50,13,9,'#284e42',7);circle(player,13,50,4,'#fff2ba',8);
  rect(player,-23,12,10,29,'#dba439',2);rect(player,23,12,10,29,'#dba439',2);rect(player,25,-1,12,16,'#345d49',5);
  observer=new ResizeObserver(resize);observer.observe(viewport);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);shell.classList.add('map-unavailable');status.textContent='Bản đồ tạm dừng. Bạn vẫn có thể làm các thử thách bên dưới.';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{shell.classList.remove('map-unavailable');update(current);resize();startLoop();});
  renderer.domElement.addEventListener('pointerup',pick);
  startLoop();
}
function resize(){
  const width=viewport.clientWidth,height=viewport.clientHeight;if(!width||!height)return;
  // Fit the complete scene into both portrait and desktop panels.
  const aspect=width/height,halfH=Math.max(185,460/aspect),halfW=halfH*aspect;
  camera.left=-halfW;camera.right=halfW;camera.top=halfH;camera.bottom=-halfH;camera.updateProjectionMatrix();
  renderer.setSize(width,height,false);renderer.render(scene,camera);
}
function startLoop(){if(renderer&&visible&&shell.isConnected&&!document.hidden)renderer.setAnimationLoop(animate);}
function animate(time){
  const delta=Math.min((time-lastTime)/1000,.05);lastTime=time;
  const moving=Math.abs(player.position.x-targetX)>.5;
  player.position.x=reducedMotion.matches?targetX:THREE.MathUtils.damp(player.position.x,targetX,5,delta);
  player.position.y=-89+(moving&&!reducedMotion.matches?Math.sin(time*.014)*2:0);
  marker.position.x=targetX;renderer.render(scene,camera);
  if(!moving){player.position.x=targetX;renderer.setAnimationLoop(null);}
}
function inspect(index){
  const stateLabel=index<current.stage?'Đã qua':index===current.stage?'Đang học':'Chặng phía trước';
  status.textContent=`${stateLabel} · ${chapters[index][1]}`;
  if(index===current.stage&&current.mode==='task')document.querySelector('.task-title')?.focus({preventScroll:true});
}
function pick(event){
  const bounds=renderer.domElement.getBoundingClientRect();
  const pointer=new THREE.Vector2((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);
  const ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);
  const point=new THREE.Vector3();ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),0),point);
  if(point&&point.y>-65&&point.y<90){const i=positions.findIndex(x=>Math.abs(x-point.x)<85);if(i>=0)inspect(i);}
}
function update(detail){
  current=detail;targetX=positions[detail.stage];
  shell.querySelectorAll('[data-station]').forEach((b,i)=>{
    b.classList.toggle('is-current',i===detail.stage);b.classList.toggle('is-complete',i<detail.stage);
    if(i===detail.stage)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');
    b.querySelector('span').textContent=i<detail.stage?'✓':String(i+1).padStart(2,'0');
  });
  status.textContent=`Chặng ${detail.stage+1}/4 · ${chapters[detail.stage][1]}`;
  if(player&&reducedMotion.matches)player.position.x=targetX;
  if(renderer){resize();startLoop();}
}
function mount(detail){
  if(detail.mode==='results'){renderer?.setAnimationLoop(null);return;}
  const host=document.querySelector('.journey-map-host');if(!host)return;
  host.replaceChildren(shell);
  if(!renderer){try{setup();}catch(error){
    renderer?.dispose();renderer=undefined;shell.classList.add('map-unavailable');
    viewport.textContent='Bản đồ 2D cần trình duyệt hỗ trợ WebGL 2. Chọn chặng bên dưới để xem nội dung.';
    console.warn('Không khởi tạo được bản đồ Three.js:',error);
  }}
  update(detail);
}
shell.querySelectorAll('[data-station]').forEach(b=>b.addEventListener('click',()=>inspect(Number(b.dataset.station))));
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)startLoop();else renderer?.setAnimationLoop(null);}).observe(shell);
document.addEventListener('visibilitychange',()=>{if(document.hidden)renderer?.setAnimationLoop(null);else startLoop();});
window.addEventListener('md-journey',event=>mount(event.detail));
window.addEventListener('pagehide',event=>{if(event.persisted){renderer?.setAnimationLoop(null);return;}observer?.disconnect();renderer?.setAnimationLoop(null);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer?.dispose();});
window.addEventListener('pageshow',()=>{resizeIfReady();startLoop();});
function resizeIfReady(){if(renderer)resize();}
mount(window.mdJourneyState||current);
