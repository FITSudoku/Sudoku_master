//Credit for code goes to http://mrbool.com/how-to-create-a-stopwatch-in-javascript/26613#ixzz2lUnZeCbA
var c=0;
var t;
function stopCount() {
	clearTimeout(t);
	c = 0;
}
<<<<<<< HEAD
function timedCount() {	
	document.getElementById('timeOutput').value=c;
	c=c+1;	
=======
function timedCount() {
	var el = document.getElementById("timeOutput");
	el.firstChild.data = c;
	c=c+1;
>>>>>>> f060000b96306d99db2f7b8923b7ec2b96a8622c
	t=setTimeout("timedCount()",1000);
}
