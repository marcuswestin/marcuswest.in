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
    $lastPullStr = file_get_contents('last_pull.time');
	$currentTime = time();
	
	if ($currentTime < $lastPullStr + 8) {
	    echo '<p>I am a little script</p>';
	    echo '<p>I pull from github</p>';
	    echo '<p>Please don\'t pull too often</p>';
	    exit(0);
	}
	
	exec('cd ..; git pull readonly master', $output);
	
	echo(implode('<br/>', $output));
	
	$fp = fopen('last_pull.time', 'w+');
	fwrite($fp, $currentTime);
	fclose($fp);
?>
    </div>
</body>
</html>