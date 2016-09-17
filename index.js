var mask = document.getElementById("mask");
var handle = document.getElementById("handle");
var changeBox = document.getElementById("change_box");


document.getElementById("btnclick").onclick = function (){
	mask.style.display = "block";
	handle.style.display = "block";
}
document.getElementById("td1").onclick = function (){
	changeBox.style.backgroundColor = "red";
}
document.getElementById("background2").onclick = function (){
	changeBox.style.backgroundColor = "yellow";
}
document.getElementById("background3").onclick = function (){
	changeBox.style.backgroundColor = "pink";
}
document.getElementById("width1").onclick = function (){
	changeBox.style.width = "200px";
}
document.getElementById("width2").onclick = function (){
	changeBox.style.width = "300px";
}
document.getElementById("width3").onclick = function (){
	changeBox.style.width = "400px";
}
document.getElementById("height1").onclick = function (){
	changeBox.style.height = "200px";
}
document.getElementById("height2").onclick = function (){
	changeBox.style.height = "300px";
}
document.getElementById("height3").onclick = function (){
	changeBox.style.height = "400px";
}
document.getElementById("but1").onclick = function (){
	changeBox.style.width = "100px";
	changeBox.style.height = "100px";
	changeBox.style.backgroundColor = "#fff";
}
document.getElementById("but2").onclick = function (){
	mask.style.display = "none";
	handle.style.display = "none";
}