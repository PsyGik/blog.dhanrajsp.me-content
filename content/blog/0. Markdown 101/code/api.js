// start-snippet{funcA}
function factorial(x) {
	if (x <= 1) return 1;
	else return x * factorial(x - 1);
}
// end-snippet{funcA}

function display() {
	let x = 5;
	// start-snippet{invokeA}
	let xfact = factorial(x);
	// end-snippet{invokeA}
	console.log(`{} factorial is {}`, x, xfact);
}
