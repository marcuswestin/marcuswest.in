function compute(data) {
	window.setTimeout(complete, 1000);
}

function complete() {
	var form = document.getElementById('form');
	console.debug(form);
	form.submit();
}

compute();