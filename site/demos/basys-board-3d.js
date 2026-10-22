import * as THREE from '../vendor/three-0.180.0/three.module.js';
import { OrbitControls } from '../vendor/three-0.180.0/OrbitControls.js';
import { GLTFLoader } from '../vendor/three-0.180.0/GLTFLoader.js';

// Geometry is tessellated from the user-supplied Basys3 STEP assembly.
// Positions below are measured from that assembly, in 10 mm scene units.
const MODEL = new URL('../../models/basys3.glb?v=04ea90ccbb66', import.meta.url).href;
const PHOTO = new URL('../../models/basys3-top.jpg?v=612071f92095', import.meta.url).href;
function mount(host, handlers) {
  const surface = host.querySelector('[data-3d-surface]');
  let renderer;
  function unavailable(message) {
    host.dataset.failed = 'true';
    host.querySelectorAll('button').forEach(button => { button.disabled = true; });
    host.querySelector('[data-3d-status]').textContent = message;
    handlers.onUnavailable?.();
  }
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
  catch (_) { unavailable('3D graphics are unavailable in this browser. The keyboard-accessible board below still works.'); return null; }
  const canvas = renderer.domElement;
  canvas.className = 'basys-3d-canvas'; canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Interactive 3D Basys3 CAD model. Drag to rotate, pinch or scroll to zoom. Arrow keys rotate; Home resets the view. Keyboard-accessible timer controls are below.');
  surface.appendChild(canvas);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#08111c');
  const camera = new THREE.OrthographicCamera(-9, 9, 7, -7, .1, 100);
  camera.position.set(8, 12, 11); camera.lookAt(0, 0, 0);
  const orbit = new OrbitControls(camera, canvas);
  orbit.enablePan = false; orbit.enableDamping = false; orbit.minZoom = .65; orbit.maxZoom = 3.5;
  orbit.minPolarAngle = .02; orbit.maxPolarAngle = Math.PI - .02;
  scene.add(new THREE.HemisphereLight(0xe1efff, 0x26344b, 2));
  const key = new THREE.DirectionalLight(0xffffff, 2.5); key.position.set(-4,12,7); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9bd8ff, 1.2); rim.position.set(8,4,-6); scene.add(rim);
  const picking = [], caps = [], buttonCaps = {start:[],reset:[]}, segments = Array.from({length:4},()=>Array.from({length:7},()=>[]));
  const off = new THREE.MeshStandardMaterial({color:'#24151b',roughness:.8});
  const on = new THREE.MeshStandardMaterial({color:'#ff2835',emissive:'#ff1728',emissiveIntensity:.8,roughness:.45});
  let dead = false, ready = false, queued = 0, signature = '', latest = {switches:0,segments:[1,1,1,1]};
  function schedule() { if(!queued&&!dead)queued=requestAnimationFrame(()=>{queued=0;if(!dead)renderer.render(scene,camera);}); }
  function resize() {
    const width=Math.max(surface.clientWidth,1),height=Math.max(surface.clientHeight,1),aspect=width/height,half=Math.max(6.5,7.5/aspect);
    camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(width,height,false);schedule();
  }
  const observer=new ResizeObserver(resize);observer.observe(surface);orbit.addEventListener('change',schedule);
  function target(type,index,x,y,z,w,d,title) {
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,.7,d),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
    mesh.position.set(x,y,z);mesh.userData={type,index,title};scene.add(mesh);picking.push(mesh);
  }
  function applyState() {
    if(!ready)return;
    const next=latest.switches+':'+latest.segments.join(',');if(next===signature)return;signature=next;
    caps.forEach(cap=>{cap.position.z=(latest.switches&(1<<cap.userData.switchCap))?-.28:0;});
    const masks=latest.segments.slice().reverse();segments.forEach((digit,i)=>digit.forEach((faces,s)=>faces.forEach(mesh=>{mesh.material=masks[i]&(1<<(6-s))?off:on;})));schedule();
  }
  function releaseButton() {Object.values(buttonCaps).flat().forEach(mesh=>{mesh.position.y=0;});schedule();}
  function disposeObject(root) {
    const geometries=new Set(),materials=new Set(),textures=new Set();
    root.traverse(obj=>{if(obj.geometry)geometries.add(obj.geometry);if(obj.material)for(const m of [obj.material].flat()){materials.add(m);if(m.map)textures.add(m.map);}});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }
  // Preserve the exact CAD surface and its mounting holes while adding the
  // supplied top photograph as PCB silkscreen, using a calibrated UV region.
  function pcbSurface(mesh, texture) {
    const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal,idx=mesh.geometry.index;
    const positions=[],uv=[],normals=[];
    for(let i=0;i<idx.count;i+=3){const ids=[idx.getX(i),idx.getX(i+1),idx.getX(i+2)];
      if(!ids.every(j=>n.getY(j)>.99&&Math.abs(p.getY(j)-.076)<.001))continue;
      for(const j of ids){const x=p.getX(j),y=p.getY(j),z=p.getZ(j);positions.push(x,y+.001,z);normals.push(0,1,0);uv.push((x+6.096)/12.192,(-z+3.556)/7.112);}
    }
    if(!positions.length)return;
    texture.colorSpace=THREE.SRGBColorSpace;texture.repeat.set(1175/1282,690/804);texture.offset.set(56/1282,16/804);
    texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    scene.add(new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({map:texture,roughness:.9,metalness:.02})));
  }
  host.querySelector('[data-3d-status]').textContent='Loading the supplied CAD assembly…';
  Promise.all([new GLTFLoader().loadAsync(MODEL),new THREE.TextureLoader().loadAsync(PHOTO)]).then(([gltf,texture])=>{
    if(dead){disposeObject(gltf.scene);texture.dispose();return;}
    let pcb=null,segmentCount=0;
    gltf.scene.traverse(mesh=>{
      if(!mesh.isMesh)return;
      const data=mesh.userData;
      if(data.switchCap!==undefined)caps.push(mesh);
      if(data.buttonCap)buttonCaps[data.buttonCap].push(mesh);
      if(data.segment!==undefined){
        mesh.material=data.segment===7&&data.digit===1?on:off;
        if(data.segment<7){segments[data.digit][data.segment].push(mesh);segmentCount++;}
      }
      if(data.cadPart==='NAUO3'&&mesh.material.name==='mat_6')pcb=mesh;
    });
    if(segmentCount!==28||caps.length!==16)throw Error('CAD control mapping is incomplete');
    scene.add(gltf.scene);if(pcb)pcbSurface(pcb,texture);
    target('start',null,2.904,.35,-.144,.85,.65,'BTNU · Start / stop');
    target('reset',null,2.904,.35,.556,.85,.65,'BTNC · Reset');
    for(let slot=0;slot<16;slot++){const index=15-slot;if(index<2||index>=8)target('switch',index,-4.956+slot*.66,.7,2.676,.6,1.1,'SW'+index+' · '+(index<2?'mode':'preset'));}
    ready=true;host.dataset.ready='true';host.dataset.geometry='supplied-step';applyState();renderer.render(scene,camera);
    host.querySelector('[data-3d-status]').textContent='Drag to rotate · scroll or pinch to zoom · click a switch or button';
  }).catch(error=>{if(!dead)unavailable('The CAD model could not load. The keyboard-accessible timer below still works.');console.error(error);});
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),pointers=new Set();let down=null;
  function hit(event){if(!ready||camera.position.y<.1)return null;const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(picking,false)[0]?.object.userData||null;}
  function pointerDown(event){pointers.add(event.pointerId);down=pointers.size===1?{id:event.pointerId,x:event.clientX,y:event.clientY}:null;const item=hit(event);if(item&&buttonCaps[item.type]){buttonCaps[item.type].forEach(m=>{m.position.y=-.025;});schedule();}}
  function pointerUp(event){pointers.delete(event.pointerId);releaseButton();if(!down||down.id!==event.pointerId||Math.hypot(event.clientX-down.x,event.clientY-down.y)>5){down=null;return;}down=null;const item=hit(event);if(!item)return;if(item.type==='switch')handlers.onSwitch(item.index);else if(item.type==='start')handlers.onStart();else if(item.type==='reset')handlers.onReset();}
  function pointerCancel(event){pointers.delete(event.pointerId);down=null;releaseButton();}
  function pointerMove(event){if(event.buttons||!ready)return;const item=hit(event);canvas.style.cursor=item?'pointer':'grab';host.querySelector('[data-3d-status]').textContent=item?item.title:'Drag to rotate · scroll or pinch to zoom · click a switch or button';}
  function resetView(){camera.position.set(8,12,11);camera.zoom=1;camera.up.set(0,1,0);camera.updateProjectionMatrix();orbit.target.set(0,0,0);orbit.update();schedule();}
  function topView(){camera.position.set(.001,16,.32);camera.zoom=1;camera.up.set(0,1,0);camera.updateProjectionMatrix();orbit.target.set(0,0,0);orbit.update();schedule();}
  function keydown(event){
    if(event.key==='Home'){event.preventDefault();resetView();return;}
    if(['+','=','-'].includes(event.key)){event.preventDefault();camera.zoom=THREE.MathUtils.clamp(camera.zoom*(event.key==='-'?.9:1.1),.65,3.5);camera.updateProjectionMatrix();schedule();return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();const sphere=new THREE.Spherical().setFromVector3(camera.position);sphere.theta+=(event.key==='ArrowLeft'?.12:event.key==='ArrowRight'?-.12:0);sphere.phi=THREE.MathUtils.clamp(sphere.phi+(event.key==='ArrowUp'?-.12:event.key==='ArrowDown'?.12:0),.02,Math.PI-.02);camera.position.setFromSpherical(sphere);orbit.update();schedule();
  }
  canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointercancel',pointerCancel);canvas.addEventListener('keydown',keydown);
  const resetButton=host.querySelector('[data-reset-view]'),topButton=host.querySelector('[data-top-view]');resetButton.addEventListener('click',resetView);topButton.addEventListener('click',topView);resize();
  return {
    update(state){latest={switches:state.switches,segments:state.segments.slice()};applyState();},
    dispose(){dead=true;if(queued)cancelAnimationFrame(queued);observer.disconnect();orbit.dispose();canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointercancel',pointerCancel);canvas.removeEventListener('keydown',keydown);resetButton.removeEventListener('click',resetView);topButton.removeEventListener('click',topView);disposeObject(scene);renderer.dispose();canvas.remove();}
  };
}
window.Basys3D={mount};window.dispatchEvent(new Event('basys-3d-ready'));
