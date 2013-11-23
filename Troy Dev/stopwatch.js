//Credit for code goes to http://mrbool.com/how-to-create-a-stopwatch-in-javascript/26613#ixzz2lUnZeCbA
var c=0;
var t;
function stopCount() {
	clearTimeout(t);
	c = 0;
}
function timedCount() {	
	document.getElementById('timeOutput').value=c;
	c=c+1;	
	t=setTimeout("timedCount()",1000);
}
