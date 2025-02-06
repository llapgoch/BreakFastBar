(function () {
    function init($) {
        $.widget('llapgoch.breakfastbarcontroller', {
            options: {
                toggleAction: 'click .js-breakfastbar-toggle',
                togglableSelector: '.js-breakfastbar-togglable',
                lsKey: 'breakfastbar-visible',
                visible: true
            },

            _create: function () {
                this._super();
                this._addEvents();

                // Get the visible state from local storage
                this.options.visible = !!(parseInt(localStorage.getItem(this.options.lsKey), 10));

                if (this.options.visible) {
                    this._showBreakfastbar();
                } else {
                    this._hideBreakfastbar();
                }
            },

            // add event to logo
            _addEvents: function () {
                var events = {},
                    self = this;

                events[this.options.toggleAction] = function () {
                    self._toggleBreakfastbar();
                };

                this._on(this.element, events);
            },

            _toggleBreakfastbar: function () {
                if (this.options.visible) {
                    this._hideBreakfastbar();
                } else {
                    this._showBreakfastbar();
                }
            },

            _hideBreakfastbar: function () {
                $(this.options.togglableSelector, this.element).hide();
                this.options.visible = false;
                // Set the localStorage value
                this.updateLocalStorage();
            },

            _showBreakfastbar: function () {
                $(this.options.togglableSelector, this.element).show();
                this.options.visible = true;
                this.updateLocalStorage();
            },

            updateLocalStorage: function () {
                localStorage.setItem(this.options.lsKey, this.options.visible ? 1 : 0);
            }
        });
        $(document).ready(function () {
            $('.js-breakfastbar-controller').breakfastbarcontroller();
        });

        return $.llapgoch.breakfastbarcontroller;
    };


    if (!window.llapgochjQueryLoader.loaded) {
        window.addEventListener('llapgoch-jquery-loaded', function () {
            init(window.llapgochjQueryLoader.$);
        });
    } else {
        init(window.llapgochjQueryLoader.$);
    }

}());
