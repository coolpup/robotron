// =================
// User text input HANDLING
// =================

document.addEventListener("DOMContentLoaded",function(){
	var form = document.getElementById("form");
	form.addEventListener("submit", add, false);
});

function add(e) {
	e.preventDefault();
	postScore();
	$("#formDiv").addClass("hidden");
}

function postScore() {
	var str = document.getElementById("text");
	var name = str.value;
	if(name!==""){
		var xmlhttp;
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		} else { // code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				if($("#highscoreTable").length===0) $("li#navHS").removeClass("hidden");
				document.getElementById("output").innerHTML=xmlhttp.responseText;
				highScores.setName(name);
				highScores.addLocalScore({name: highScores.getName(), score: Player.score});
				highScores.resetServerScore();
				var tr = $("#highscoreTable tbody").find("tr");
				for (var i = 1; i <= tr.length; i++) {
					console.log(tr[i-1].children[1].innerHTML);
					highScores.addServerScore({
						name: tr[i-1].children[1].innerHTML,
						score: parseInt(tr[i-1].children[2].innerHTML)
					});
				}
				$("#highscore").click(function() {$(this).parent().find("article").toggle("slow");});
			}
		}
		if (!g_hasCheated) {
			xmlhttp.open("POST","phplogic/savescore.php?name="+name+"&score="+Player.getScore(),true);
			xmlhttp.send();
		}
	}
	highScores.renderON();
}