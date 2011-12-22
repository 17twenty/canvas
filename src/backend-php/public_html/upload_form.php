
<script type="text/javascript" >
$(function () {
	    $('#manfileupload').fileupload({
	        dataType: 'json',
	        url: 'php/index.php',
	        done: function (e, data) {
	            $.each(data.result, function (index, file) {
	            	$.ajax({
						type: "GET",
						url: "ajax-insert.php",
						data: {
							x:  0.5,
							y: 0.5,
							size: 0.3,
							rotation: ((Math.random()*60)-30),
							name: "Upload",
							type: IMAGE,
							link: ".."+file.large_url
						},
						  dataType: "script"
					});
	            });
	        }
	    });
	});
	</script>

	<h1>Upload images/videos</h1>
	You can upload objects to the canvas provided they are one of the following file types: Images (.jpg, .gif, .png), Videos (.ogv, .webm)

	<form>
	Name: <input type="text" name="name" /><br />
	File: <input id="manfileupload" type="file" name="files[]" multiple"> <br />
	<input type="submit" value="Submit" />
	</form>
