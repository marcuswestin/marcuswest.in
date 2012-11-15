<?php

$newPath = preg_replace("/^\/on\//i", "/essays/", $_SERVER["REQUEST_URI"]);
header("HTTP/1.1 301 Moved Permanently");
header("Location: http://marcuswest.in$newPath");

?>
