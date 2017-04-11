var levels = [];

var currentLevelIndex = 0;
var currentLevel = null;

function loadLevels(file) {
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open("GET", file, true);
    request.onreadystatechange = function () {
        if(request.readyState == 4 && request.status == "200") {
	    levels = JSON.parse(request.responseText);
	    currentLevelIndex = 0;
	    currentLevel = new Level(levels[0]);
        }
    };
    request.send(null);  
};

function nextLevel() {
    currentLevelIndex++;
    currentLevel = new Level(levels[currentLevelIndex]);
};