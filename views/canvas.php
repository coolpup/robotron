
		<div id="canvasContainer" class="canvasContainer">
			<canvas id="myCanvas" width="800" height="600">
				<!--h1 element and info, if the browser doesn't show the canvas-->
				<h1>ROBOTRON</h1>
				<p>Sorry, but your browser does not support the HTML5 canvas tag.</p>
			</canvas>
			<div id="formDiv" class="hidden">
				<form class="form" id="form" autocomplete="off">
					<label>
						<span class="hidden">Name:</span><!--Label for accessing purposes-->
						<input type="text" id="text" name="name" placeholder="Type your name!" maxlength="10" autofocus>
					</label>
					<input type="submit" value="Submit highscore">
				</form>
			</div>
		</div>