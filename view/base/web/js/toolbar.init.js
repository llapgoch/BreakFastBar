
// Immediately-invoked function expression
(function () {
    
    window.llapgochjQueryLoader = {
        loaded: false,
    };
    // Load the script
    const script = document.createElement("script");
    const scriptUi = document.createElement("script");
    let scriptCount = 0;

    function checkLoad() {
        if (scriptCount >= 2) {
            window.llapgochjQueryLoader.loaded = true;
            const event = new CustomEvent('llapgoch-jquery-loaded');

            // In toolbar 
            window.dispatchEvent(event);

            console.log('horse');
        }
    }
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    script.type = 'text/javascript';
    script.addEventListener('load', () => {
        console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
        scriptCount++;
        checkLoad();
    });

    scriptUi.src = 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js';
    scriptUi.type = 'text/javascript';

    scriptUi.addEventListener('load', () => {
        console.log(`jQuery ${$.fn.jquery}ui has been loaded successfully!`);
        scriptCount++;
        checkLoad();
    });


    document.head.appendChild(script);
    document.head.appendChild(scriptUi);

    console.log('MOOOOO');
})();