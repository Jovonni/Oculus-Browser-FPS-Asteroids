function Asteroid (type) {
	
	
    this.type = type;
    this.color = "red";
	
	this.asteroidStartingx = 0;
	this.asteroidStartingy = 1000;
	this.asteroidStartingz = -1000;
	this.cometStartingx = 0;
	this.cometStartingy = 1000;
	this.cometStartingz = -1000;
	this.cometFallingy;
	this.sphere;
	this.sphereState;
	this.comet;
	this.cometState;
	this.originPoint;
	this.customUniforms;
	this.speedVector;
	this.speedVectorAsteroid;
	
    this.delta = clock.getDelta();
	
	this.particleSystem;
	this.particleSystemx;
	this.colors = [];
	this.start_breaking;
	
	
	this.setSpeedVector = (function(){
		
				
		
		this.speedVector = new THREE.Vector3( this.randomIntFromInterval(-2,2) , -5, this.randomIntFromInterval(3,5) );
		
		this.speedVectorAsteroid = new THREE.Vector3( 1, -1, 1);
		
		
		///gotta figure out for auto asteroid targeted attack
		/*var vector = new THREE.Vector3( 0, -5, 5 );
		//Now, apply the same rotation to the vector that is applied to the camera:
		
		var playerPosition = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
		
		var asteroidPosition = new THREE.Vector3(this.asteroidStartingx,this.asteroidStartingy,this.asteroidStartingz);
		
		var theCalculatedVector = this.getVectorForAsteroidAim(playerPosition, asteroidPosition);

		//console.log(theCalculatedVector);
		theCalculatedVector.applyQuaternion( this.sphere.quaternion );
		
		
		//camera.position.x,camera.position.y,camera.position.z
		//this.speedVector = new THREE.Vector3(vector.x, vector.y, vector.z);
		this.speedVector = new THREE.Vector3(theCalculatedVector.x,theCalculatedVector.y,theCalculatedVector.z);
		
		console.log(this.speedVector);*/
		
		
	});
	
	
	this.getVectorForAsteroidAim = (function(pv,av){
		
		
		var x = pv.x - av.x;
		var y = pv.y - av.y;
		var z = pv.z - av.z;
		
		var v = new THREE.Vector3(x, y, z);
				
		return v;
		
	});
	
	this.createAsteroid = (function(){
				
		this.sphereState = 0; //created
		
		var geometry = new THREE.SphereGeometry( 500, 32, 32 );

		//coreTextureSun
		var material = new THREE.MeshBasicMaterial( { emissive:0x505050, map: coreTextureSun, color: "orange"} ); 

		this.sphere = new THREE.Mesh( geometry, material );	
		//sphere.position.set(sunX + 10, sunY, sunZ + 10);
		
		//to stop
		this.sphere.position.set(this.asteroidStartingx, this.asteroidStartingy, this.asteroidStartingz);	
		
		this.originPoint = this.sphere.position.clone();
		
		//collidableMeshList.push(this.sphere.position);	
			
		this.sphere.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
			
	    if(Math.random() > 0.5){
	      //this.speedVector = new THREE.Vector3(0, 0, Math.random() * 1.5 + 0.5);
	    } else {
	      //this.speedVector = new THREE.Vector3(Math.random() * 1.5 + 0.5, 0, 0);
	    }
		
		this.setSpeedVector();
		
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

	    /*dataPackets.push({
	      obj: this.sphere,
	      speed: this.speedVector,
		  objname: "asteroid"
	    });*/	
		
		this.sphere.name = "asteroid";	
		
	
		//core.push( this.sphere );
	
		scene.add( this.sphere );
		
	
		
	});
	
	
	this.moveAsteroid = (function(){
		
		
		var fallSpeed = 0.275;
		var angularSpeed = 0.098;
		
		//main particle system
		this.sphere.rotation.y += angularSpeed;
		//this.sphere.position.y -= fallSpeed;
		//this.sphere.position.z += fallSpeed;
		
		//this.sphere.position.add(this.speedVectorAsteroid);

		
		if(this.sphere.position.y <= 50 && this.sphere.position.y >= 20){
			//this.start_breaking = 1;
			scene.remove(this.sphere);
		}

		
		
	});
	
	
	this.createComet = (function(){
				
		this.cometState = 0; //created
		//get new vector
		this.setSpeedVector();
		
		var geometry = new THREE.SphereGeometry( 50, 32, 32 );

		//coreTextureSun
		var material = new THREE.MeshBasicMaterial( { emissive:0x505050, map: coreTextureSun, color: "orange"} ); 

		
		this.comet = new THREE.Mesh( geometry, material );	
		//sphere.position.set(sunX + 10, sunY, sunZ + 10);
		
		//to stop
		this.comet.position.set(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z);	
		
		this.originPoint = this.comet.position.clone();
		
		//collidableMeshList.push(this.comet.position);	
			
		this.comet.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
			
	    if(Math.random() > 0.5){
	      //this.speedVector = new THREE.Vector3(0, 0, Math.random() * 1.5 + 0.5);
	    } else {
	      //this.speedVector = new THREE.Vector3(Math.random() * 1.5 + 0.5, 0, 0);
	    }
	
		//this.speedVector = new THREE.Vector3(5, -5, 5);
		//this.speedVector = new THREE.Vector3(0, 0, 0);
		
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

	    /*dataPackets.push({
	      obj: this.sphere,
	      speed: this.speedVector,
		  objname: "asteroid"
	    });*/	
		
		this.comet.name = "comet";	
		
	
		//core.push( this.sphere );
	
		scene.add( this.comet );
		
	
		
	});
	
	
	this.moveComet = (function(){
		
		
		var fallSpeed = 3.275;
		var angularSpeed = 0.098;

		//main particle system
		this.comet.rotation.y += angularSpeed;
		//this.comet.position.y -= fallSpeed;
		//this.comet.position.z += fallSpeed;
		
		this.comet.position.add(this.speedVector);
		
		//this.sphere.position.y -= fallSpeed;

		
		if(this.comet.position.y <= 50 && this.comet.position.y >= 20){
			this.start_breaking = 1;
			this.cometState = 1; //broken
			
			scene.remove(this.comet);
			
		}
		
		
		if(this.start_breaking){
			
						
		}
		
		
	});
	
		
	
	
	this.particleSystemInitiate = (function(){
		
		this.start_breaking = 0;
		
		var geometry = new THREE.SphereGeometry(50, 32, 32);
		
		
		for( var i = 0; i < geometry.vertices.length; i++){
			
			this.colors[i] = new THREE.Color();
			//this.colors[i].setRGB(Math.random(), Math.random(), Math.random());
			
		}
		
		geometry.colors = this.colors;
		
		material = new THREE.ParticleBasicMaterial({
			size: 4,
			vertextColors: true,
			map:coreTextureSun
		});		
		
		this.particleSystem = new THREE.ParticleSystem(geometry,material);
		this.particleSystem.position.y = this.sphere.position.y;
		this.particleSystem.position.z = this.sphere.position.z;
		this.particleSystem.position.x = this.sphere.position.x;
		
		
		
		
		//this.particleSystem.sortParticles = true;		
		
	    /*dataPackets.push({
	      obj: this.particleSystem,
	      speed: this.speedVector,
		  objname: "particle"
	    });	*/
		
		this.particleSystem.name = "particle";	
		
		//core.push( this.particleSystem );				
		
		scene.add(this.particleSystem);		
		
		this.break();		
		
	});
	
	this.drawParticles = (function(){
		
		//draw them per render loop 
		
		var fallSpeed = 3.275;
		var angularSpeed = 0;
		
		
		
		
		//main particle system
		//this.particleSystem.rotation.y += angularSpeed;
		//this.particleSystem.position.y -= fallSpeed;
		//this.particleSystem.position.z += fallSpeed;
		this.particleSystem.position.add(this.speedVector);
		
		
		
		
		//////////collision
		
		//collidableMeshList.push(this.sphere.position);
		//collidableMeshList.push(this.comet.position);
		//collidableMeshList.push(this.particleSystem.position);
		//collidableMeshList.push(this.particleSystemx.position);
		
		/*********** COLLIDER
		var originPoint = new THREE.Vector3(this.cometStartingx,this.cometStartingy,this.cometStartingz);
		
		for (var vertexIndex = 0; vertexIndex < this.comet.geometry.vertices.length; vertexIndex++){
					
				var localVertex = this.comet.geometry.vertices[vertexIndex].clone();
				var globalVertex = localVertex.applyMatrix4( this.comet.matrix );
				var directionVector = globalVertex.sub( this.comet.position );
		
				var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
				var collisionResults = ray.intersectObjects( collidableMeshList );
				
				if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
					console.log(" Hit ");
				}
				
				
			}	
		
		*/
		
		//end COLLIDER
		
		
		
		//////////////end collision
		
		
		//add another
		this.addAnotherComet();
		
		
		
		
	});
	
	
	
	
	
	this.addAnotherComet = (function(){
		
	
		
		//draw them per render loop 
	
		var fallSpeed = 3.275;
		var angularSpeed = 0.00;
	
		//duplicate particle system
		this.particleSystemx.rotation.y += angularSpeed;
		//this.particleSystemx.position.y -= fallSpeed;
		//this.particleSystemx.position.z += fallSpeed;
		this.particleSystemx.position.add(this.speedVector);
	
	
	
		if(this.start_breaking){
		
		
			//when started to break, this fires off repeatedly
			scene.remove(this.particleSystem);
			
			//this.particleSystemInitiate();
			//this.createParticles();
			
			var vertices = this.particleSystemx.geometry.vertices;
		
			vertices.forEach(function(v){
				v.y -= v.vy;
				v.x -= v.vx;
				v.z -= v.vz;
			});
		
					
		}
		
				
		
		if(this.particleSystemx.position.z > 600 /*|| this.particleSystemx.position.x > 600*/){ //600	
			//console.log(controls.center);		
			this.reset();	
			console.log("End of animation");
		}
		
		/*
		USER CONTROLS
		autoRotate: false
		autoRotateSpeed: 2
		center: THREE.Vector3
		domElement: document
		enabled: true
		keys: Object
		maxDistance: 7000
		maxPolarAngle: 3.141592653589793
		minDistance: 0
		minPolarAngle: 0
		object: THREE.PerspectiveCamera
		pan: function ( distance ) {
		rotateDown: function ( angle ) {
		rotateLeft: function ( angle ) {
		rotateRight: function ( angle ) {
		rotateUp: function ( angle ) {
		update: function () {
		userPan: true
		userPanSpeed: 2
		userRotate: true
		userRotateSpeed: 1
		userZoom: true
		userZoomSpeed: 1
		zoomIn: function ( zoomScale ) {
		zoomOut: function ( zoomScale ) {
		__proto__: Object
		*/
	
	
		//to reset particles & bring together
		if(this.particleSystem.position.y <= 30){
		
		
			this.start_breaking = 1;

		
		}
		
		
	});
	
	
	this.reset = (function(){
		
		
		this.particleSystem.position.y = this.sphere.position.y;
		this.particleSystem.position.z = this.sphere.position.z;
		this.particleSystem.position.x = this.sphere.position.x;
		scene.remove(this.particleSystemx);
		//this.particleSystemx.position.y = this.sphere.position.y;
		//this.particleSystemx.position.z = this.sphere.position.z;
		//this.particleSystemx.position.x = this.sphere.position.x;
		
		//this.start_breaking = 0;
		theAsteroids.particleSystemInitiate();
		theAsteroids.createComet();
		console.log("Reset comet");
		this.break();
		
		
	});
	
	
	//one time
	this.break = (function(){
		
		console.log("Particles Seperated");
		
		///////
		var fallSpeed = 3.275;
		//var angularSpeed = 0.098;
		
		var geomx = new THREE.Geometry();
		
		geomx.colors = this.colors;
		
		var materials = new THREE.ParticleBasicMaterial({
			size: 8,
			vertextColors:true,
			//map:coreTextureSun
		});
				
				
		var particleSystemx = new THREE.ParticleSystem(geomx,material);
		this.particleSystemx = particleSystemx;
				
		
		
		
		//to stay in middle
		if(particleSystemx.position.y <= 50 && particleSystemx.position.y >= 20){
			particleSystemx.position.y = 0;
			particleSystemx.position.x = 0;
			particleSystemx.position.z = 0;
		}else{
			particleSystemx.position.y = this.particleSystem.position.y;
			particleSystemx.position.x = this.particleSystem.position.x;
			particleSystemx.position.z = this.particleSystem.position.z;
		}
		
		particleSystemx.sortParticles = true;
		
		
		var verticesx = this.particleSystem.geometry.vertices;
		
		var speedV = this.speedVector;
		
		verticesx.forEach(function(p){
			
			var particle = new THREE.Vector3(
				p.x * 1.0,
				p.y * 1.0,
				p.z * 1.0
			);
		
			geomx.vertices.push(particle);	
			
			//particle.vy = Math.random() * 0.5 - 3.75;					
			//particle.vx = Math.random() * 0.2 - .1;
			//particle.vz = Math.random() * 0.2 - .1;
			
			//particle.vy = Math.random() * 5.1 - 6.2;
			//particle.vx = 0;
			//particle.vz = Math.random() * 4.2 - .1;
			
			
			this.cometFallingy = particle.y;
			//particle.vy = Math.random() * 7.8 - 5;
			
			//console.log(this.speedVector);
			
			var svx = speedV.x;
			var svy = speedV.y;
			var svz = speedV.z;
			
			//console.log(svy);
			
			if(particle.y <= 0){
				particle.vy = Math.random() * 0.01 + svy;//Math.random() * 5.1 - 7.5
				particle.vx = (Math.random() - .5) * 10;//(Math.random() - .5) * 10
				particle.vz = (Math.random() - .5) * 10;//(Math.random() - .5) * 10
			} else {
				particle.vy = Math.random() * 5.1 - (svy * -1);//Math.random() * 5.1 - 6.2
				particle.vx = 0; //0
				particle.vz = Math.random() * 4.2 - .1; //Math.random() * 4.2 - .1
			}
								
			//particle.vx = Math.random() * 4.2 - .5;
			
			
			
			
		});
				
		
	   /*dataPackets.push({
	      obj: this.particleSystemx,
	      speed: this.speedVector,
		  objname: "particle2"
	    });*/
		
		particleSystemx.name = "particle2";	
		
		//core.push( this.particleSystemx );	

		
		scene.add(particleSystemx);
		
		
		//////
		
				
	});
	
	
	this.testCollision = (function(){
		
		if(this.sphere.position.y < 0 ){
			return true;
		}else{
			return false;
		}
				
	});
	

	
	this.randomIntFromInterval = (function(min,max){
    	return Math.floor(Math.random()*(max-min+1)+min);
	});
	



	
}
 
Asteroid.prototype.getInfo = function() {
    
	
	
	return this.color + ' ' + this.type + ' apple';
	
	
	
};