(function () {
    function init($) {
        $.widget('llapgoch.breakfastbarcontroller', {
            options: {
                toggleSelector: '.js-breakfastbar-toggle',
                togglableSelector: '.js-breakfastbar-togglable',
                visible: true
            },

            _create: function () {
                this._super();
                this._addEvents();
            },

            // add event to logo
            _addEvents: function () {
                var self = this;
                $(this.options.toggleSelector).on('click', function () {
                    self._toggleBreakfastbar();
                });
            },

            _toggleBreakfastbar: function () {
                if (this.options.visible) {
                    this._hideBreakfastbar();
                } else {
                    this._showBreakfastbar();
                }
            },

            _hideBreakfastbar: function () {
                this.options.visible = false;
                $(this.options.togglableSelector, this.element).hide();
            },

            _showBreakfastbar: function () {
                this.options.visible = true;
                $(this.options.togglableSelector, this.element).show();
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
