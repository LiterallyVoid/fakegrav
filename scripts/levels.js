var levels = [];

var currentLevelIndex = 0;
var currentLevel = null;

var tasks = 0;
var doneTasks = 0;

function loadLevels(file, index, mult) {
    tasks++;
    index = index || 0;
    mult = mult || 100000;
    mult2 = mult / 10;
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open("GET", file, true);
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == "200") {
	    doneTasks++;
	    var jsonData = JSON.parse(request.responseText);
	    if(typeof jsonData[0] == "string") {
		for(var i = 0; i < jsonData.length; i++) {
		    loadLevels("data/" + jsonData[i], index * mult + i * mult2, mult2);
		}
	    } else {
		for(var i = 0; i < jsonData.length; i++) {
		    levels.push([jsonData[i], index + i * mult]);
		}
		if(doneTasks == tasks) {
		    levels.sort(function(a, b) {
			return a[1] - b[1];
		    });
		    var newLevels = [];
		    for(var i = 0; i < levels.length; i++) {
			newLevels.push(levels[i][0]);
		    }
		    levels = newLevels;
		    currentLevelIndex = 0;
		    currentLevel = new Level(levels[0]);
		}
	    }
        }
    };
    request.send(null);  
};

function nextLevel() {
    currentLevelIndex++;
    currentLevel = new Level(levels[currentLevelIndex]);
};

function restartLevel() {
    currentLevel = new Level(levels[currentLevelIndex]);
};