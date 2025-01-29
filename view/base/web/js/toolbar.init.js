
// Immediately-invoked function expression
(function () {

    window.llapgochjQueryLoader = {
        loaded: false,
        $: null,
        ui: null
    };

    let scriptCount = 0;

    // Load the script
    function checkLoad() {
        if (scriptCount >= 2) {
            window.llapgochjQueryLoader.loaded = true;
            window.llapgochjQueryLoader.$ = window.jQuery.noConflict();
            const event = new CustomEvent('llapgoch-jquery-loaded');

            
            window.dispatchEvent(event);
        }
    }

    // We'll need to see if there is a better way to do this. Loading the ui in breaks luma sites as it overrides it.
    // Maybe check for require first, and if it's there then we can loas it separately.
    if (!window.jQuery) {
        const script = document.createElement("script");
        const scriptUi = document.createElement("script");

        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        script.type = 'text/javascript';
        script.addEventListener('load', () => {
            console.log(`jQuery has been loaded successfully!`);
            scriptCount++;
            checkLoad();
        });

        scriptUi.src = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js';
        scriptUi.type = 'text/javascript';

        scriptUi.addEventListener('load', () => {
            console.log(`jQuery ui has been loaded successfully!`);
            scriptCount++;
            checkLoad();
        });


        document.head.appendChild(script);
        document.head.appendChild(scriptUi);
    }

    console.log('MOOOOO');
})();