var EnnemyShader;
var timeBetweenUpdate = 200;

function initEnnemyShader() {
	EnnemyShader = initShaders("ennemy-vs","ennemy-fs");
    
    // active ce shader
    gl.useProgram(EnnemyShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    EnnemyShader.vertexPositionAttribute = gl.getAttribLocation(EnnemyShader, "aVertexPosition");
    gl.enableVertexAttribArray(EnnemyShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    EnnemyShader.vertexCoordAttribute = gl.getAttribLocation(EnnemyShader, "aVertexCoord");
    gl.enableVertexAttribArray(EnnemyShader.vertexCoordAttribute);

     // adresse de la variable uniforme uOffset dans le shader
    EnnemyShader.positionUniform = gl.getUniformLocation(EnnemyShader, "uPosition");
    EnnemyShader.maTextureUniform = gl.getUniformLocation(EnnemyShader, "uMaTexture");
}

function Ennemy() {
	this.initParameters();

	// cree un nouveau buffer sur le GPU et l'active
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

	// un tableau contenant les positions des sommets (sur CPU donc)
	var wo2 = 0.5*this.width;
	var ho2 = 0.5*this.height;

	var vertices = [
		-wo2,-ho2, -0.5,
		 wo2,-ho2, -0.5,
		 wo2, ho2, -0.5,
		-wo2, ho2, -0.5
	];

	// on envoie ces positions au GPU ici (et on se rappelle de leur nombre/taille)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = 4;
		
	// meme principe pour les couleurs
	this.coordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
	var coords = [
		 0.0, 0.0, 
		 1.0, 0.0, 
		 1.0, 1.0, 
		 0.0, 1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
	this.coordBuffer.itemSize = 2;
	this.coordBuffer.numItems = 4;
	
	// creation des faces du cube (les triangles) avec les indices vers les sommets
	this.triangles = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	var tri = [0,1,2,0,2,3];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
    this.triangles.numItems = 6;
    

}

Ennemy.prototype.hitbox = function() {
	return {"x" : this.position[0], "y" : this.position[1], "width" : this.width, "height" : this.height};
}

Ennemy.prototype.setTypeCourbe = function(typeCourbe) {
	this.typeCourbe = typeCourbe;
}

//Etat d'un ennmi 
// 0 = normal
// 1 = explosion
// 2 = mort
Ennemy.prototype.initParameters = function() {
	this.width = 0.2;
	this.height = 0.2;
	this.typeCourbe="verticale";
	this.texture = null;
	this.state = 0;
	this.idExplosion = 0;
	this.timeSinceLastUpdate = 0;
	this.position = [0.0,0.0];
}

Ennemy.prototype.setTexture = function(texture) {
	this.texture = texture;
}

Ennemy.prototype.getTexture = function(texture) {
	return this.texture;
}

Ennemy.prototype.updateState = function(state) {
	this.state = state;
}

Ennemy.prototype.setParameters = function(elapsed) {
	switch(this.state)
	{
		case 0:
			this.deplacer(elapsed);
			break;
		case 1:
			this.manageExplosion(elapsed);
			break;
		case 2:
			break;
	}
}

Ennemy.prototype.manageExplosion = function(elapsed){
    var timeNow = new Date().getTime();
	var elapsed = timeNow - this.timeSinceLastUpdate;

	if(elapsed > timeBetweenUpdate)
	{
		if(this.idExplosion < 2)
		{	
			this.setTexture(textureExplosion);
			this.timeSinceLastUpdate = elapsed;
		}
		else
			this.updateState(2);

		this.idExplosion++;
	}
}

Ennemy.prototype.deplacer = function(elapsed) {
	if(this.typeCourbe == "verticale")
	{
		this.position[1] -= elapsed/1000;
	}
	else if(this.typeCourbe == "cos")
	{
		this.position[0] +=  0.02;
		this.position[1] -= Math.cos(this.position[0]);
	}
	else if(this.typeCourbe == "droite")
	{

	}
}

Ennemy.prototype.setPosition = function(x,y) {
	this.position = [x,y];
}

Ennemy.prototype.getPosition = function() {
	return this.position;
}

Ennemy.prototype.shader = function() {
	return EnnemyShader;
}

Ennemy.prototype.sendUniformVariables = function() {
	gl.uniform2fv(EnnemyShader.positionUniform,this.position);
}

Ennemy.prototype.draw = function() {
	// active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(EnnemyShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// active le buffer de coords
	gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
	gl.vertexAttribPointer(EnnemyShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// dessine les buffers actifs
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
	gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
}


