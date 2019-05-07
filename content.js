/**
 * content.js
 * (всё, что указано в content_scripts) имеет доступ к DOM и может слушать сообщения от background.js.
 */
console.log('content js');

const checkTrackingCode = (() => {

    let checkTracking = () => {

        let results = [];

        results.push({
            title: 'Google Analytics',
            value: (typeof ga !== 'undefined') ? ga.getAll()[0].get('trackingId') : 'undefined'
        });
        
        console.log('response-check-tracking start');
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
                console.log('request-check-tracking success');
                checkTracking();
                break;
        }
    });
})();
