<?php

ini_set('max_execution_time', 300); //300 seconds = 5 minutes

$videoUrl = urldecode($_GET["url"]); //"http://www.youtube.com/watch?v=6iK4dy74ibY";
//$videoUrl = "http://www.youtube.com/watch?v=4q5ZHU8yvLQ";
//echo $videoUrl;
//echo("C:\\Python27\\python.exe " . getcwd() . "\\youtube-dl.py ".$videoUrl." -F --write-info-json");
exec("C:\\Python27\\python.exe " . getcwd() . "\\youtube-dl.py ".$videoUrl." -F --write-info-json", $result);

//print_r($result);
$imploded = implode("\n", $result);

$numWebm = preg_match_all ("(\n([0-9]{2}).*webm)", $imploded, $matches);

$formats = $matches[1];
rsort($formats);

if (count($formats) > 0)
{
	$format = $formats[0];
	exec("C:\\Python27\\python.exe " . getcwd() . "\\youtube-dl.py ".$videoUrl." -f ". $format ." -w --write-info-json", $result2);
	//print_r($result2);
	$imploded = implode("\n", $result2);
	
	preg_match("(JSON to: (.*json))", $imploded, $matches);
	
	$json_file = $matches[1];
	//echo "JSON file: ".$json_file."\n";
	$json = file_get_contents($json_file);
	$decoded_json = json_decode($json, true);
	
	if (preg_match("(Destination: (.*))", $imploded, $matches) == 0)	
		preg_match("((.*).info.json)", $json_file, $matches);
	$file = $matches[1];
	
	$decoded_json["Filename"] = $file;
	$json = json_encode($decoded_json);
	echo $json;
}
else
{
	print("{\"error\" : \"NO WEBM FORMAT\"}");
}
?>