(function () {
    function init($) {
        // Only initialise on non-Luma (Hyva/Alpine) pages
        if (window.require) {
            return;
        }

        var $container = $('.js-alpine-panel-content');
        if (!$container.length) {
            return;
        }

        function escapeHtml(str) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        }

        function truncate(str, len) {
            if (str.length <= len) return str;
            return str.substring(0, len) + '…';
        }

        function getAlpine() {
            return window.Alpine || window.__Alpine || null;
        }

        function scan() {
            var Alpine = getAlpine();
            var html = '';

            // Version badge
            if (Alpine && Alpine.version) {
                html += '<div class="devbar-jspanel__badge">Alpine.js v' + escapeHtml(Alpine.version) + '</div>';
            }

            // Components — scan [x-data] elements excluding devbar's own
            var xDataEls = document.querySelectorAll('[x-data]');
            var components = [];
            for (var i = 0; i < xDataEls.length; i++) {
                var el = xDataEls[i];
                // Skip devbar's own elements
                if (el.closest('.devbar')) continue;
                components.push(el);
            }

            if (components.length) {
                html += '<div class="devbar-jspanel__section">';
                html += '<div class="devbar-jspanel__section-header js-jspanel-toggle">';
                html += '<span class="devbar-jspanel__arrow">▼</span> ';
                html += 'Components <span class="devbar-jspanel__count">' + components.length + '</span>';
                html += '</div>';
                html += '<div class="devbar-jspanel__section-body">';

                for (var j = 0; j < components.length; j++) {
                    var comp = components[j];
                    var tag = comp.tagName.toLowerCase();
                    var id = comp.id ? '#' + comp.id : '';
                    var cls = comp.className ? '.' + comp.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
                    var label = tag + id + cls;
                    var xData = comp.getAttribute('x-data') || '';
                    var displayXData = truncate(xData, 80);

                    // Try to get live data
                    var liveData = '';
                    if (Alpine && Alpine.$data) {
                        try {
                            var data = Alpine.$data(comp);
                            liveData = JSON.stringify(data, null, 2);
                        } catch (e) {
                            liveData = '(unable to read data)';
                        }
                    }

                    html += '<div class="devbar-jspanel__item devbar-jspanel__item--expandable js-jspanel-expand">';
                    html += '<span class="devbar-jspanel__item-name">' + escapeHtml(label) + '</span>';
                    if (displayXData) {
                        html += '<span class="devbar-jspanel__item-detail">' + escapeHtml(displayXData) + '</span>';
                    }
                    if (liveData) {
                        html += '<div class="devbar-jspanel__item-expanded" style="display:none">';
                        html += '<pre class="devbar-jspanel__pre">' + escapeHtml(liveData) + '</pre>';
                        html += '</div>';
                    }
                    html += '</div>';
                }

                html += '</div></div>';
            }

            // Stores
            if (Alpine && Alpine._stores) {
                var storeKeys = Object.keys(Alpine._stores);
                if (storeKeys.length) {
                    html += '<div class="devbar-jspanel__section">';
                    html += '<div class="devbar-jspanel__section-header js-jspanel-toggle">';
                    html += '<span class="devbar-jspanel__arrow">▼</span> ';
                    html += 'Stores <span class="devbar-jspanel__count">' + storeKeys.length + '</span>';
                    html += '</div>';
                    html += '<div class="devbar-jspanel__section-body">';

                    storeKeys.sort();
                    for (var k = 0; k < storeKeys.length; k++) {
                        var storeName = storeKeys[k];
                        var storeData = '';
                        try {
                            storeData = JSON.stringify(Alpine._stores[storeName], null, 2);
                        } catch (e) {
                            storeData = '(unable to serialize)';
                        }

                        html += '<div class="devbar-jspanel__item devbar-jspanel__item--expandable js-jspanel-expand">';
                        html += '<span class="devbar-jspanel__item-name">' + escapeHtml(storeName) + '</span>';
                        html += '<span class="devbar-jspanel__item-detail">store</span>';
                        html += '<div class="devbar-jspanel__item-expanded" style="display:none">';
                        html += '<pre class="devbar-jspanel__pre">' + escapeHtml(storeData) + '</pre>';
                        html += '</div>';
                        html += '</div>';
                    }

                    html += '</div></div>';
                }
            }

            if (!html) {
                html = '<div class="devbar-jspanel__empty">No Alpine.js data found. Is Alpine loaded?</div>';
            }

            $container.html(html);
        }

        // Section toggle
        $container.on('click', '.js-jspanel-toggle', function () {
            var $body = $(this).next('.devbar-jspanel__section-body');
            var $arrow = $(this).find('.devbar-jspanel__arrow');
            $body.toggle();
            $arrow.text($body.is(':visible') ? '▼' : '▶');
        });

        // Expandable item toggle
        $container.on('click', '.js-jspanel-expand', function (e) {
            if ($(e.target).closest('.devbar-jspanel__item-expanded').length) return;
            $(this).find('.devbar-jspanel__item-expanded').toggle();
        });

        // Rescan button
        $(document).on('click', '.js-alpine-rescan', function (e) {
            e.preventDefault();
            scan();
        });

        // Auto-scan after window load + 500ms
        if (document.readyState === 'complete') {
            setTimeout(scan, 500);
        } else {
            window.addEventListener('load', function () {
                setTimeout(scan, 500);
            });
        }
    }

    if (!window.llapgochjQueryLoader.loaded) {
        window.addEventListener('llapgoch-jquery-loaded', function () {
            init(window.llapgochjQueryLoader.$);
        });
    } else {
        init(window.llapgochjQueryLoader.$);
    }
}());
