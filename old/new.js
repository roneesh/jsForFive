var Promise = require("bluebird"),
	jsEnabled,
	timerEnabled,
	countDownTime,
	timerSwitch = document.getElementById('disable-option');

function init() {
	chrome.storage.sync.get({ jsEnabled: undefined}, function(data) {
		jsEnabled = data.jsEnabled;
		if (jsEnabled === undefined) {
			getJavascriptContentSetting()
				.then(function(setting) {
					setting = setting === 'allow' ? true : false
					chrome.storage.sync.set({ time : time }, function() {
						console.log('time set!');
					});
				})
				.catch(function(error) {
					chrome.storage.sync.set({ jsEnabled : undefined }, function() {
						console.log('time set!');
					});
				})
		}
	})




	chrome.storage.sync.get({ countDownTime: 300}, function(data) {
		countDownTime = data.countDownTime;
	});

	console.log(jsEnabled, timerEnabled, countDownTime)

	DOMinit()
}

function DOMinit() {
	timerSwitch.checked = timerEnabled;
}

init();

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

function getActiveTimer() {
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.get({ hasActiveTimer : false }, function(data) {
		   if (data.hasActiveTimer === true || data.hasActiveTimer === false) {
		   		resolve(data.timerEnabled)
		   } else {
		   		reject("could not determine if there is an active timer")
		   }
		});
	});
}

