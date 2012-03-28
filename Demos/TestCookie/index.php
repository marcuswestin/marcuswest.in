<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
	"http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<title>Test Cookies</title>
	<script type="text/javascript" charset="utf-8">
		var key = prompt('Store cookie with key:');
		var val = prompt('Cookie value:');
		document.cookie = key+'='+val+'; expires=Fri, 1 Jan 2011 20:47:11 UTC; path=/';
		alert(document.cookie);
	</script>
</head>
<body id="index" onload="">
	<a href=".">Refresh</a>
	<?php
		$ROOT = $_SERVER['DOCUMENT_ROOT']."/../"; 
		include "${ROOT}include/macros.php";
	?>	
	<?printTracker("UA-1101899-13");?>
</body>
</html>