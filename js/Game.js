'use strict';


function runDemo(canvasId) {
	var canvas = document.getElementById(canvasId);
	var engine = new BABYLON.Engine(canvas, true);
	var objectif = [];
	var vie = 100;
	var score = 0;

	var lvl = document.getElementById('vieDevant');
		
	setInterval(()=>{
		vie--;
		console.log(vie,score);
		lvl.style.width = vie*6+"px";
		if(vie < 0)
			document.location.href="loose.html"; 
	}, 300);

	// Création de la scène
	var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
    
	// Ajout d'une caméra et de son contrôleur
    var camera = new BABYLON.FreeCamera("MainCamera", new BABYLON.Vector3(0, 2.5, 5), scene);
    camera.applyGravity = true;
    camera.checkCollisions = true;
	
	camera.speed = 0.5;
	camera.angularSensibility = 1000;
	
	camera.keysUp = [90]; // Touche Z
	camera.keysDown = [83]; // Touche S
	camera.keysLeft = [81]; // Touche Q
	camera.keysRight = [68]; // Touche D;
	scene.activeCamera.attachControl(canvas);
	
	// Ajout d'une lumière
	var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(1, 30, 0), scene);
	var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(20, 30, 0), scene);
	var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(-40, 30, 0), scene);
	var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(-40, -0, -20), scene);
	light.diffuse = new BABYLON.Color3(1, 1, 1);
	light.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
	light.intensity = 2.5;
	
	
	document.addEventListener("contextmenu", function (e) { e.preventDefault();	});
	
	// On ajoute une skybox
	createSkybox(scene);

	
	// Enfin la scène de démo
	createDemoScene(scene,objectif);	
	

	var weapon = BABYLON.Mesh.CreateBox("weapon", 1, scene);
	weapon.scaling = new BABYLON.Vector3(0.2, 0.2, 0.5);
	weapon.material = new BABYLON.StandardMaterial("wMaterial", scene);
	weapon.material.diffuseTexture = new BABYLON.Texture("../assets/images/ground.jpg", scene);
	weapon.position.x = 0.6;
	weapon.position.y = -0.3; //-0.1;
	weapon.position.z = 1; //0.4;
	weapon.parent = camera;

	var box = move();
	
	  camera.onCollide = function(collidedMesh) {
			var thevie = document.getElementById('score');

			if(camera.position.y < 2)
				camera.position = new BABYLON.Vector3(13,37,42);
				

			if(collidedMesh.uniqueId === box.uniqueId) {
				//set the new camera position
				thevie.innerHTML = score+1 +"pts";
				console.log("BRAVO");
				box.dispose();
				camera.position = new BABYLON.Vector3(13,37,42);
				box = move();
				score ++;
				if(vie < 100 && vie+5 < 100)
					vie+=2;
			}
	}
	
	// Lancement de la boucle principale
	engine.runRenderLoop(function() {
		
		scene.render();
	});
}

function getForwardVector(rotation) {
	var rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(rotation.y, rotation.x, rotation.z);
	var forward = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 1), rotationMatrix);
	return forward;
}

function createSkybox(scene) {
	// Création d'une material
	var sMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
	sMaterial.backFaceCulling = false;
	sMaterial.reflectionTexture = new BABYLON.CubeTexture("../textures/skybox", scene);
	sMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	
	// Création d'un cube avec la material adaptée
	var skybox = BABYLON.Mesh.CreateBox("skybox", 250, scene);
	skybox.material = sMaterial;
}

function move(scene){
	var boxMaterial = new BABYLON.StandardMaterial("bMaterial", scene);
	boxMaterial.diffuseTexture = new BABYLON.Texture("../assets/images/grounds.jpg", scene);
	var box = BABYLON.Mesh.CreateBox("box1", 3, scene);
		box.tag = "enemy";
		box.position = new BABYLON.Vector3(random(0, 50), 3 / 2, random(0, 50));
		box.material = boxMaterial;
		box.checkCollisions = true;
	return box;
}

function createDemoScene(scene,objectif) {
	// Création d'un sol
	var ground = BABYLON.Mesh.CreatePlane("ground", 150, scene);
	ground.rotation.x = Math.PI / 2;
	ground.material = new BABYLON.StandardMaterial("gMaterial", scene);
	ground.material.diffuseTexture = new BABYLON.Texture("../assets/images/ground.jpg", scene);
	ground.checkCollisions = true;
	
	// Et quelques cubes...
	var boxMaterial = new BABYLON.StandardMaterial("bMaterial", scene);
	boxMaterial.diffuseTexture = new BABYLON.Texture("../assets/images/ground.jpg", scene);
	
	var positions = [
		{ x: -15, z: 15 },
		{ x: -15, z: -15 },
		{ x: 15, z: 15 },
		{ x: 15, z: -15 }
	];
	
	
	var cubeSize = 2.5;
	
	for (var i = 0; i < 85; i++) {
		var box = BABYLON.Mesh.CreateBox("box1", cubeSize, scene);
		box.tag = "enemy";
		box.position = new BABYLON.Vector3(random(-70, 70), cubeSize / 2, random(-70, 70));
		box.material = boxMaterial;
		box.checkCollisions = true;
		objectif.push(box);
	}

}

function random(min, max) {
	return (Math.random() * (max - min) + min);
}



