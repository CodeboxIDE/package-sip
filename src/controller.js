var SIP = require("sip.js");
var settings = require("./settings");
var templatePanel = require("./templates/panel.html");

var View = codebox.require("hr.view");
var $ = codebox.require("jquery");
var rpc = codebox.require("core/rpc");

var Controller = View.Template.extend({
    template: templatePanel,
    className: "component-controller-sip",
    events: {
        "click .do-hangup": "hangup"
    },

    initialize: function(options) {
        Controller.__super__.initialize.apply(this, arguments);

        this.session = null;
    },

    templateContext: function() {
        return {
            number: this.options.number
        };
    },

    render: function() {
        return Controller.__super__.render.apply(this, arguments);
    },

    finish: function() {
        return Controller.__super__.finish.apply(this, arguments);
    },

    // Hangup
    hangup: function(e) {
        if (e) e.preventDefault();

        if (this.session) this.session.bye();
        this.toggle(false);
    },

    // Start a call to a number
    call: function(number) {
        this.options.number = number;

        // Creates the anonymous user agent so that you can make calls
        var userAgent = new SIP.UA();

        // Here you determine whether the call has video and audio
        var options = {
            media: {
                constraints: {
                    audio: true,
                    video: false
                },
                render: {
                    remote: {
                        video: this.$('.remote').get(0)
                    },
                    /*local: {
                        video: document.getElementById('localVideo')
                    }*/
                }
            }
        };

        // Makes the call
        this.session = userAgent.invite('sip:'+this.options.number, options);

        this.update();
        this.toggle(true);
    },

    // Toggle visibility
    toggle: function(t) {
        this.$el.toggleClass('visible', t);
    }
});

module.exports = Controller;
