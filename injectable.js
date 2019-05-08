(() => {

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

    const checkTrackingCode = (() => {
        // console.log('checkTrackingCode');

        let results = [];

        /**
         * Google Analytics
         */
        results.push({
            title: 'Google Analytics',
            value: (typeof window.ga !== 'undefined') ? window.ga.getAll()[0].get('trackingId') : 'undefined'
        });

        /**
         * Google Tag Manager
         */
        results.push({
            title: 'Google Tag Manager',
            value: (typeof window.gtag !== 'undefined') ? window.ga.getAll()[0].get('trackingId') : 'undefined'
        });

        /**
         * Facebook Pixel
         */
        if (typeof window.fbq !== 'undefined') {
            for ( key in window.fbq.instance.pixelsByID) {
                results.push({
                    title: 'Facebook Pixel',
                    value: key
                });
            }
        } else {
            results.push({
                title: 'Facebook Pixel',
                value: 'undefined'
            });
        }

        /**
         * Yandex Metrica
         */
        (() => {
            let count = 0;

            for ( key in window) {
                if (key.indexOf('yaCounter') == 0) {
                    results.push({
                        title: 'Yandex Metrica',
                        value: key.substring(9)
                    });
                    count++;
                }
            }

            if (!count) {
                results.push({
                    title: 'Yandex Metrica',
                    value: 'undefined'
                });
            }
        })();


        // console.log(results);
        setLocalStorageItem('beontop-check-goals', results);

    })();
})();
