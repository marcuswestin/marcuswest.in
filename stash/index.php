<?php 
	header('Content-type:application/json');
	
    $lastStashStr = file_get_contents('last_stash.time');
	$currentTime = time();
	
	if ($currentTime < $lastStashStr + 5) {
		echo '{ "stashed":false, "error":"too much stashin" }';
		exit(0);
	}
	
	$post_data = file_get_contents('php://input');
	$fp = fopen("stash_$currentTime.json", 'w+');
	$json = file_get_contents('php://input');
	fwrite($fp, $json);
	fclose($fp);
	
	$fp = fopen('last_stash.time', 'w+');
	fwrite($fp, $currentTime);
	fclose($fp);
	
	echo '{ "stashed":true }';
?>