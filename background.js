var uuid = "9ee3ff5e_b744_4f08_ab24_355873ebfda5";

chrome.browserAction.onClicked.addListener(function (tab) {
    if (!tab.url.match(/^(http|https|ftp|file)/)) {
        alert("Can't hide fixed elements in this type of page.");
        return;
    }
    chrome.tabs.executeScript(tab.id, {
        "code": "window." + uuid
    }, function (r) {
        if (chrome.runtime.lastError) {
            alert("Unable to communicate with tab:\n" + chrome.runtime.lastError.message);
            return;
        }
        var toggle = function() {
            if (chrome.runtime.lastError) {
                alert("Unable to communicate with tab:\n" + chrome.runtime.lastError.message);
                return;
            }
            chrome.tabs.sendMessage(tab.id, uuid + ":toggle");
        };
        if (r[0]) {
            toggle();
        } else {
            chrome.tabs.executeScript(tab.id, {
                "file": "content.js"
            }, toggle);
        }
    });
});
