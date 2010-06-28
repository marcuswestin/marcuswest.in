<?php 
	$output = array();
	
	exec('git pull readonly master', $output);
	exec('make', $output);
	
	echo(implode('<br/>', $output));
?>