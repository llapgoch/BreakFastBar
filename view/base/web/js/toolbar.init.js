
// Immediately-invoked function expression
(function () {

    window.llapgochjQueryLoader = {
        loaded: false,
        $: null
    };

    let scriptCount = 0;

    // Load the script
    function checkLoad() {
        if (scriptCount >= 2) {
            window.setTimeout(() => {
                // Cheapo delay to fix loading race conditions
                window.llapgochjQueryLoader.loaded = true;
                window.llapgochjQueryLoader.$ = window.jQuery.noConflict();
                const event = new CustomEvent('llapgoch-jquery-loaded');


                window.dispatchEvent(event);
            }, 500);
        }
    }

    // This assumes another frontend is being used without requirejs, so we need to load jQuery and jQuery UI here.
    // 
    if (!window.require) {
        const script = document.createElement("script");
        const scriptUi = document.createElement("script");

        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        script.type = 'text/javascript';
        script.addEventListener('load', () => {
            scriptCount++;
            checkLoad();
        });

        scriptUi.src = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js';
        scriptUi.type = 'text/javascript';

        scriptUi.addEventListener('load', () => {
            scriptCount++;
            checkLoad();
        });


        document.head.appendChild(script);
        document.head.appendChild(scriptUi);
    } else {
        // Requirejs mode
        require(['jquery', 'jquery/ui'], function ($, ui) {
            window.llapgochjQueryLoader.loaded = true;
            window.llapgochjQueryLoader.$ = $;

            const event = new CustomEvent('llapgoch-jquery-loaded');
            window.dispatchEvent(event);
        });
    }

})();