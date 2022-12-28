(function() {
    var active = false,
        firstRun = false,
        css_injected = false,
        elements_hidden = false,
        uuid = "9ee3ff5e_b744_4f08_ab24_355873ebfda5",
        // Must begin with a letter
        className = 'C' + uuid,
        cooldown = 0,
        timeout = 0;

    if (window[uuid]) {
        console.warn("HideFixedElements: already injected!");
        return;
    }
    window[uuid] = "present";

    function activate() {
        if (!css_injected) {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(
                "." + className + " { opacity: 0 !important; visibility: hidden !important; transition: opacity 100ms, visibility 0s linear 100ms !important; }"
            ));
            document.head.appendChild(style);
            css_injected = true;
        }
        active = true;
        firstRun = true;
        hideFixedElements();
    }

    function deactivate() {
        unhideFixedElements();
        active = false;
        if (timeout)
            window.clearTimeout(timeout);
    }

    function hideFixedElements() {
        var elems = document.getElementsByTagName("*");
        for (var i = 0; i < elems.length; i++) {
            var e = elems[i];
            if (e.classList.contains(className))
                continue;
            var style = window.getComputedStyle(e);
            if (style.position == "fixed" || style.position == "sticky") {
                e.classList.add(className);
                elements_hidden = true;
            }
        }
        if (firstRun && !elements_hidden) {
            alert("Couldn't find anything to hide on this page!");
            active = false;
        }
        firstRun = false;
    }

    function unhideFixedElements() {
        var elems = document.getElementsByClassName(className);
        for (var i = elems.length - 1; i >= 0; i--)
            elems[i].classList.remove(className);
        elements_hidden = false;
    }

    window.addEventListener("scroll", function() {
        if (active && !timeout) {
            var now = new Date();
            var when = (now - cooldown < 500) ? 250 : 0;
            timeout = window.setTimeout(function() {
                timeout = 0;
                hideFixedElements();
            }, when);
            cooldown = +now;
        }
    });

    chrome.runtime.onMessage.addListener(function(msg) {
        if (msg === uuid + ":toggle") {
            if (!active)
                activate();
            else
                deactivate();
        }
    });
})();
