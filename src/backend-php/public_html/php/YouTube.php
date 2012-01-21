<h1>YouTube Video Queue</h1><div style='float:right'><h1><a href="javascript:PopupMain();"'>Back</a></h1></div>
<form name="myform" action="">
<p>Please enter a URL to the YouTube you would like added to Canvas. For example "http://www.youtube.com/watch?v=QH2-TGUlwu4" 
and then click Submit to start downloading the clip onto the Canvas server. (Warning this can take some time especially for HD videos)</p><br/>
<label>YouTube URL: </label><input type='text' name='URL' />
<input type="button" id="submit" value="Submit" onClick="validateForm(this.form)"/>
</form>
<div id="YouTubeList"></div>