<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<title>UoC Quickie Login Test</title>
	<style type="text/css" media="screen">
		body {
			color : #456;
			font-family : Helvetica, Arial;
			font-size : .9em;
		}
		a {
			text-decoration : none;
			color : #789;
		}
	</style>
</head>
<body id="" onload="">
	<?php
		if ($_POST['username'] == 'Joe' && $_POST['password'] == 'changeme') {
			// Login succesful
			?>
			Login succesful!
			<?
		} else {
			// Throw back
			?>
		<script type="text/javascript" charset="utf-8">
			alert("Invalid login/pass");
			document.location='./';
		</script>
			<?
		}
	?>
	<br /><a href="./">Back to login</a>
</body>
</html>