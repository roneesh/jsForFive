var Promise = require("bluebird"),
	statusTag = document.getElementsByClassName('status')[0],
	messageTag = document.getElementsByClassName('message')[0],
	checkboxTag = document.getElementById('checkbox');

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

getJavascriptContentSetting()
	.then(function(setting) {
		showStatus(setting);
	})
	.catch(function(error) { 
		console.log(error)
	});

checkboxTag.addEventListener('click', function() {
	toggleJavascriptContentSetting()
		.then(function(setting) {
			showStatus(setting);
		})
		.catch(function(error) {
			console.log(error);
		});
});

function showStatus(setting) {
	if (setting === 'block') {
		statusTag.innerHTML = 'Your JavaScript is BLOCKED';
		messageTag.innerHTML = 'And keep it that way to surf safer!';
		checkboxTag.checked = false;
	} else if (setting === 'allow') {
		statusTag.innerHTML = 'Your JavaScript is ENABLED';
		messageTag.innerHTML = 'Surf cautiously!';
		checkboxTag.checked = true;
	} else {

	}
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