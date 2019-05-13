/**
 * content.js
 * (всё, что указано в content_scripts) имеет доступ к DOM и может слушать сообщения от background.js.
 */
// console.log('content js');


function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

injectScript( chrome.extension.getURL('/injectable.js'), 'body');

const checkTrackingCode = (() => {

    const setLocalStorageItem = function ( name, value ) {
        if ( typeof value === 'object' ) {
            localStorage.setItem(name, JSON.stringify(value));
        } else {
            localStorage.setItem(name, value);
        }
    };

    const getLocalStorageItem = function (name) {
        let value = localStorage.getItem(name);
        let result;
        try {
            result = JSON.parse(value);
        } catch (e) {
            return value;
        }
        return result;
    };

    const checkTracking = () => {

        let results = getLocalStorageItem('beontop-check-goals');

        // console.log('response-check-tracking start');
        // console.log('1 ', results);
        chrome.extension.sendMessage({
            type: "response-check-tracking", 
            data: {
                myProperty: results
            }
        });
    }


    chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
        switch (request.type) {
            case "request-check-tracking":
                // console.log('request-check-tracking success');
                checkTracking();
                break;
        }
    });
})();


