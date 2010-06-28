<?php 
	$output = array();
	
	exec('cd ..; git pull readonly master', $output);
	exec('cd ..; make', $output);
	
	echo(implode('<br/>', $output));
?>