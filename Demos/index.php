<html>
<head>
<title>Javascript</title>
<style type="text/css">
body {
        font-family : 'verdana';
        margin-top : 100px;
        margin-left : 100px;
        color : #357;
}
a {
        text-decoration : none;
        color : #678;
}
li {
        margin-bottom : 5px;
}

</style>
</head>
<body>
<h2>Javascript</h2>
<ul>
<?php
// Read all SVN repositories from the svn directory
if ($handle = opendir('.')) {
    /* This is the correct way to loop over the directory. */
    while (false !== ($file = readdir($handle))) {
        if (is_dir($file) and ($file[0] != '.')) {
                $dir = $file;
                echo "<li><a href=\"$dir/\" />$file</a>\n";
        }
    }
    closedir($handle);
}
?>
</ul>
<?php
	$ROOT = $_SERVER['DOCUMENT_ROOT']."/../"; 
	include "${ROOT}include/macros.php";
?>	
<?printTracker("UA-1101899-13");?>
</body>
</html>