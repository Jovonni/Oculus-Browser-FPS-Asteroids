function Projectile (type) {
	
    this.type = type;
    this.color = "red";
	
	
	
	
	this.createProjectile = (function(){
				
		console.log("Supposed to shoot");		
		
		var geometry = new THREE.SphereGeometry( 2, 32, 32 );
		
		//coreTextureSun
		var material = new THREE.MeshBasicMaterial( { emissive:0x505050, map: coreTextureShip, color: "red"} ); 

		var sphere = new THREE.Mesh( geometry, material );	
		//sphere.position.set(sunX + 10, sunY, sunZ + 10);
		
		//to stop
		//console.log(camera.position.x);
		
		
		sphere.position.set(camera.position.x,camera.position.y,camera.position.z);	
		//sphere.position.set(camera.quaternion._x,camera.quaternion._y,camera.quaternion._z);	
		//camera.quaternion
		
		var originPoint = sphere.position.clone();
		
		//collidableMeshList.push(sphere.position);	
			
		sphere.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
			
	    if(Math.random() > 0.5){
	      //this.speedVector = new THREE.Vector3(0, 0, Math.random() * 1.5 + 0.5);
	    } else {
	      //this.speedVector = new THREE.Vector3(Math.random() * 1.5 + 0.5, 0, 0);
	    }
	
		//var speedVector = new THREE.Vector3(5, -5, 5);
		//var speedVector = new THREE.Vector3(5, 10, 5);
		
	    //console.log(viewAngle);  
		
		//projectile attributes
		var vector = new THREE.Vector3( -1, -1, -15 );
		//Now, apply the same rotation to the vector that is applied to the camera:

		vector.applyQuaternion( camera.quaternion );
		
		//var speedVector = new THREE.Vector3(camera.quaternion._x, camera.quaternion._y, camera.quaternion._z);
		
		var speedVector = new THREE.Vector3(vector.x, vector.y, vector.z);

		
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

	    dataPackets.push({
	      obj: sphere,
	      speed: speedVector,
		  name: "projectile"
	    });	
		
		sphere.name = "projectile";	
		
	
		//core.push( sphere );
	
		scene.add( sphere );
		
		
		
		
	});
	
	
}
 
Projectile.prototype.getInfo = function() {
    
	
	
	return this.color + ' ' + this.type + ' apple';
	
	
	
};