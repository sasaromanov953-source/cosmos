(function(){
'use strict';
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============ hero photo ============ */
(function(){
  var img = document.getElementById('heroPhoto');
  if(!img) return;
  var real = HOTSPOT_IMAGES['hotspot_earth_everest'];
  img.src = real ? real.file : (TEXTURES.texture_earth || '');
})();

/* ============ reveal-on-scroll ============ */
(function(){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold:0.16, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  var compareEl = document.getElementById('compare');
  var io2 = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold:0.25});
  if(compareEl) io2.observe(compareEl);
})();

/* ============ geo helpers ============ */
function latLonToVec3(lat, lon){
  var phi = (90-lat) * Math.PI/180;
  var theta = (lon+180) * Math.PI/180;
  var x = -Math.sin(phi)*Math.cos(theta);
  var z = Math.sin(phi)*Math.sin(theta);
  var y = Math.cos(phi);
  return new THREE.Vector3(x,y,z);
}
function vec3ToLatLon(v){
  var n = v.clone().normalize();
  var lat = 90 - Math.acos(Math.max(-1,Math.min(1,n.y)))*180/Math.PI;
  var theta = Math.atan2(n.z, -n.x);
  var lon = theta*180/Math.PI - 180;
  if(lon < -180) lon += 360;
  if(lon > 180) lon -= 360;
  return {lat:lat, lon:lon};
}
function fmtCoord(lat, lon){
  var latS = Math.abs(lat).toFixed(1).replace('.',',') + '° ' + (lat>=0?'с.ш.':'ю.ш.');
  var lonS = Math.abs(lon).toFixed(1).replace('.',',') + '° ' + (lon>=0?'в.д.':'з.д.');
  return latS + ', ' + lonS;
}
var CONTINENTS = [
  {name:'Антарктида', test:function(lat){ return lat<=-60; }},
  {name:'Африка', test:function(lat,lon){ return lat>=-35&&lat<=37&&lon>=-18&&lon<=52; }},
  {name:'Европа', test:function(lat,lon){ return lat>=35&&lat<=71&&lon>=-25&&lon<=45; }},
  {name:'Азия', test:function(lat,lon){ return lat>=5&&lat<=77&&lon>=45&&lon<=180; }},
  {name:'Северная Америка', test:function(lat,lon){ return lat>=7&&lat<=83&&lon>=-168&&lon<=-52; }},
  {name:'Южная Америка', test:function(lat,lon){ return lat>=-56&&lat<=13&&lon>=-82&&lon<=-34; }},
  {name:'Австралия', test:function(lat,lon){ return lat>=-44&&lat<=-10&&lon>=112&&lon<=154; }}
];
function guessOcean(lon){
  if(lon>=-70 && lon<=20) return 'Атлантический океан';
  if(lon>20 && lon<=120) return 'Индийский океан';
  return 'Тихий океан';
}

/* ============ procedural texture fallback ============ */
function proceduralCanvas(planet){
  var W=2048,H=1024;
  var c=document.createElement('canvas'); c.width=W;c.height=H;
  var g=c.getContext('2d');
  var base = '#'+planet.color.toString(16).padStart(6,'0');
  function shade(hex, amt){
    var n = parseInt(hex.slice(1),16);
    var r=Math.min(255,Math.max(0,(n>>16)+amt));
    var gg=Math.min(255,Math.max(0,((n>>8)&255)+amt));
    var b=Math.min(255,Math.max(0,(n&255)+amt));
    return 'rgb('+r+','+gg+','+b+')';
  }
  if(planet.id==='earth'){
    g.fillStyle='#1c4f74'; g.fillRect(0,0,W,H);
    g.fillStyle='#2f6d8f'; g.fillRect(0,0,W,H); // ocean base
    var blobs=[[0.16,0.34,0.09],[0.20,0.55,0.08],[0.30,0.70,0.07],[0.52,0.28,0.10],[0.56,0.50,0.075],[0.62,0.72,0.05],[0.78,0.35,0.07],[0.88,0.62,0.05]];
    blobs.forEach(function(b){
      var cx=b[0]*W, cy=b[1]*H, r=b[2]*W;
      var grad=g.createRadialGradient(cx,cy,r*0.1,cx,cy,r);
      grad.addColorStop(0,'#4f7a3e'); grad.addColorStop(0.7,'#3f6a37'); grad.addColorStop(1,'rgba(63,106,55,0)');
      g.fillStyle=grad; g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.fill();
    });
    g.fillStyle='rgba(235,240,248,0.9)'; g.fillRect(0,0,W,H*0.06); g.fillRect(0,H*0.94,W,H*0.06);
  } else if(planet.kind==='gas'){
    var bands=14;
    for(var i=0;i<bands;i++){
      var y0=i*(H/bands), y1=(i+1)*(H/bands);
      var t=i/bands;
      var amt = ((i%2)?26:-18) + Math.round(Math.sin(t*9)*14);
      g.fillStyle = shade(base, amt);
      g.fillRect(0,y0,W,y1-y0+1);
    }
    for(var row=0; row<H; row+=2){
      var amp = 10*Math.sin(row*0.05)+6*Math.sin(row*0.017);
      g.save(); g.translate(amp,0);
      g.fillStyle='rgba(0,0,0,0.03)'; g.fillRect(0,row,W,2);
      g.restore();
    }
  } else {
    g.fillStyle=base; g.fillRect(0,0,W,H);
    for(var k=0;k<230;k++){
      var cx=Math.random()*W, cy=Math.random()*H, r=12+Math.random()*68;
      var grad=g.createRadialGradient(cx,cy,0,cx,cy,r);
      var dark = Math.random()>0.5;
      grad.addColorStop(0, dark?'rgba(0,0,0,0.22)':'rgba(255,255,255,0.14)');
      grad.addColorStop(1,'rgba(0,0,0,0)');
      g.fillStyle=grad; g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.fill();
    }
  }
  var img = g.getImageData(0,0,W,H);
  for(var p=0;p<img.data.length;p+=4){
    var n=(Math.random()-0.5)*10;
    img.data[p]+=n; img.data[p+1]+=n; img.data[p+2]+=n;
  }
  g.putImageData(img,0,0);
  return c;
}

/* ============ load real or procedural canvas per planet ============ */
function loadPlanetCanvas(planet){
  return new Promise(function(resolve){
    var src = TEXTURES[planet.textureKey];
    if(!src){ resolve(proceduralCanvas(planet)); return; }
    var img = new Image();
    img.onload = function(){
      var c = document.createElement('canvas');
      c.width = img.naturalWidth || 2048; c.height = img.naturalHeight || 1024;
      var g = c.getContext('2d');
      g.imageSmoothingEnabled = true;
      if(g.imageSmoothingQuality) g.imageSmoothingQuality = 'high';
      g.drawImage(img,0,0,c.width,c.height);
      resolve(c);
    };
    img.onerror = function(){ resolve(proceduralCanvas(planet)); };
    img.src = src;
  });
}

/* ============ three.js scene ============ */
var viewport = document.getElementById('stageViewport');
var glcanvas = document.getElementById('glcanvas');
var renderer = new THREE.WebGLRenderer({canvas:glcanvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
var DEFAULT_CAM_Z = 4.8;
camera.position.set(0,0,DEFAULT_CAM_Z);
camera.lookAt(0,0,0);

scene.add(new THREE.AmbientLight(0xffffff, 0.32));
var keyLight = new THREE.DirectionalLight(0xffffff, 1.65);
keyLight.position.set(4.2, 1.6, 3.6);
scene.add(keyLight);
var fillLight = new THREE.DirectionalLight(0x4d6fb0, 0.14);
fillLight.position.set(-4,-1.4,-3);
scene.add(fillLight);

function resize(){
  var rect = viewport.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width/rect.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

var ATMO_VERT = 'varying vec3 vNormal;\nvoid main(){\n  vNormal = normalize(normalMatrix*normal);\n  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);\n}';
var ATMO_FRAG = 'varying vec3 vNormal;\nuniform vec3 glowColor;\nvoid main(){\n  float intensity = pow(0.62 - dot(vNormal, vec3(0.0,0.0,1.0)), 2.6);\n  gl_FragColor = vec4(glowColor, 1.0) * clamp(intensity,0.0,1.0);\n}';

function makeStageMesh(){
  var geo = new THREE.SphereGeometry(1, 96, 96);
  var mat = new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.92, metalness:0.02, transparent:true, opacity:1});
  var mesh = new THREE.Mesh(geo, mat);
  var atmoGeo = new THREE.SphereGeometry(1.1, 64, 64);
  var atmoMat = new THREE.ShaderMaterial({
    vertexShader:ATMO_VERT, fragmentShader:ATMO_FRAG,
    uniforms:{glowColor:{value:new THREE.Color(0x8fd8ff)}},
    blending:THREE.AdditiveBlending, side:THREE.BackSide, transparent:true, depthWrite:false
  });
  var atmo = new THREE.Mesh(atmoGeo, atmoMat);
  var group = new THREE.Group();
  group.add(mesh); group.add(atmo);
  group.userData = {mesh:mesh, atmo:atmo, ring:null, rotY:0, rotX:0, autoDeg:0};
  scene.add(group);
  return group;
}
var stageA = makeStageMesh();
var stageB = makeStageMesh();
stageB.visible = false;

var ringTexture = (function(){
  var c = document.createElement('canvas'); c.width=512; c.height=48;
  var g = c.getContext('2d');
  var bands = [[0,0.10,'rgba(214,196,150,0.05)'],[0.10,0.20,'rgba(224,206,160,0.55)'],[0.20,0.27,'rgba(180,164,124,0.15)'],[0.27,0.5,'rgba(230,212,168,0.75)'],[0.5,0.56,'rgba(150,136,104,0.10)'],[0.56,0.82,'rgba(226,208,164,0.65)'],[0.82,0.92,'rgba(200,184,142,0.35)'],[0.92,1,'rgba(214,196,150,0.15)']];
  bands.forEach(function(b){ g.fillStyle=b[2]; g.fillRect(b[0]*512,0,(b[1]-b[0])*512,48); });
  var tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
})();
function remapRingUV(geo){
  var pos = geo.attributes.position;
  var uv = geo.attributes.uv;
  var v3 = new THREE.Vector3();
  for(var i=0;i<pos.count;i++){
    v3.fromBufferAttribute(pos,i);
    var r = v3.length();
    var inner = geo.parameters.innerRadius, outer = geo.parameters.outerRadius;
    uv.setXY(i, (r-inner)/(outer-inner), 1);
  }
}
function makeRingMesh(){
  var geo = new THREE.RingGeometry(1.35, 2.3, 96, 1);
  remapRingUV(geo);
  var mat = new THREE.MeshBasicMaterial({map:ringTexture, side:THREE.DoubleSide, transparent:true});
  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = Math.PI/2 - 0.42;
  return mesh;
}

/* ============ planet cache ============ */
var textureCache = {};   // id -> THREE.CanvasTexture
var canvasCache = {};    // id -> raw sampling canvas
var thumbCache = {};     // id -> small data-url for ghost thumbnails (real rendered mini-sphere)

/* small dedicated offscreen renderer for ghost thumbnails: a genuine mini render of the
   same lit sphere, not a flat map crop, so side planets read as real 3D bodies. */
var thumbCanvas = document.createElement('canvas');
thumbCanvas.width = 320; thumbCanvas.height = 320;
var thumbRenderer = new THREE.WebGLRenderer({canvas:thumbCanvas, antialias:true, alpha:true});
thumbRenderer.setPixelRatio(1);
thumbRenderer.setSize(320,320,false);
thumbRenderer.outputColorSpace = THREE.SRGBColorSpace;
thumbRenderer.toneMapping = THREE.ACESFilmicToneMapping;
thumbRenderer.toneMappingExposure = 1.05;
var thumbScene = new THREE.Scene();
var thumbCamera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
thumbCamera.position.set(0,0,4.6);
thumbCamera.lookAt(0,0,0);
thumbScene.add(new THREE.AmbientLight(0xffffff, 0.34));
var thumbKey = new THREE.DirectionalLight(0xffffff, 1.7);
thumbKey.position.set(3.4, 1.3, 3.2);
thumbScene.add(thumbKey);
var thumbGeo = new THREE.SphereGeometry(1, 64, 64);
var thumbMat = new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.92, metalness:0.02});
var thumbMesh = new THREE.Mesh(thumbGeo, thumbMat);
thumbScene.add(thumbMesh);
var thumbAtmoMat = new THREE.ShaderMaterial({
  vertexShader:ATMO_VERT, fragmentShader:ATMO_FRAG,
  uniforms:{glowColor:{value:new THREE.Color(0x8fd8ff)}},
  blending:THREE.AdditiveBlending, side:THREE.BackSide, transparent:true, depthWrite:false
});
var thumbAtmo = new THREE.Mesh(new THREE.SphereGeometry(1.1,48,48), thumbAtmoMat);
thumbScene.add(thumbAtmo);

function renderThumb(planet){
  thumbMesh.material.map = textureCache[planet.id];
  thumbMesh.material.needsUpdate = true;
  thumbMesh.rotation.set(0, -0.5, 0);
  thumbMesh.rotation.x = planet.axialTilt * Math.PI/180 * 0.35;
  thumbAtmo.material.uniforms.glowColor.value = new THREE.Color(planet.color);
  thumbRenderer.render(thumbScene, thumbCamera);
  try{ thumbCache[planet.id] = thumbCanvas.toDataURL('image/jpeg',0.86); }catch(e){ thumbCache[planet.id]=null; }
}

function preparePlanet(planet){
  return loadPlanetCanvas(planet).then(function(canvas){
    canvasCache[planet.id] = canvas;
    var tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    textureCache[planet.id] = tex;
    renderThumb(planet);
  });
}

/* ============ carousel state ============ */
var activeIndex = 2; // Earth
var current = stageA, incoming = stageB;
var transitioning = false;
var lastActive = 0; // ts of last interaction, for auto-rotate resume
var draggingNow = false;
var zoomed = false;

function applyPlanetVisual(group, planet){
  var mesh = group.userData.mesh;
  mesh.material.map = textureCache[planet.id];
  mesh.material.needsUpdate = true;
  group.userData.atmo.material.uniforms.glowColor.value = new THREE.Color(planet.color);
  group.rotation.x = planet.axialTilt * Math.PI/180 * 0.35;
  group.userData.rotY = group.rotation.y;
  if(group.userData.ring){ group.remove(group.userData.ring); group.userData.ring = null; }
  if(planet.hasRings){
    var ring = makeRingMesh();
    group.add(ring);
    group.userData.ring = ring;
  }
  group.userData.planet = planet;
}

function setTabsActive(planet){
  document.querySelectorAll('.ptab').forEach(function(btn){
    btn.classList.toggle('active', btn.dataset.id === planet.id);
  });
}

function renderCopy(planet){
  var el = document.getElementById('planetCopy');
  var statHtml = planet.stats.map(function(s){
    return '<div class="stat-cell"><div class="k">'+s[0]+'</div><div class="v">'+s[1]+'</div></div>';
  }).join('');
  var chipHtml = (planet.hotspots||[]).map(function(h,i){
    return '<button type="button" class="hchip" data-hi="'+i+'">'+h.label+'</button>';
  }).join('');
  el.innerHTML =
    '<div><span class="eyebrow"><span class="num">0'+planet.order+'</span> '+planet.dist+'</span>'+
    '<h2>'+planet.name+'</h2>'+
    '<p class="planet-epithet">'+planet.epithet+'</p>'+
    planet.paragraphs.map(function(p){return '<p>'+p+'</p>';}).join('')+
    '</div>'+
    '<div><div class="stat-grid">'+statHtml+'</div>'+
    '<div class="hotspot-chips">'+chipHtml+'</div></div>';
  el.querySelectorAll('.hchip').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(transitioning) return;
      var h = planet.hotspots[parseInt(btn.dataset.hi,10)];
      if(h.isRing){ openHotspot(planet, h, null); }
      else { openHotspot(planet, h, {lat:h.lat, lon:h.lon}); }
    });
  });
}

function updateGhosts(){
  var prev = PLANETS[(activeIndex-1+PLANETS.length)%PLANETS.length];
  var next = PLANETS[(activeIndex+1)%PLANETS.length];
  var gp = document.getElementById('ghostPrev'), gn = document.getElementById('ghostNext');
  gp.style.backgroundImage = thumbCache[prev.id] ? 'url('+thumbCache[prev.id]+')' : 'radial-gradient(circle at 35% 30%, '+prev.colorCss+', #05060B 75%)';
  gn.style.backgroundImage = thumbCache[next.id] ? 'url('+thumbCache[next.id]+')' : 'radial-gradient(circle at 35% 30%, '+next.colorCss+', #05060B 75%)';
  gp.title = prev.name; gn.title = next.name;
  gp.setAttribute('role','button'); gp.setAttribute('tabindex','0'); gp.setAttribute('aria-label','Перейти к: '+prev.name);
  gn.setAttribute('role','button'); gn.setAttribute('tabindex','0'); gn.setAttribute('aria-label','Перейти к: '+next.name);
  gp.onclick = function(){ goTo((activeIndex-1+PLANETS.length)%PLANETS.length, -1); };
  gn.onclick = function(){ goTo((activeIndex+1)%PLANETS.length, 1); };
  gp.onkeydown = function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); gp.onclick(); } };
  gn.onkeydown = function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); gn.onclick(); } };
}

function buildTabs(){
  var wrap = document.getElementById('planetTabs');
  wrap.innerHTML = '';
  PLANETS.forEach(function(p, i){
    var b = document.createElement('button');
    b.className = 'ptab'; b.type='button'; b.dataset.id = p.id;
    b.textContent = p.name;
    b.addEventListener('click', function(){ goTo(i, i>activeIndex?1:(i<activeIndex?-1:0)); });
    wrap.appendChild(b);
  });
}

function easeInOutCubic(t){ return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
function easeOutQuart(t){ return 1-Math.pow(1-t,4); }
function easeInOutSine(t){ return -(Math.cos(Math.PI*t)-1)/2; }

function goTo(index, dir){
  if(transitioning || index===activeIndex) return;
  if(zoomed) closeHotspot(true);
  transitioning = true;
  document.getElementById('dragHint').classList.add('hidden');
  var planet = PLANETS[index];
  applyPlanetVisual(incoming, planet);
  incoming.visible = true;
  incoming.position.x = dir>=0 ? 2.6 : -2.6;
  incoming.userData.opacity = 0;
  incoming.userData.mesh.material.opacity = 0;
  incoming.userData.atmo.material.opacity = 0;
  incoming.scale.setScalar(0.82);
  var outGroup = current;
  var startX0 = outGroup.position.x, startX1 = incoming.position.x;
  var spin = (dir>=0? -1:1) * 0.9;
  var t0 = performance.now();
  var dur = reduced ? 1 : 720;
  function step(ts){
    var t = Math.min(1,(ts-t0)/dur);
    var e = easeInOutCubic(t);
    var arc = Math.sin(t*Math.PI) * 0.16;
    outGroup.position.x = startX0 + (dir>=0?-2.6:2.6)*e;
    outGroup.position.y = -arc;
    outGroup.scale.setScalar(1 - e*0.18);
    if(!reduced) outGroup.rotation.y += spin*0.018;
    var outOp = 1-e;
    outGroup.userData.mesh.material.opacity = outOp;
    outGroup.userData.atmo.material.opacity = outOp*0.9;

    incoming.position.x = startX1*(1-e);
    incoming.position.y = -arc;
    incoming.scale.setScalar(0.82 + e*0.18);
    if(!reduced) incoming.rotation.y += spin*0.018;
    incoming.userData.mesh.material.opacity = e;
    incoming.userData.atmo.material.opacity = e*0.9;
    if(t<1){ requestAnimationFrame(step); }
    else {
      outGroup.visible = false;
      outGroup.position.set(0,0,0);
      outGroup.scale.setScalar(1);
      incoming.position.y = 0;
      incoming.scale.setScalar(1);
      current = incoming; incoming = outGroup;
      activeIndex = index;
      transitioning = false;
      setTabsActive(planet);
      renderCopy(planet);
      updateGhosts();
      document.getElementById('dragHint').classList.remove('hidden');
      lastActive = performance.now();
    }
  }
  requestAnimationFrame(step);
}

/* ============ pointer interaction: rotate + click-to-zoom ============ */
var raycaster = new THREE.Raycaster();
var pointerDown=false, downX=0, downY=0, lastX=0, lastY=0, moved=0;
glcanvas.addEventListener('pointerdown', function(e){
  if(transitioning || zoomed) return;
  pointerDown=true; moved=0;
  downX=lastX=e.clientX; downY=lastY=e.clientY;
  glcanvas.classList.add('grabbing');
  glcanvas.setPointerCapture(e.pointerId);
});
glcanvas.addEventListener('pointermove', function(e){
  if(!pointerDown) return;
  var dx = e.clientX-lastX, dy = e.clientY-lastY;
  moved += Math.abs(e.clientX-downX)+Math.abs(e.clientY-downY);
  lastX=e.clientX; lastY=e.clientY;
  current.rotation.y += dx*0.006;
  current.rotation.x = Math.max(-1.15, Math.min(1.15, current.rotation.x + dy*0.006));
  lastActive = performance.now();
});
function endDrag(e){
  if(!pointerDown) return;
  pointerDown=false;
  glcanvas.classList.remove('grabbing');
  if(moved < 6 && !transitioning && !zoomed){
    handleClick(e.clientX, e.clientY);
  }
}
glcanvas.addEventListener('pointerup', endDrag);
glcanvas.addEventListener('pointercancel', endDrag);

function handleClick(clientX, clientY){
  var rect = glcanvas.getBoundingClientRect();
  var ndc = new THREE.Vector2(
    ((clientX-rect.left)/rect.width)*2-1,
    -((clientY-rect.top)/rect.height)*2+1
  );
  raycaster.setFromCamera(ndc, camera);
  var targets = [current.userData.mesh];
  if(current.userData.ring) targets.push(current.userData.ring);
  var hits = raycaster.intersectObjects(targets, false);
  if(!hits.length) return;
  var hit = hits[0];
  var planet = current.userData.planet;

  if(hit.object === current.userData.ring){
    var ringHotspot = planet.hotspots.filter(function(h){return h.isRing;})[0];
    if(ringHotspot){ openHotspot(planet, ringHotspot, null); return; }
  }

  var point = hit.point.clone();
  var localDir = point.clone().applyMatrix4(new THREE.Matrix4().copy(current.matrixWorld).invert()).normalize();
  var geo = vec3ToLatLon(localDir);

  var best=null, bestDist=Infinity;
  (planet.hotspots||[]).forEach(function(h){
    if(h.isRing) return;
    var hv = latLonToVec3(h.lat, h.lon);
    var d = Math.acos(Math.max(-1,Math.min(1, hv.dot(localDir))));
    if(d<bestDist){ bestDist=d; best=h; }
  });
  if(best && bestDist < 0.40){
    openHotspot(planet, best, geo);
  } else {
    openGeneric(planet, geo);
  }
}

/* ============ hotspot / zoom panel ============ */
var panel = document.getElementById('hotspotPanel');
var hpImage = document.getElementById('hpImage');
var hpTitle = document.getElementById('hpTitle');
var hpCaption = document.getElementById('hpCaption');
var hpCoords = document.getElementById('hpCoords');
var hpCredit = document.getElementById('hpCredit');
document.getElementById('hpBack').addEventListener('click', function(){ closeHotspot(false); });
document.querySelector('.hp-media').addEventListener('click', function(){ closeHotspot(false); });

var DEFAULT_FOV = 34;
function zoomCamera(toClose, dirVec, cb){
  var startPos = camera.position.clone();
  var targetPos = toClose ? dirVec.clone().normalize().multiplyScalar(1.42) : new THREE.Vector3(0,0,DEFAULT_CAM_Z);
  var startFov = camera.fov;
  var targetFov = toClose ? 24 : DEFAULT_FOV;
  var t0 = performance.now();
  var dur = reduced ? 1 : (toClose ? 1300 : 850);
  function step(ts){
    var t = Math.min(1,(ts-t0)/dur);
    var e = toClose ? easeOutQuart(t) : easeInOutSine(t);
    camera.position.lerpVectors(startPos, targetPos, e);
    camera.fov = startFov + (targetFov-startFov)*e;
    camera.updateProjectionMatrix();
    camera.lookAt(0,0,0);
    if(t<1) requestAnimationFrame(step); else if(cb) cb();
  }
  requestAnimationFrame(step);
}

function cropZoomImage(planet, geo){
  var src = canvasCache[planet.id];
  if(!src) return null;
  var W=src.width, H=src.height;
  var u = geo ? ((geo.lon+180)/360) : 0.5;
  var v = geo ? ((90-geo.lat)/180) : 0.5;
  var cropW = W*0.30, cropH = H*0.30;
  var cx = u*W, cy = v*H;
  var out = document.createElement('canvas'); out.width=940; out.height=680;
  var g = out.getContext('2d');
  g.imageSmoothingEnabled = true;
  if(g.imageSmoothingQuality) g.imageSmoothingQuality = 'high';
  try{ g.filter = 'contrast(1.06) saturate(1.1) brightness(1.02)'; }catch(e){}
  var sx = cx-cropW/2, sy = Math.max(0, Math.min(H-cropH, cy-cropH/2));
  if(sx < 0){
    g.drawImage(src, W+sx, sy, -sx, cropH, 0,0, (-sx/cropW)*out.width, out.height);
    g.drawImage(src, 0, sy, cropW+sx, cropH, (-sx/cropW)*out.width,0, out.width-(-sx/cropW)*out.width, out.height);
  } else if(sx+cropW > W){
    var over = sx+cropW-W;
    g.drawImage(src, sx, sy, cropW-over, cropH, 0,0, out.width*((cropW-over)/cropW), out.height);
    g.drawImage(src, 0, sy, over, cropH, out.width*((cropW-over)/cropW),0, out.width*(over/cropW), out.height);
  } else {
    g.drawImage(src, sx, sy, cropW, cropH, 0,0, out.width, out.height);
  }
  g.filter='none';
  var vg = g.createRadialGradient(out.width/2,out.height/2,out.height*0.32,out.width/2,out.height/2,out.height*0.8);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.22)');
  g.fillStyle=vg; g.fillRect(0,0,out.width,out.height);
  return out.toDataURL('image/jpeg',0.92);
}

function classifyEarth(geo){
  for(var i=0;i<CONTINENTS.length;i++){
    if(CONTINENTS[i].test(geo.lat, geo.lon)) return {title:CONTINENTS[i].name, caption:'Участок суши где-то в этом регионе — точное место условно, координаты приблизительны.'};
  }
  var src = canvasCache['earth'];
  var isWater = true;
  if(src){
    var g = src.getContext('2d');
    var u=(geo.lon+180)/360, v=(90-geo.lat)/180;
    try{
      var px = g.getImageData(Math.min(src.width-1,Math.max(0,Math.floor(u*src.width))), Math.min(src.height-1,Math.max(0,Math.floor(v*src.height))),1,1).data;
      isWater = px[2] > px[0] && px[2] > 70;
    }catch(e){}
  }
  if(Math.abs(geo.lat)>65) return {title:'Полярный лёд', caption:'Приполярная область — ледяной покров и низкие температуры круглый год.'};
  if(isWater) return {title:guessOcean(geo.lon), caption:'Открытая вода — ближайшая суша в сотнях, а то и тысячах километров отсюда.'};
  return {title:'Суша', caption:'Участок суши где-то в этом регионе — точное место условно, координаты приблизительны.'};
}

function openGeneric(planet, geo){
  var title, caption;
  if(planet.id==='earth'){
    var c = classifyEarth(geo);
    title = c.title; caption = c.caption;
  } else if(planet.kind==='gas'){
    title = 'Облачный поток';
    caption = Math.abs(geo.lat)<15 ? 'Экваториальный пояс — самые быстрые струйные течения планеты.' : 'Средние широты — облачные полосы здесь текут медленнее, чем у экватора.';
  } else {
    title = 'Поверхность';
    caption = 'Типичный ландшафт планеты в этой точке — детального снимка именно отсюда пока нет.';
  }
  var img = cropZoomImage(planet, geo);
  showPanel(planet, {label:title, caption:caption, imageKey:null}, geo, img, null);
}

function openHotspot(planet, hotspot, clickGeo){
  var geo = hotspot.isRing ? clickGeo : {lat:hotspot.lat, lon:hotspot.lon};
  var real = HOTSPOT_IMAGES[hotspot.imageKey];
  var img = real ? real.file : cropZoomImage(planet, geo);
  showPanel(planet, hotspot, geo, img, real ? real.credit : null);
}

function showPanel(planet, hotspot, geo, imgSrc, credit){
  zoomed = true;
  hpTitle.textContent = hotspot.label;
  hpCaption.textContent = hotspot.caption;
  hpCoords.textContent = geo ? fmtCoord(geo.lat, geo.lon) : '';
  hpCredit.textContent = credit ? ('Фото: '+credit) : (planet.id==='earth' || planet.kind!=='gas' ? 'Реконструкция по данным текстуры поверхности' : 'Реконструкция по данным текстуры атмосферы');
  hpImage.src = imgSrc || '';
  var dirVec = geo ? latLonToVec3(geo.lat, geo.lon).applyQuaternion(current.quaternion) : new THREE.Vector3(0,0,1);
  zoomCamera(true, dirVec, function(){
    panel.classList.add('show');
  });
}

function closeHotspot(instant){
  panel.classList.remove('show');
  zoomed = false;
  if(instant){ camera.position.set(0,0,DEFAULT_CAM_Z); camera.lookAt(0,0,0); }
  else { zoomCamera(false, null, null); }
  lastActive = performance.now();
}

/* ============ hotspot DOM markers ============ */
var markerPool = [];
function ensureMarkers(n){
  while(markerPool.length < n){
    var el = document.createElement('div');
    el.className = 'hspot';
    viewport.appendChild(el);
    markerPool.push(el);
  }
}
function updateMarkers(){
  if(transitioning || zoomed){
    markerPool.forEach(function(m){ m.style.opacity = 0; });
    return;
  }
  var planet = current.userData.planet;
  if(!planet){ return; }
  var list = (planet.hotspots||[]).filter(function(h){return !h.isRing;});
  ensureMarkers(list.length);
  var rect = viewport.getBoundingClientRect();
  var camDir = new THREE.Vector3(); camera.getWorldDirection(camDir);
  for(var i=0;i<markerPool.length;i++){
    var m = markerPool[i];
    if(i>=list.length){ m.style.opacity=0; continue; }
    var h = list[i];
    var local = latLonToVec3(h.lat, h.lon);
    var world = local.clone().applyQuaternion(current.quaternion);
    var facing = world.dot(camDir.clone().negate());
    if(facing < 0.18){ m.style.opacity = 0; continue; }
    var proj = world.clone().project(camera);
    var x = (proj.x*0.5+0.5)*rect.width;
    var y = (1-(proj.y*0.5+0.5))*rect.height;
    m.style.left = x+'px'; m.style.top = y+'px';
    m.style.opacity = Math.min(1,(facing-0.18)*2.2);
    m.title = h.label;
  }
}

/* ============ main loop ============ */
function frame(ts){
  [stageA, stageB].forEach(function(g){
    if(!g.visible) return;
    var isActive = (g===current) && !transitioning && !zoomed && !draggingNow;
    if(isActive && !reduced && (ts-lastActive) > 1400){
      g.rotation.y += 0.0016;
    }
  });
  updateMarkers();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

/* ============ arrows ============ */
document.getElementById('prevBtn').addEventListener('click', function(){ goTo((activeIndex-1+PLANETS.length)%PLANETS.length, -1); });
document.getElementById('nextBtn').addEventListener('click', function(){ goTo((activeIndex+1)%PLANETS.length, 1); });

/* ============ init ============ */
buildTabs();
resize();
Promise.all(PLANETS.map(preparePlanet)).then(function(){
  var initial = PLANETS[activeIndex];
  applyPlanetVisual(stageA, initial);
  stageA.visible = true;
  setTabsActive(initial);
  renderCopy(initial);
  updateGhosts();
  document.getElementById('stageLoading').classList.add('hidden');
  lastActive = performance.now();
  requestAnimationFrame(frame);
}).catch(function(err){
  document.getElementById('stageLoading').textContent = 'Не удалось инициализировать сцену';
  console.error(err);
});

/* ============ sun section ============ */
(function(){
  document.getElementById('sunName').textContent = SUN.name;
  document.getElementById('sunEpithet').textContent = SUN.epithet;
  document.getElementById('sunParagraphs').innerHTML = SUN.paragraphs.map(function(p){return '<p>'+p+'</p>';}).join('');
  document.getElementById('sunStats').innerHTML = SUN.stats.map(function(s){
    return '<div class="stat-cell"><div class="k">'+s[0]+'</div><div class="v">'+s[1]+'</div></div>';
  }).join('');
  var imgWrap = document.getElementById('sunImages');
  SUN.images.forEach(function(im){
    var card = document.createElement('div');
    card.className = 'sun-img-card';
    var src = CONTENT_IMAGES[im.key] || '';
    card.innerHTML = '<img src="'+src+'" alt="'+im.label+'" loading="lazy"><div class="cap">'+im.label+'</div>';
    card.addEventListener('click', function(){
      openLightbox(src, 'Солнце', im.label, '', im.caption);
    });
    imgWrap.appendChild(card);
  });
})();

/* ============ moons section ============ */
(function(){
  var grid = document.getElementById('moonsGrid');
  MOONS.forEach(function(m){
    var src = CONTENT_IMAGES[m.image] || '';
    var card = document.createElement('div');
    card.className = 'moon-card';
    card.innerHTML =
      '<div class="thumb"><span class="of-badge">'+m.of+'</span><img src="'+src+'" alt="'+m.name+'" loading="lazy"></div>'+
      '<div class="body"><h3>'+m.name+'</h3><div class="fact">'+m.fact+'</div><p>'+m.epithet+'</p></div>';
    card.addEventListener('click', function(){
      openLightbox(src, 'Спутник '+m.of, m.name, m.epithet, m.fact);
    });
    grid.appendChild(card);
  });
})();

/* ============ beyond images ============ */
(function(){
  var plutoSrc = CONTENT_IMAGES['pluto_surface'];
  var kuiperSrc = CONTENT_IMAGES['kuiper_belt'];
  var plutoImg = document.getElementById('plutoImg');
  var kuiperImg = document.getElementById('kuiperImg');
  if(plutoSrc) plutoImg.src = plutoSrc;
  if(kuiperSrc) kuiperImg.src = kuiperSrc;
  document.getElementById('plutoCard').addEventListener('click', function(){
    openLightbox(plutoSrc, 'Карликовая планета', 'Плутон', 'Область Спутник — яркое ледяное сердце Плутона', 'Снимок New Horizons, 2015.');
  });
  document.getElementById('kuiperCard').addEventListener('click', function(){
    openLightbox(kuiperSrc, 'Окраина системы', 'Пояс Койпера', '', 'Концептуальный вид скопления ледяных тел за орбитой Нептуна.');
  });
})();

/* ============ lightbox ============ */
var lightbox = document.getElementById('lightbox');
function openLightbox(src, eyebrow, title, ep, text){
  document.getElementById('lightboxImg').src = src || '';
  document.getElementById('lightboxEyebrow').textContent = eyebrow || '';
  document.getElementById('lightboxTitle').textContent = title || '';
  var epEl = document.getElementById('lightboxEp');
  epEl.textContent = ep || '';
  epEl.style.display = ep ? '' : 'none';
  document.getElementById('lightboxText').textContent = text || '';
  lightbox.classList.add('show');
}
function closeLightbox(){ lightbox.classList.remove('show'); }
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLightbox(); });
})();
