<?php  
	
	$pdffile = $_POST;

	$im = new Imagick();
	$im->setResolution(100,100);
	$im->readimage(pdffile);
	$im->setImageFormat('png');
	$im->writeImage('thumb.png');
	echo $im;


?>