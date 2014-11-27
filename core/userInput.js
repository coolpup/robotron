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
	document.getElementById("formDiv").className = "hidden";
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
				/*var p = document.createElement("p");
				var t = document.createTextNode(xmlhttp.responseText);
				p.appendChild(t);
				document.getElementById("output").appendChild(p);*/
				document.getElementById("output").innerHTML=xmlhttp.responseText;
				highScores.setName(name);
				highScores.addLocalScore({name: highScores.getName(), score: Player.score});
				highScores.resetServerScore();
				var liElements = $("#highscoreList").find('li');
				for (var i = 1; i <= liElements.length; i++) {
					highScores.addServerScore({
						name: liElements[i-1].children[0].innerHTML,
						score: parseInt(liElements[i-1].children[1].innerHTML)
					});
				}
				$("section").click(function() {$(this).find("article").toggle("slow", function() {});});
			}
		}
		xmlhttp.open("POST","phplogic/savescore.php?name="+name+"&score="+Player.getScore(),true);
		xmlhttp.send();
	}
	highScores.renderON();
}