//Credit for code goes to http://mrbool.com/how-to-create-a-stopwatch-in-javascript/26613#ixzz2lUnZeCbA
var c=0;
var t = null;
function stopCount() {
	clearTimeout(t);
	c = 0;
}
<<<<<<< HEAD
function timedCount() {
	var el = document.getElementById("timeOutput");
	el.firstChild.data = c;
=======
function timedCount() {	
	document.getElementById('timeOutput').firstChild.data =c;
>>>>>>> Fixing timer bug, adding color support
	c=c+1;
	t=setTimeout("timedCount()",1000);
}
