

function EnnemyManager()
{
	this.initParameters();
}

EnnemyManager.prototype.initParameters = function() {
	this.timeBetweenEnnemy1 = 8000;
	this.timeBetweenEnnemy2 = 13000;
	this.timeBetweenEnnemy3 = 9000;
	this.timeSinceLastEnnemy1 = 0;
	this.timeSinceLastEnnemy2 = 0;
	this.timeSinceLastEnnemy3 = 0;
}

EnnemyManager.prototype.setParameters = function(elapsed) {
	var timeNow = new Date().getTime();
	var elapsed1 = timeNow - this.timeSinceLastEnnemy1;
	var elapsed2 = timeNow - this.timeSinceLastEnnemy2;
	var elapsed3 = timeNow - this.timeSinceLastEnnemy3;

	if(elapsed1 > this.timeBetweenEnnemy1)
	{
		for(i=0;i<13;i++)
		{
			x = generateRandomNumber(-1,1);
			addEnnemy("verticale", x, 2+i*0.4, textureEnnemy1);
		}
		this.timeSinceLastEnnemy1 = timeNow;
	} 

	if(elapsed2 > this.timeBetweenEnnemy2)
	{
		for(i=0;i<10;i++)
		{
			x = generateRandomNumber(-1,1);
			addEnnemy("verticale", x, 3+i*0.4, textureEnnemy2);
		}
		this.timeSinceLastEnnemy2 = timeNow;
	} 

	if(elapsed3 > this.timeBetweenEnnemy3)
	{
		for(i=0;i<15;i++)
		{
			x = generateRandomNumber(-1,1);
			addEnnemy("verticale", x, 3+i*0.4, textureEnnemy3);
		}
		this.timeSinceLastEnnemy3 = timeNow;
	} 
}

function generateRandomNumber(min,max) {
    var highlightedNumber = Math.random() * (max - min) + min;

    return highlightedNumber;
};
