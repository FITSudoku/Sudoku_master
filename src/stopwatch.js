//Credit for code goes to http://mrbool.com/how-to-create-a-stopwatch-in-javascript/26613#ixzz2lUnZeCbA
var c=0;
var t = null;
function stopCount() {
	clearTimeout(t);
	c = 0;
}
function timedCount() {	
    c=c+1;
	document.getElementById('timeOutput').firstChild.data = c;
	t=setTimeout("timedCount()",1000);
}
function getCount() {
    return c;
}
