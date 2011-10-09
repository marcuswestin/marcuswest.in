<!doctype html>
<head>
    <style type="text/css">
        body, html { color: #333; font-family: verdana, sans-serif; font-size: 14px; }
        #content { width: 250px; margin: 50px auto; }
        p { margin: 2px; }
    </style>
</head>
<body>
    <div id="content">
<?php 
	$output = array();
    $lastStashStr = file_get_contents('last_stash.time');
	$currentTime = time();
	
	if ($currentTime < $lastStashStr + 5) {
		echo '{ "stashed":false, "error":"too much stashin" }';
		exit(0);
	}
	
	$post_data = file_get_contents('php://input');
	$fp = fopen("stash_$currentTime.json", 'w+');
	fwrite($fp, $currentTime);
	fclose($fp);
	
	$fp = fopen('last_stash.time', 'w+');
	fwrite($fp, $currentTime);
	fclose($fp);
	
	echo '{ "stashed":true }';
?>
    </div>
</body>
</html>