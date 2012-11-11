<?php

$newPath = preg_replace("/^\/read\//i", "/on/", $_SERVER["REQUEST_URI"]);
header("HTTP/1.1 301 Moved Permanently");
header("Location: http://marcuswest.in$$newPath");

?>