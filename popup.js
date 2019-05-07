/**
 * popup.js
 * может обращаться к DOM всплывающего окна и умеет слать сообщения к background.js.
 */

let consoleLog = text => {
    chrome.tabs.executeScript({
        code: `console.log("${text}")`
    });
}





const checkTrackingCode = (() => {

    let root = document.querySelector('.js-tracking-code');

    if(!root){
        return false;
    }

    let self = {
        elements: {
            root: root,
            btn: root.querySelector('.js-tracking-code-btn-search'),
            results: root.querySelector('.js-tracking-code-btn-results'),
        },
        templates: {
            item: (title, value) => {
                return `<div class="tracking-code__item">
                            <div class="tracking-code__item-title">${title}</div>
                            <div class="tracking-code__item-value">${value}</div>
                        </div>`
            }
        }
    }


    // Request
    self.elements.btn.addEventListener('click', function() { 

        chrome.tabs.executeScript({
            code: `
            (function() {
                console.log((typeof ga !== 'undefined') ? ga.getAll()[0].get('trackingId') : 'undefined');
                return ((typeof ga !== 'undefined') ? ga.getAll()[0].get('trackingId') : 'undefined');
            })();`
        }, function(results) {
            console.log(results[0]);
        });


        consoleLog('request-check-tracking start');
        // отправка в content.js
        chrome.tabs.getSelected(null, function(tab){
            chrome.tabs.sendMessage(tab.id, {type: "request-check-tracking", msg: 'test'});
        });
    }, false);


    // Listeners
    chrome.extension.onMessage.addListener(function (request, sender, sendResponse){
        switch (request.type) {
            case "response-check-tracking":
                consoleLog('response-check-tracking success');
                // do something
                showResults(request.data.myProperty)
                break;
        }
    });

    let showResults = arrResults => {
        let resultHtml = '';
        self.elements.results.innerHTML = '';
        arrResults.forEach(element => {
            resultHtml += self.templates.item(element.title, element.value);
        });

        self.elements.results.innerHTML = resultHtml;
    }
    

    return Object.freeze({

    })
})();
