interval = 1000;
direction = 'forward';
startFromBeginning = false;

tabIndex = 0;
currentWindowId = 0;
running = false;

function doSwitch(fromBeginning) {
    chrome.windows.getLastFocused( function(window) {
	chrome.tabs.getAllInWindow(window.id, function(tabs) {
	    switchTabs(tabs, fromBeginning);
	});
    });
}

function switchTabs(tabs, fromBeginning) {
    if (fromBeginning) {
	if (direction == 'forward') {
	    tabIndex = 0;
	}
	else if (direction == 'backward') {
	    tabIndex = tabs.length -1;
	}
    }

    alert('tabIndex: '+tabIndex);
    myInterval = setInterval(function() {
	chrome.pageAction.setIcon({tabId: tabs[tabIndex].id, path: "active.png"});
	showTab(tabIndex);

	switch(direction) {
	case 'forward':
	    tabIndex ++;
	    if (tabIndex >= tabs.length) {
		tabIndex = 0;
	    }
	    break;
        case 'backward':
	    tabIndex --;
	    if (tabIndex < 0) {
		tabIndex = tabs.length-1;
	    }
	    break;
	case 'random':
	    var random = Math.floor(Math.random() * tabs.length);
	    if (tabIndex == random) {
		random = Math.floor(Math.random() * tabs.length);
	    }
	    tabIndex = random;
	    break;
	}
	
    }, interval);

}

function showTab() {
    chrome.tabs.highlight({windowId:currentWindowId, tabs:tabIndex}, function(window) {
	//console.log("show tab id: "+tabIndex);
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    // load settings
    interval = localStorage["interval"];
    direction = localStorage["direction"];
    startFromBeginning = localStorage['start_from_beginning'] == 'true';
    console.log("interval:"+interval+"\ndirection:"+direction+"\nstartFromBeginning:"+startFromBeginning);

    // create a new tab
    //var viewTabUrl = chrome.extension.getURL("test.html");
    //chrome.tabs.create({url: viewTabUrl});
    // show current tab
    tabIndex = tab.index;
    currentWindowId = tab.windowId;
    // show all tabs
    if (running) {
	clearInterval(myInterval);
	chrome.pageAction.setIcon({tabId: tab.id, path: "inactive.png"});
    } else {
	chrome.pageAction.setIcon({tabId: tab.id, path: "active.png"});

	doSwitch(startFromBeginning);
    }

    running = !running;
});
