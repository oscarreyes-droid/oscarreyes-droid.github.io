import fs from 'node:fs';
import*as T from '../site/vendor/three-0.180.0/three.module.js';
import{GLTFLoader}from '../site/vendor/three-0.180.0/GLTFLoader.js';
import{mergeGeometries,mergeVertices}from '../site/vendor/three-0.180.0/BufferGeometryUtils.js';
const [input,outputPath]=process.argv.slice(2);
if(!input||!outputPath)throw Error('Usage: node scripts/prepare-basys3-cad.mjs input.glb output.glb');
const b=fs.readFileSync(input);
const {scene}=await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');scene.updateMatrixWorld(true);
const transform=new T.Matrix4().makeRotationX(-Math.PI/2).scale(new T.Vector3(100,100,100));
const switchNames=['NAUO4',...Array.from({length:15},(_,i)=>'NAUO'+(24+i))];
const digitCenters=[-.0393690849456787,-.0314690849456787,-.0235690849456787,-.0156690849456787];
const output=[];let segments=0,capCount=0;
scene.traverse(node=>{
 if(!/^NAUO\d+$/.test(node.name)||(!node.isMesh&&!node.children.some(c=>c.isMesh)))return;
 const groups=new Map();
 node.traverse(mesh=>{
  if(!mesh.isMesh)return;
  const bounds=new T.Box3().setFromObject(mesh),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
  const sw=switchNames.indexOf(node.name),extra={cadPart:node.name};let suffix='';
  if(['NAUO7','NAUO8'].includes(node.name)&&mesh.material.name==='mat_8')extra.buttonCap=node.name==='NAUO8'?'start':'reset';
  if(sw>=0&&mesh.material.name==='mat_8'&&bounds.max.z>.010) {extra.switchCap=15-sw;suffix='cap';}
  if(node.name==='NAUO58'&&mesh.material.name==='mat_0'&&size.z<.000001&&Math.abs(center.z-.00654)<.00001){
   const digit=digitCenters.reduce((best,x,i)=>Math.abs(center.x-x)<Math.abs(center.x-digitCenters[best])?i:best,0);
   let segment=-1;
   if(size.x>.002&&size.y<.0015)segment=center.y>-.008?0:center.y>-.0105?6:3;
   else if(size.y>.002&&size.x<.002){const right=center.x>digitCenters[digit]-.0004;segment=center.y>-.00916?(right?1:5):(right?2:4);}
   else if(size.x>.001&&size.y>.001)segment=Math.abs(center.y+.01216)<.0001?7:8;
   if(segment>=0){extra.digit=digit;extra.segment=segment;suffix='digit'+digit+'segment'+segment;}
  }
  const key=mesh.material.uuid+suffix;
  if(!groups.has(key))groups.set(key,{geometries:[],material:mesh.material,extra});
  let geo=mesh.geometry.clone().applyMatrix4(mesh.matrixWorld).applyMatrix4(transform);
  if(geo.index)geo=geo.toNonIndexed();
  const clean=new T.BufferGeometry();clean.setAttribute('position',geo.getAttribute('position'));clean.setAttribute('normal',geo.getAttribute('normal'));
  groups.get(key).geometries.push(clean);
 });
 for(const group of groups.values()){
  const geometry=mergeVertices(mergeGeometries(group.geometries,false),1e-7);geometry.computeBoundingBox();
  if(group.extra.segment>=0&&group.extra.segment<7)segments++;
  if(group.extra.switchCap!==undefined)capCount++;
  output.push({name:node.name+'_'+output.length,geometry,material:group.material,extra:group.extra});
 }
});
if(segments!==28||capCount!==16)throw Error(`Bad mapping: ${segments} segments, ${capCount} caps`);
const json={asset:{version:'2.0',generator:'OpenCascade STEP tessellation; lossless per-material face merge',extras:{source:'User-supplied Basys3.STEP from GrabCAD',unit:'10 mm per scene unit'}},scene:0,scenes:[{nodes:[]}],nodes:[],meshes:[],materials:[],accessors:[],bufferViews:[],buffers:[{byteLength:0}]};
const chunks=[];let byteLength=0;const materials=new Map();
function accessor(attr,type,bounds){const bytes=Buffer.from(attr.array.buffer,attr.array.byteOffset,attr.array.byteLength);const view=json.bufferViews.push({buffer:0,byteOffset:byteLength,byteLength:bytes.length,target:34962})-1;chunks.push(bytes);byteLength+=bytes.length;const a={bufferView:view,componentType:5126,count:attr.count,type};if(bounds){a.min=bounds.min.toArray();a.max=bounds.max.toArray();}return json.accessors.push(a)-1;}
for(const {name,geometry,material,extra}of output){
 if(!materials.has(material.uuid)){materials.set(material.uuid,json.materials.length);json.materials.push({name:material.name,pbrMetallicRoughness:{baseColorFactor:[...material.color.toArray(),1],metallicFactor:material.metalness,roughnessFactor:material.roughness},doubleSided:true});}
 const position=accessor(geometry.attributes.position,'VEC3',geometry.boundingBox),normal=accessor(geometry.attributes.normal,'VEC3');
 const indices=new Uint32Array(geometry.index.array),indexBytes=Buffer.from(indices.buffer);const indexView=json.bufferViews.push({buffer:0,byteOffset:byteLength,byteLength:indexBytes.length,target:34963})-1;chunks.push(indexBytes);byteLength+=indexBytes.length;const indexAccessor=json.accessors.push({bufferView:indexView,componentType:5125,count:indices.length,type:'SCALAR'})-1;
 const mesh=json.meshes.push({name,primitives:[{attributes:{POSITION:position,NORMAL:normal},indices:indexAccessor,material:materials.get(material.uuid)}]})-1;
 json.scenes[0].nodes.push(json.nodes.length);json.nodes.push({name,mesh,extras:extra});
}
json.buffers[0].byteLength=byteLength;let text=Buffer.from(JSON.stringify(json));text=Buffer.concat([text,Buffer.alloc((4-text.length%4)%4,32)]);let bin=Buffer.concat(chunks);bin=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+text.length+bin.length,8);header.writeUInt32LE(text.length,12);header.writeUInt32LE(0x4e4f534a,16);const bh=Buffer.alloc(8);bh.writeUInt32LE(bin.length,0);bh.writeUInt32LE(0x004e4942,4);fs.writeFileSync(outputPath,Buffer.concat([header,text,bh,bin]));
console.log('Merged CAD draw meshes:',output.length,'display segments:',segments,'switch caps:',capCount,'GLB bytes:',fs.statSync(outputPath).size);
