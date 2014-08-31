/*!
Ajax-suggest, a small jquery plugin adding google-like suggestion 
list on input typing

Version 0.1.0
Full source at https://github.com/AdamSGit/ajax-suggest
Copyright (c) 2014 Adam Santoro http://adamsantoro.fr

This plugin is released on GPL licence
*/
(function($) {

    $.fn.ajaxSuggest = function(args) {

        var that = this;

        this.s = $.extend({
            // Time since the last timeout
            t: null,
            // Delay min to execute a timeout
            delay: 400,
            // If the element is displayed or not
            s: false,
            // Min length to launch research
            minLength: 3,
            // Ajax url request
            url: '',
            // current length
            cl: 0,
            // No result
            noResult: 'No result found',
            // Field to display in returned json object
            field: 'value',
            // Javascript item object to use
            arr: null,

        }, args);

        this.init = function() {

            this.ul = $('<ul>');

            this.el = $('<div>')
                .addClass('ajax-suggest')
                .append(this.ul);

            this.target = $(this.get(0));

            this.target.prop('autocomplete', 'off');

            if (this.target.val().length) this.s.cl = this.target.val().length;

            if (this.target.attr('data-url')) this.s.url = this.target.attr('data-url');

            $('body').first().append(this.el.css('visibility', 'hidden'));

            this.target.on('keyup', evt.start);

        };

        this.position = function() {

            var o = this.target.offset(),
                inputPos = 0,
                top = 0,
                maxHeight = 0,
                st = $(document).scrollTop();

            // check margin at top and bottom of the input. If the space at bottom is less than 30% of the screen height, place the suggest list at top.

            inputPos = (o.top + this.target.outerHeight()) - st;

            if (inputPos / $(window).height() > 0.7) {
                maxHeight = o.top - st - 20;
            } else {
                maxHeight = $(window).height() - inputPos - 20;
            }

            this.el.css({
                maxHeight: maxHeight
            });

            if (inputPos / $(window).height() > 0.7) {
                top = o.top - this.el.outerHeight() - 10;
            } else {
                top = o.top + this.target.outerHeight() + 10;
            }

            this.el.css({
                width: this.target.outerWidth(),
                top: top,
                left: o.left
            });

            this.t = top;

            this.l = o.left;

            this.w = this.el.outerWidth();

            this.h = this.el.outerHeight();

        };

        this.max_exec = function(callback, t) {

            var sd = t !== undefined ? t : this.s.delay;

            if (!this.toDo || !this.s.t || new Date().getTime() * 1000 - this.s.t < sd) {

                if (this.toDo) clearTimeout(this.toDo);

                this.toDo = setTimeout(callback, sd);

                this.s.t = new Date().getTime() * 1000;

            }

        };

        this.resize = function() {

            this.max_exec((function(t) {
                return function() {
                    t.position();
                    t.toDo = null;
                }
            })(this));

        };

        this.show = function() {

            var that = this;

            this.position();

            if (!this.s.s) {

                this.el.css('visibility', 'visible');

                $(window).on('resize', evt.resize);

                $(window).on('click', evt.hide_mouse);

                $(window).on('keyup', evt.escape);

                this.s.s = true;

            }

        };

        this.hide = function() {

            this.s.s = false;

            this.el.css('visibility', 'hidden');

            $(window).off('resize', evt.resize);

            this.ul.find('li:not(.disabled)').off('click');

        };

        this.hide_mouse = function(e) {

            if ((e.pageX < this.l || e.pageX > this.l + this.w) && (e.pageY < this.t || e.pageY > this.t)) this.hide();

        };

        this.escape = function(e) {

            if (e.keyCode === 27) this.hide();

        };

        this.start = function() {

            var that = this;

            if (this.target.val().length >= this.s.minLength) {

                // Launch request

                if (this.target.val().length != this.s.cl) {
                    this.max_exec((function(t) {
                        return function() {
                            if (that.s.arr) {
                                t.getScope();
                            } else {
                                t.getAjax();
                            }
                            t.toDo = null;
                        }
                    })(this), 700);
                }
            } else if (this.s.s) this.empty().hide();

            this.s.cl = this.target.val().length;

        };

        this.empty = function() {

            this.ul.empty();

            $(window).off('keydown', evt.browse);

            return this;

        };

        this.getAjax = function() {

            var that = this;

            if (this.s.url) {

                if (this.xhr && this.xhr.readystate != 4) this.xhr.abort();

                this.xhr = $.ajax({
                        url: this.s.url,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            val: this.target.val()
                        },
                    })
                    .done(function(data) {
                        that.done.call(that, data);
                    }).fail(this.fail);

            }

        };

        this.getScope = function() {

            if (this.s.arr && Object.prototype.toString.call(this.s.arr) === '[object Array]') {

                var output = [],
                    val = this.target.val();

                for (var i in this.s.arr) {
                    if (this.s.arr[i][this.s.field].toLowerCase().indexOf(val.toLowerCase()) !== -1) {
                        output.push(this.s.arr[i]);
                    }
                }

                this.done(output);

            }

        };

        this.done = function(data) {

            this.empty();

            if (data.length) {

                this.data = data;

                for (var i in data) {

                    var li = $('<li>').attr('data-key', i).text(data[i][this.s.field]);

                    if (i == 0) li.addClass('active');

                    this.ul.append(li);

                }

                $(window).on('keydown', evt.browse);

                this.ul.find('li:not(.disabled)').on('click', function(e) {
                    evt.click_li(e, $(this).attr('data-key'));
                });

            } else this.ul.append($('<li>').attr('data-key', 0).text(this.s.noResult).addClass('disabled'));

            this.show();

        };

        this.fail = function(xhr, text, error) {
            console.log('Ajax error : ' + text)
        };

        this.browse = function(e) {

            if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 13) e.preventDefault();

            var els = this.ul.find('li:not(.disabled)'),
                el = elthis.s.filter('.active').first();

            if (els.length > 1) {

                if (e.keyCode === 40) {

                    el.removeClass('active');

                    if (el.next().length) {

                        el.next().addClass('active');

                    } else {

                        els.first().addClass('active');

                    }

                } else if (e.keyCode === 38) {

                    el.removeClass('active');

                    if (el.prev().length) {

                        el.prev().addClass('active');

                    } else {

                        els.last().addClass('active');

                    }

                }

            }

            if (els.length && (e.keyCode === 13 || e.keyCode === 9)) {

                this.set(el.attr('data-key'));

            }

        };

        this.click_li = function(e, t) {

            e.preventDefault();

            this.set(t);

        };

        this.set = function(key) {

            if (this.data[key] !== undefined) {

                var el = this.data[key];

                this.target.val(el[this.s.field]);

                this.s.cl = el[this.s.field].length;

                for (var i in el) {

                    if (i !== this.s.field) {

                        var str = 'ajax-suggest-' + i;

                        input = $('#' + str);

                        if (!input.length) input = $('<input>').prop({
                            id: str,
                            name: str,
                            type: 'hidden'
                        }).insertBefore(this.target);

                        input.val(el[i]);

                    }

                }

            }

            this.empty().hide();

        };

        this.toDo = null;

        this.w = null;

        this.h = null;

        this.t = null;

        this.l = null;

        this.xhr = null;

        this.data = null;

        var evt = {

            show: function() {
                that.show();
            },

            resize: function() {
                that.resize();
            },

            hide_mouse: function(e) {
                that.hide_mouse(e);
            },

            escape: function(e) {
                that.escape(e);
            },

            start: function() {
                that.start();
            },

            browse: function(e) {
                that.browse(e);
            },

            click_li: function(e, t) {
                that.click_li(e, t);
            },

        }

        try {

            if (this.length) {

                if (this.get(0).nodeName !== 'INPUT') throw new TypeError('The targeted element must be an input ! Interruption.');

                if (this.get(0).name === '') throw new TypeError('The targeted element has no name ! Interruption.');

                this.init();

                return this;

            }

        } catch (e) {
            console.log(e.name + ': ' + e.message);
        }

    }

})(jQuery);

(function() {
    $('[data-ajax-suggest-input]').ajaxSuggest();
})();