var uuid = "9ee3ff5e_b744_4f08_ab24_355873ebfda5";

chrome.action.onClicked.addListener(function (tab) {
    if (!tab.url.match(/^(http|https|ftp|file)/)) {
        alert("Can't hide fixed elements in this type of page.");
        return;
    }

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (uuid) => window[uuid],
        args: [uuid],
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
        if (r[0].result) {
            toggle();
        } else {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            }, toggle);
        }
    });
});
