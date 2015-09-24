var renderer, camera;
var scene, element;
var ambient, point;
var aspectRatio, windowHalf;
var mouse, time;

var controls;
var clock;

var useRift = false;

var riftCam;

var boxes = [];
var core = [];
var dataPackets = [];

var ground, groundGeometry, groundMaterial, coreTexture, boxTexture, floorTexture;

var sunX = -400;
var sunY = 500; 
var sunZ = 10;
var skyRotationX = 10;
var skyRotationY = 10;
var skyRotationZ = 10;
var skySpeed = 0.001;

var angularSpeed = 0.2; 
var lastTime = 0;


var bodyAngle;
var bodyAxis;
var bodyPosition;
var viewAngle;

var velocity;
var oculusBridge;



var theAsteroids, projectile;

var collidableMeshList = [];




// Map for key states
var keys = [];
for(var i = 0; i < 130; i++){
  keys.push(false);
}


function initScene() {
	
  clock = new THREE.Clock();
  mouse = new THREE.Vector2(0, 0);

  windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
  
  aspectRatio = window.innerWidth / window.innerHeight;
  
  scene = new THREE.Scene();  

  camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 10000);
  camera.useQuaternion = true;

  //original
  //camera.position.set(100, 150, 100);
  camera.position.set(0, 300, 1200);
  
  camera.lookAt(scene.position);

  // Initialize the renderer
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0xdbf7ff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //scene.fog = new THREE.Fog(0xdbf7ff, 300, 2000);

  element = document.getElementById('viewport');
  element.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera);
  
}


function initLights(){

  ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  point = new THREE.DirectionalLight( "black", 1, 0, Math.PI, 1 );
  point.position.set( -250, 250, 150 );
  
  scene.add(point);
  
  
  var spotLight = new THREE.SpotLight( "black" );
  
  spotLight.position.set( 100, 1000, 100 );

  spotLight.castShadow = true;

  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;

  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;
  spotLight.shadowDarkness = 1;

  scene.add( spotLight );
  
}




function initGeometry(){

  floorTexture = new THREE.ImageUtils.loadTexture( "textures/dirt.jpg" );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
  floorTexture.repeat.set( 50, 50 );
  floorTexture.anisotropy = 32;
  
  boxTexture = new THREE.ImageUtils.loadTexture( "textures/brick1.jpg" );
  coreTexture = new THREE.ImageUtils.loadTexture( "textures/purple_blue.jpg" );
  coreTextureShip = new THREE.ImageUtils.loadTexture( "textures/metal.jpg" );
  coreTextureSun = new THREE.ImageUtils.loadTexture( "textures/asteroid.jpg" ); //textures/asteroid.jpg
  coreTextureSky = new THREE.ImageUtils.loadTexture( "textures/sky.jpg" );
  //http://stemkoski.github.io/Three.js/images/lava.jpg
  

  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, transparent:false, opacity:0.90 } );
  var floorGeometry = new THREE.PlaneGeometry(2000, 2000, 10000, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  
  //collidableMeshList.push(floor);
  
  floor.material.side = THREE.DoubleSide;
  floor.rotation.x = -Math.PI / 2;

  scene.add(floor);

  // add some buildings.  
  for(var i = 0; i < 10; i++){
	  //createBuilding();
  }  

  for(var i = 0; i < 50; i++){
	  //createShips();
  }

  createAsteroids();
  createSky();
  
  //tester box
  //createBox();
  
}

function createBuilding(){
	
    var material = new THREE.MeshLambertMaterial({ emissive:0x505050, map: boxTexture, color: 0xffffff});
    
    var height = Math.random() * 450 + 10;
    var width = Math.random() * 100 + 2;
    
    var box = new THREE.Mesh( new THREE.CubeGeometry(width, height, width), material);

    box.position.set(Math.random() * 1000 - 500, height/2 ,Math.random() * 1000 - 500);
    box.rotation.set(0, Math.random() * Math.PI * 2, 0);
    
    boxes.push(box);
    scene.add(box);
}

//make asteroid
function createAsteroids(){
	
	
	theAsteroids = new Asteroid();
	theAsteroids.createAsteroid();
		
	
	//create base dummy particles, add it to scene
	theAsteroids.particleSystemInitiate();
	
	
	theAsteroids.createComet();
	
	
}


function createSky(){
	
				
				// load the cube textures
				var urlPrefix	= "textures/";
				var urls = [ urlPrefix + "blue_blue.jpg", 
							 urlPrefix + "blue_blue.jpg",
						     urlPrefix + "blue_blue.jpg", 
							 urlPrefix + "blue_blue.jpg",
						     urlPrefix + "blue_blue.jpg", 
							 urlPrefix + "blue_blue.jpg" ];
						
				var textureCube	= THREE.ImageUtils.loadTextureCube( urls );
	
				// init the cube shadder
				var shader = THREE.ShaderLib[ "cube" ];
				
				var uniforms	= THREE.UniformsUtils.clone( shader.uniforms );
				
				uniforms['tCube'].texture = textureCube;
				
				// build the skybox Mesh
				var geo = new THREE.CubeGeometry( 5000, 5000, 5000, 6, 6, 6, null, true );
				
				var material = new THREE.MeshBasicMaterial({
					fragmentShader	: shader.fragmentShader,
					vertexShader	: shader.vertexShader,
					uniforms	: uniforms,
					color: "#00FFFF",
					transparent:false, 
					opacity:0.1,
					map: coreTextureSky //uniforms['tCube'].texture
				});
				
				skyboxMesh	= new THREE.Mesh( geo, material );

				skyboxMesh.material.side = THREE.DoubleSide;
								
				skyboxMesh.overdraw = true;
				
			    skyboxMesh.rotation.set((Math.random() * Math.PI * 2) / 2, (Math.random() * Math.PI * 2) / 2, (Math.random() * Math.PI * 2) / 2);
										
				skyboxMesh.name = "sky";
				
				// add it to the scene
				core.push(skyboxMesh);
				scene.add( skyboxMesh );

				// ## End of the Skybox Code
	
}


//make floating box
function createBox(){
	
	
    var materialSquare = new THREE.MeshLambertMaterial({ emissive:0x505050, map: coreTexture, color: 0xffffff});
    
    var height = Math.random() * 100+30;
    
    var box = new THREE.Mesh( new THREE.CubeGeometry(height, height, height), materialSquare);

	//box.position.set(Math.random() * 1000 - 500, Math.random() * 150 - 300 ,Math.random() * 1000 - 500);
    box.position.set(0, 400 , Math.random() * 1000 - 500);
    box.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    
    core.push(box);
    scene.add(box);
	

}

//make little ships
function createShips(){
		
    var material = new THREE.MeshLambertMaterial({ emissive:0x505050, map: coreTextureShip, color: 0xffffff});
    
    var size = Math.random() * 15+3;
    
    //var box = new THREE.Mesh( new THREE.CubeGeometry(size, size*0.1, size*0.1), material);
	var box = new THREE.Mesh( new THREE.CubeGeometry(30, 15, 15), material);

    box.position.set(Math.random() * 1000 - 500, Math.random() * 100 + 100 , Math.random() * 1000 - 500);
    //box.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    
    var speedVector;
	
    if(Math.random() > 0.5){
      speedVector = new THREE.Vector3(0, 0, Math.random() * 1.5 + 0.5);
      box.rotation.y = Math.PI / 2;
    } else {
      speedVector = new THREE.Vector3(Math.random() * 1.5 + 0.5, 0, 0);
    }

    dataPackets.push({
      obj: box,
      speed: speedVector
    });
	
    scene.add(box);	

}



/////////INIT

function init(){

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);

  document.getElementById("toggle-render").addEventListener("click", function(){
    useRift = !useRift;
    onResize();
  });

  document.getElementById("help").addEventListener("click", function(){
    var el = document.getElementById("help-text");
    el.style.display = (el.style.display == "none") ? "" : "none";
  });

  window.addEventListener('resize', onResize, false);

  time          = Date.now();
  bodyAngle     = 0;
  bodyAxis      = new THREE.Vector3(0, 1, 0);
  bodyPosition  = new THREE.Vector3(0, 15, 500);
  velocity      = new THREE.Vector3();



  //////INIT EVERYTHING
  initScene();
  initGeometry();
  initLights();
  
  oculusBridge = new OculusBridge({
    "debug" : true,
    "onOrientationUpdate" : bridgeOrientationUpdated,
    "onConfigUpdate"      : bridgeConfigUpdated,
    "onConnect"           : bridgeConnected,
    "onDisconnect"        : bridgeDisconnected
  });
  oculusBridge.connect();

  riftCam = new THREE.OculusRiftEffect(renderer);
}


function onResize() {
  if(!useRift){
    windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    aspectRatio = window.innerWidth / window.innerHeight;
   
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
   
    renderer.setSize(window.innerWidth, window.innerHeight);
  } else {
    riftCam.setSize(window.innerWidth, window.innerHeight);
  }
}


function bridgeConnected(){
  document.getElementById("logo").className = "";
}

function bridgeDisconnected(){
  document.getElementById("logo").className = "offline";
}

function bridgeConfigUpdated(config){
  console.log("Oculus config updated.");
  riftCam.setHMD(config);      
}

function bridgeOrientationUpdated(quatValues) {

  // Do first-person style controls (like the Tuscany demo) using the rift and keyboard.

  // TODO: Don't instantiate new objects in here, these should be re-used to avoid garbage collection.

  // make a quaternion for the the body angle rotated about the Y axis.
  var quat = new THREE.Quaternion();
  quat.setFromAxisAngle(bodyAxis, bodyAngle);

  // make a quaternion for the current orientation of the Rift
  var quatCam = new THREE.Quaternion(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

  // multiply the body rotation by the Rift rotation.
  quat.multiply(quatCam);


  // Make a vector pointing along the Z axis and rotate it accoring to the combined look/body angle.
  var xzVector = new THREE.Vector3(0, 0, 1);
  xzVector.applyQuaternion(quat);

  // Compute the X/Z angle based on the combined look/body angle.  This will be used for FPS style movement controls
  // so you can steer with a combination of the keyboard and by moving your head.
  viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;

  // Apply the combined look/body angle to the camera.
  camera.quaternion.copy(quat);
  
  
  
}


function onMouseMove(event) {
  mouse.set( (event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
}


function onMouseDown(event) {
  // Stub
  floorTexture.needsUpdate = true;
  console.log("update.");
}


function onKeyDown(event) {

  if(event.keyCode == 48){ // zero key.
    useRift = !useRift;
    onResize();
  }

  // prevent repeat keystrokes.
  if(!keys[32] && (event.keyCode == 32)){ // Spacebar to jump
    velocity.y += 1.9;
  }

  keys[event.keyCode] = true;
}


function onKeyUp(event) {
  keys[event.keyCode] = false;
}


function updateInput(delta) {
  
    var step = 25 * delta;
    var turn_speed  = (55 * delta) * Math.PI / 180;
  
    //console.log("turn_speed");
  
    //console.log(viewAngle);  
	//var vector = new THREE.Vector3( 0, 0, -1 );
	//Now, apply the same rotation to the vector that is applied to the camera:

	//vector.applyQuaternion( camera.quaternion );
	//You can get the angle in radians to the target like so:

	//var angle = vector.angleTo( target.position );

  	// Forward/backward

  if(keys[87] || keys[38]){ // W or UP
      bodyPosition.x += Math.cos(viewAngle) * step;
      bodyPosition.z += Math.sin(viewAngle) * step;
  }

  if(keys[83] || keys[40]){ // S or DOWN
      bodyPosition.x -= Math.cos(viewAngle) * step;
      bodyPosition.z -= Math.sin(viewAngle) * step;
  }

  // Turn

  if(keys[81]){ // E
      bodyAngle += turn_speed;
  }   
  
  if(keys[69]){ // Q
       bodyAngle -= turn_speed;
  }

	
  // Straif

  if(keys[65] || keys[37]){ // A or LEFT
      bodyPosition.x -= Math.cos(viewAngle + Math.PI/2) * step;
      bodyPosition.z -= Math.sin(viewAngle + Math.PI/2) * step;
  }   
  
  if(keys[68] || keys[39]){ // D or RIGHT
      bodyPosition.x += Math.cos(viewAngle+Math.PI/2) * step;
      bodyPosition.z += Math.sin(viewAngle+Math.PI/2) * step;
  }
  

  // VERY simple gravity/ground plane physics for jumping.
  
  velocity.y -= 0.15;
  
  bodyPosition.y += velocity.y;
  
  if(bodyPosition.y < 15){
    velocity.y *= -0.12;
    bodyPosition.y = 15;
  }

  // update the camera position when rendering to the oculus rift.
  if(useRift) {
    camera.position.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);
  }
}



function animate() {
	
	
  var delta = clock.getDelta();
  time += delta;
  
  //rift & controls update
  updateInput(delta);
  
  
  
  //console.log(core[0].uuid);
  //console.log(core);
  
  
  
  theAsteroids.drawParticles();
  theAsteroids.moveAsteroid();
  
  theAsteroids.moveComet();
    
  if(theAsteroids.testCollision()){
	  
	  //theAsteroids.break();
	  
  }
  
  
  //rotations 
  for(var i = 0; i < core.length; i++){
	  
	if(core[i].name == "sky"){
		console.log("sky initiated");
    	core[i].rotation.x += delta * 0.025;
    	core[i].rotation.y -= delta * 0.033;
    	core[i].rotation.z += delta * 0.01278;
	}
	
	if(core[i].name == "asteroid"){
		
    	//core[i].rotation.x += delta * 0.25;
    	//core[i].rotation.y -= delta * 0.33;
    	//core[i].rotation.z += delta * 0.1278;
	}
	
  }
  
  
   
  

  var bounds = 1000; //600
 
   
  //move each back within bounds
  for(var i = 0; i < dataPackets.length; i++){
	  
    	dataPackets[i].obj.position.add( dataPackets[i].speed);
		
		if(dataPackets[i].name != "projectile"){
		
			
	    	if(dataPackets[i].obj.position.x < -bounds) {
	      	  dataPackets[i].obj.position.x = bounds;
	    	} else if(dataPackets[i].obj.position.x > bounds){
	      	  dataPackets[i].obj.position.x = -bounds;
	    	}
	
	    	if(dataPackets[i].obj.position.z < -bounds) {
	      	  dataPackets[i].obj.position.z = bounds;
	    	} else if(dataPackets[i].obj.position.z > bounds){
	      	  dataPackets[i].obj.position.z = -bounds;
	    	}
	
	    	if(dataPackets[i].obj.position.y < -bounds) {
	      	  dataPackets[i].obj.position.y = bounds;
	    	} else if(dataPackets[i].obj.position.y > bounds){
	      	  dataPackets[i].obj.position.y = -bounds;
	    	}
			
	
		}else if(dataPackets[i].name == "projectile"){
			
			//if a missile hits the bounds, remove it
			
	    	if(dataPackets[i].obj.position.x < -bounds) {
	      	  scene.remove(dataPackets[i].obj);
	    	} else if(dataPackets[i].obj.position.x > bounds){
	      	  scene.remove(dataPackets[i].obj);
	    	}
	
	    	if(dataPackets[i].obj.position.z < -bounds) {
	      	  scene.remove(dataPackets[i].obj);
	    	} else if(dataPackets[i].obj.position.z > bounds){
	      	  scene.remove(dataPackets[i].obj);
	    	}
	
	    	if(dataPackets[i].obj.position.y < -bounds) {
	      	  scene.remove(dataPackets[i].obj);
	    	} else if(dataPackets[i].obj.position.y > bounds){
	      	  scene.remove(dataPackets[i].obj);
	    	} else if(dataPackets[i].obj.position.y > bounds && bodyPosition.y > bounds){
	      	  //scene.remove(dataPackets[i].obj);
			  console.log("He up there shooting");
	    	}
			
		}
	
  }

  
  if(render()){
    requestAnimationFrame(animate);  
  }
}

function crashSecurity(e){
  oculusBridge.disconnect();
  document.getElementById("viewport").style.display = "none";
  document.getElementById("security_error").style.display = "block";
}

function crashOther(e){
  oculusBridge.disconnect();
  document.getElementById("viewport").style.display = "none";
  document.getElementById("generic_error").style.display = "block";
  document.getElementById("exception_message").innerHTML = e.message;
}

function render() { 
  try{
    if(useRift){
      riftCam.render(scene, camera);
    }else{
      controls.update();
      renderer.render(scene, camera);
    }  
  } catch(e){
    console.log(e);
    if(e.name == "SecurityError"){
      crashSecurity(e);
    } else {
      crashOther(e);
    }
    return false;
  }
  return true;
}


window.onload = function() {
  init();
  animate();
}