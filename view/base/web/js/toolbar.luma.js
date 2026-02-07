(function () {
    function init($) {
        // Only initialise on Luma (RequireJS) pages
        if (!window.require) {
            return;
        }

        var $container = $('.js-luma-panel-content');
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

        function scan() {
            var html = '';

            // RequireJS Modules
            try {
                var defined = Object.keys(require.s.contexts._.defined);
                html += '<div class="devbar-jspanel__section">';
                html += '<div class="devbar-jspanel__section-header js-jspanel-toggle">';
                html += '<span class="devbar-jspanel__arrow">▶</span> ';
                html += 'RequireJS Modules <span class="devbar-jspanel__count">' + defined.length + '</span>';
                html += '</div>';
                html += '<div class="devbar-jspanel__section-body" style="display:none">';

                defined.sort();
                for (var i = 0; i < defined.length; i++) {
                    html += '<div class="devbar-jspanel__item">';
                    html += '<span class="devbar-jspanel__item-name">' + escapeHtml(defined[i]) + '</span>';
                    html += '</div>';
                }

                html += '</div></div>';
            } catch (e) {
                // require.s not available
            }

            // UI Components
            try {
                var registry = require('uiRegistry');
                if (registry && registry._elems && registry._elems.length) {
                    html += '<div class="devbar-jspanel__section">';
                    html += '<div class="devbar-jspanel__section-header js-jspanel-toggle">';
                    html += '<span class="devbar-jspanel__arrow">▶</span> ';
                    html += 'UI Components <span class="devbar-jspanel__count">' + registry._elems.length + '</span>';
                    html += '</div>';
                    html += '<div class="devbar-jspanel__section-body" style="display:none">';

                    for (var j = 0; j < registry._elems.length; j++) {
                        var comp = registry._elems[j];
                        var name = comp.name || comp.index || '(unnamed)';
                        var compPath = comp.component || '';

                        html += '<div class="devbar-jspanel__item">';
                        html += '<span class="devbar-jspanel__item-name">' + escapeHtml(name) + '</span>';
                        if (compPath) {
                            html += '<span class="devbar-jspanel__item-detail">' + escapeHtml(compPath) + '</span>';
                        }
                        html += '</div>';
                    }

                    html += '</div></div>';
                }
            } catch (e) {
                // uiRegistry not available
            }

            // data-mage-init
            var mageInits = document.querySelectorAll('[data-mage-init]');
            if (mageInits.length) {
                html += '<div class="devbar-jspanel__section">';
                html += '<div class="devbar-jspanel__section-header js-jspanel-toggle">';
                html += '<span class="devbar-jspanel__arrow">▶</span> ';
                html += 'data-mage-init <span class="devbar-jspanel__count">' + mageInits.length + '</span>';
                html += '</div>';
                html += '<div class="devbar-jspanel__section-body" style="display:none">';

                for (var k = 0; k < mageInits.length; k++) {
                    var el = mageInits[k];
                    var tag = el.tagName.toLowerCase();
                    var id = el.id ? '#' + el.id : '';
                    var cls = el.className ? '.' + el.className.split(/\s+/).slice(0, 2).join('.') : '';
                    var label = tag + id + cls;
                    var raw = el.getAttribute('data-mage-init');

                    html += '<div class="devbar-jspanel__item devbar-jspanel__item--expandable js-jspanel-expand">';
                    html += '<span class="devbar-jspanel__item-name">' + escapeHtml(truncate(label, 60)) + '</span>';
                    html += '<span class="devbar-jspanel__item-detail">' + escapeHtml(truncate(raw, 80)) + '</span>';
                    html += '<div class="devbar-jspanel__item-expanded" style="display:none">';
                    html += '<pre class="devbar-jspanel__pre">' + escapeHtml(raw) + '</pre>';
                    html += '</div>';
                    html += '</div>';
                }

                html += '</div></div>';
            }

            // x-magento-init
            var xInits = document.querySelectorAll('script[type="text/x-magento-init"]');
            if (xInits.length) {
                html += '<div class="devbar-jspanel__section">';
                html += '<div class="devbar-jspanel__section-header js-jspanel-toggle">';
                html += '<span class="devbar-jspanel__arrow">▶</span> ';
                html += 'x-magento-init <span class="devbar-jspanel__count">' + xInits.length + '</span>';
                html += '</div>';
                html += '<div class="devbar-jspanel__section-body" style="display:none">';

                for (var m = 0; m < xInits.length; m++) {
                    var content = xInits[m].textContent.trim();
                    var parsed;
                    try {
                        parsed = JSON.parse(content);
                    } catch (e) {
                        parsed = null;
                    }

                    if (parsed) {
                        var selectors = Object.keys(parsed);
                        for (var n = 0; n < selectors.length; n++) {
                            var sel = selectors[n];
                            var widgets = Object.keys(parsed[sel]);
                            html += '<div class="devbar-jspanel__item devbar-jspanel__item--expandable js-jspanel-expand">';
                            html += '<span class="devbar-jspanel__item-name">' + escapeHtml(sel) + '</span>';
                            html += '<span class="devbar-jspanel__item-detail">' + escapeHtml(widgets.join(', ')) + '</span>';
                            html += '<div class="devbar-jspanel__item-expanded" style="display:none">';
                            html += '<pre class="devbar-jspanel__pre">' + escapeHtml(JSON.stringify(parsed[sel], null, 2)) + '</pre>';
                            html += '</div>';
                            html += '</div>';
                        }
                    } else {
                        html += '<div class="devbar-jspanel__item">';
                        html += '<span class="devbar-jspanel__item-name">(parse error)</span>';
                        html += '<div class="devbar-jspanel__item-expanded">';
                        html += '<pre class="devbar-jspanel__pre">' + escapeHtml(truncate(content, 200)) + '</pre>';
                        html += '</div>';
                        html += '</div>';
                    }
                }

                html += '</div></div>';
            }

            if (!html) {
                html = '<div class="devbar-jspanel__empty">No Luma JS data found.</div>';
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
        $(document).on('click', '.js-luma-rescan', function (e) {
            e.preventDefault();
            scan();
        });

        // Auto-scan after delay
        setTimeout(scan, 1500);
    }

    if (!window.llapgochjQueryLoader.loaded) {
        window.addEventListener('llapgoch-jquery-loaded', function () {
            init(window.llapgochjQueryLoader.$);
        });
    } else {
        init(window.llapgochjQueryLoader.$);
    }
}());
