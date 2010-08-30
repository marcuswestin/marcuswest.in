<?php

$isPasswordProtected = (file_get_contents('.htaccess') != '');

echo "Disabled for now";
exit(0);

if ($isPasswordProtected) {
	$id = $_GET['id'];
	$text = $_GET['body'];

	$fp = fopen("./$id.post", 'w+');
	fwrite($fp, $text);
	fclose($fp);
} else {
	echo "You should really password protect write/save/ by adding a username and password in write/save/.htaccess!";
}
?>
