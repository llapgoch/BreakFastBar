(function () {
    function init($) {
        $.widget('llapgoch.breakfastbar', {
            options: {
                // Actions
                identifier: 'llapgochBreakfastbar',
                buttonLinkAction: 'click .js-devbar__button-link',
                toolbarToggleAction: 'click .js-devbar__toggle',

                // Selectors
                expandAllSelector: '.js-expand-all',
                toolbarToggleItemSelector: '.js-devbar__toggle',
                toolbarContainerSelector: '.devbar',
                toolbarListItemSelector: '.devbar__list-item',
                toolbarItemSelector: '.js-devbar__item',
                toolbarListSelector: '.devbar__list',
                toolbarListInnerSelector: '.devbar__ul',

                toolbarListInfoSelector: '.devbar__info',
                toolbarListInfoActiveClass: 'is-active',

                // Active Classes
                toolbarItemActiveClass: 'devbar__item--active',
                toolbarToggleActiveClass: 'is-active',
                itemOpenClass: 'is-active',

                // Settings
                animateCloseTime: 300,
                animateOpenTime: 300,

                // localStorage
                lsExpandedKey: 'breakfastbar-expanded-all',
            },

            _create: function () {
                this._super();
                this._addEvents();
                this._restoreExpandState();
            },

            // Other classes should use these instead of accessing the options directly in case the variables change
            getListItemSelector: function () {
                return this.options.toolbarListItemSelector;
            },

            getToolbarListItemActiveClass: function () {
                return this.options.toolbarListItemActiveClass;
            },

            getToolbarInfoSelector: function () {
                return this.options.toolbarListInfoSelector;
            },

            getToolbarInfoActiveClass: function () {
                return this.options.toolbarListInfoActiveClass;
            },

            getToolbarItemSelector: function () {
                return this.options.toolbarItemSelector;
            },

            closeAllPanels: function () {
                var self = this;
                $(this.options.toolbarItemSelector, this.getToolbarContainer()).each(function () {
                    var instance = $(this).data(self.options.identifier);
                    instance && instance.closePanel();
                });
            },

            closePanel: function () {
                this.element.removeClass(this.options.toolbarItemActiveClass);
            },

            getToolbarContainer: function () {
                return this.element.closest(this.options.toolbarContainerSelector);
            },

            expandAllToggles: function () {
                var self = this,
                    $items = $(this.options.toolbarToggleItemSelector, this.element);

                $items.each(function (i, item) {
                    self.expandToggleItem($(item));
                });

                this._setExpanded(true);
            },

            collapseAllToggles: function () {
                var self = this,
                    activeClass = this.options.toolbarToggleActiveClass,
                    $items = $(this.options.toolbarToggleItemSelector, this.element);

                $items.each(function (i, item) {
                    var $toggle = $(item),
                        $item = $toggle.closest(self.options.toolbarListItemSelector)
                            .find(self.options.toolbarListSelector).first();

                    $item.animate({'height': 0}, self.options.animateCloseTime, function () {
                        $item.removeClass(activeClass);
                    });
                    $toggle.removeClass(activeClass);
                });

                this._setExpanded(false);
            },

            _setExpanded: function (expanded) {
                localStorage.setItem(this.options.lsExpandedKey, expanded ? '1' : '0');
                this._updateExpandLabel(expanded);
            },

            _updateExpandLabel: function (expanded) {
                var $link = $(this.options.expandAllSelector, this.element);
                if ($link.length) {
                    $link.text(expanded ? $link.data('text-collapse') : $link.data('text-expand'));
                }
            },

            _restoreExpandState: function () {
                var expanded = localStorage.getItem(this.options.lsExpandedKey) === '1';
                if (expanded) {
                    this.expandAllToggles();
                }
                this._updateExpandLabel(expanded);
            },

            expandToggleItem: function ($this) {
                var activeClass = this.options.toolbarToggleActiveClass,
                    $item = $this.closest(this.options.toolbarListItemSelector).find(this.options.toolbarListSelector).first(),
                    $inner = $item.find(this.options.toolbarListInnerSelector).first(),
                    self = this;


                $item.animate({
                    'height': $inner.outerHeight()
                }, {
                    'complete': function () {
                        $item.addClass(activeClass);
                        $item.css('height', 'auto');
                    },
                    'duration': self.options.animateCloseTime
                });

                $this.addClass(activeClass);
            },

            _addEvents: function () {
                var events = {},
                    self = this;

                events["click " + this.options.expandAllSelector] = function (event) {
                    event.preventDefault();
                    var expanded = localStorage.getItem(self.options.lsExpandedKey) === '1';
                    if (expanded) {
                        self.collapseAllToggles();
                    } else {
                        self.expandAllToggles();
                    }
                }

                // Button click event
                events[this.options.buttonLinkAction] = function (event) {
                    event.preventDefault();

                    var $item = $(event.currentTarget).closest(this.options.toolbarItemSelector),
                        active = $item.hasClass(this.options.toolbarItemActiveClass);

                    this.closeAllPanels();

                    if (!active) {
                        $item.addClass(this.options.toolbarItemActiveClass);
                    } else {
                        $item.removeClass(this.options.toolbarItemActiveClass);
                    }
                };

                // Toggles click events
                events[this.options.toolbarToggleAction] = function (event) {
                    event.preventDefault();
                    var self = this;

                    // find the associated item
                    var $this = $(event.currentTarget),
                        $item = $this.closest(this.options.toolbarListItemSelector)
                            .find(this.options.toolbarListSelector).first(),
                        $inner = $item.find(this.options.toolbarListInnerSelector).first(),
                        activeClass = this.options.toolbarToggleActiveClass;

                    if ($item.hasClass(activeClass)) {
                        $item.removeClass(activeClass);
                        $this.removeClass(activeClass);

                        $item.css('height', 'auto');

                        $item.animate({
                            'height': 0
                        }, self.options.animateOpenTime);

                        $item.removeClass(activeClass);
                    } else {
                        self.expandToggleItem($this);
                    }
                };

                this._on(this.element, events);
            }
        });

        $(document).ready(function () {
            $('.js-breakfastbar-widget').breakfastbar();
        });

        return $.llapgoch.breakfastbar;
    };


    if (!window.llapgochjQueryLoader.loaded) {
        window.addEventListener('llapgoch-jquery-loaded', function () {
            init(window.llapgochjQueryLoader.$);
        });
    } else {
        init(window.llapgochjQueryLoader.$);
    }
}());