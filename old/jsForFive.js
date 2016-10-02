var Promise = require("bluebird"),
	statusTag = document.getElementsByClassName('status')[0],
	messageTag = document.getElementsByClassName('message')[0],
	checkboxTag = document.getElementById('checkbox'),
	timerSwitch = document.getElementById('disable-option'),
	countDown = document.getElementById('count-down'),
	timerEnabled,
	timer,
	time;

/* Setup */
function init() {
	chrome.storage.sync.get({ timerEnabled : false }, function(data) {
	   timerEnabled = data.timerEnabled;
	   timerSwitch.checked = timerEnabled;
	});

	chrome.storage.sync.get({ time: 300}, function(data) {
		time = data.time;
	});


	
	getJavascriptContentSetting()
		.then(function(setting) {
			showStatus(setting);
		})
		.catch(function(error) { 
			console.log(error)
		});
}
init();

checkboxTag.addEventListener('click', function() {
	toggleJavascriptContentSetting()
		.then(function(setting) {
			showStatus(setting);
		})
		.catch(function(error) {
			console.log(error);
		});
});

timerSwitch.addEventListener('click', function() {
	timerEnabled = timerSwitch.checked
	console.log('timerSwitch.checked', timerEnabled);
	chrome.storage.sync.set({ timerEnabled: timerEnabled }, function() { /*no-op*/ });
	
	if (timerEnabled) {
		beginCountdown();
	}
	if (!timerEnabled) {
		clearAndResetTimer();
	}
});

function getJavascriptContentSetting() {
	return new Promise(function(resolve, reject) {
		chrome.contentSettings['javascript'].get({
        	primaryUrl : 'http://*'
	    }, function (details) {
	        if (details.setting === "allow" || details.setting === "block") {
	            resolve(details.setting);
	        } else {
	            reject("Could not get JS setting");
	        }
	    });
	});
}

function toggleJavascriptContentSetting() {
	return new Promise(function(resolve, reject) {
		chrome.contentSettings['javascript'].get({
        	primaryUrl : 'http://*'
	    }, function (details) {
	    	var newSetting = (details.setting === "allow") ? "block" : "allow";
	        chrome.contentSettings['javascript'].set({
        		primaryPattern : '<all_urls>',
        		setting: newSetting
	    	})
	    	resolve(newSetting);
	    });
	});
}

function showStatus(setting) {
	console.log('status : ', setting);
	if (setting === 'block') {
		statusTag.innerHTML = 'Your JavaScript is BLOCKED';
		messageTag.innerHTML = 'And keep it that way to surf safer!';
		checkboxTag.checked = false;
		clearAndResetTimer();
	} else if (setting === 'allow') {
		statusTag.innerHTML = 'Your JavaScript is ENABLED';
		messageTag.innerHTML = 'Surf cautiously!';
		checkboxTag.checked = true;
		if (timerEnabled) {
			beginCountdown();
		}
	} else {

	}
}

function beginCountdown() {
	if (!timer) {
		timer = setInterval(function() {
			var countDown = document.getElementById('count-down');
			if (time > 0) {
				time--;
				countDown.innerHTML = 'JS will disable in ' + toMinSec(time);
				chrome.storage.sync.set({ time : time }, function() {
					console.log('time set!');
				});
			} else {
				countDown.innerText = '';
				endCountDown();
			}
		}, 1000);
	}
}

function toMinSec(time) {
	var min = Math.floor(time / 60),
		sec = (time % 60 === 0 ? '00' : ( (time % 60) < 10 ? '0' + time : time % 60) );
	return min + ':' + sec;
}

function endCountDown() {
	clearAndResetTimer()
	toggleJavascriptContentSetting()
		.then(function(setting) {
			showStatus(setting);
		})
		.catch(function(error) {
			console.log(error);
		});
}

function clearAndResetTimer() {
	clearInterval(timer);
	timer = null;
	time = 300;
	document.getElementById('count-down').innerHTML = '';
	chrome.storage.sync.set({ time : time }, function() {
		console.log('time set!');
	});
	chrome.storage.sync.set({ timerEnabled: timerEnabled }, function() {
	
	});
}

/* Sets up links to open as new tabs */
/* Chrome Extension <a> tags don't work as usual */
document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var link = links[i];
            var location = link.href;
            link.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});