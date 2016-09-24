;(function(){
	//此处只有当html加载完成时才能找到myCanvas
	var myCanvas = document.getElementById('myCanvas');
	var c = myCanvas.getContext('2d');
	function clock(){
	c.clearRect(0,0,144,144);
		var data = new Date();
		var sec =data.getSeconds();
		var min =data.getMinutes();
		var hour=data.getHours();
		
		c.save();
		c.translate(72,72);
		c.rotate(-Math.PI/2);

		
		//画时针
		hour = hour>12?hour-12:hour;
	//		console.log(hour);
		c.beginPath();
		c.save();
		c.rotate(Math.PI/6*hour+Math.PI/6*min/60+Math.PI/6*sec/3600);
		c.strokeStyle = "#dfdede";
		c.lineWidth = 4 ;
		c.moveTo(-10,0);
		c.lineTo(25,0);
		c.stroke();
		c.restore();
		c.closePath();
		
		
		//画分针
	//		console.log(min);
		c.beginPath();
		c.save();
		c.rotate(Math.PI/30*min+Math.PI/30*sec/60);
		c.strokeStyle = "#dfdede";
		c.lineWidth = 3 ;
		c.moveTo(-10,0);
		c.lineTo(35,0);
		c.stroke();
		c.restore();
		c.closePath();
		
		
		//画秒针
		c.beginPath();
		c.save();
		c.rotate(Math.PI/30*sec);
		c.strokeStyle = "#e15671";
		c.lineWidth = 2 ;
		c.moveTo(-10,0);
		c.lineTo(45,0);
		c.stroke();
		c.restore();
		c.closePath();
		
		c.restore();
	}
	clock();
	setInterval(clock,1000);


})();