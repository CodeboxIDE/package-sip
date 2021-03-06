var SIP = require("sip.js");
var settings = require("./settings");
var templatePanel = require("./templates/panel.html");

var View = codebox.require("hr.view");
var $ = codebox.require("jquery");
var dialogs = codebox.require("utils/dialogs");
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
        this.config = {};
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
        this.session = null;
    },

    // Define default config
    setConfig: function(config) {
        this.config = config;
    },

    // Define state
    setStatus: function(msg) {
        this.$('p').text(msg);
    },

    // Start a call to a number
    call: function(number) {
        var that = this;
        this.options.number = number;

        // Creates the anonymous user agent so that you can make calls
        var userAgent = new SIP.UA();

        // Here you determine whether the call has video and audio
        var options = _.defaults(this.config, {
            media: {
                constraints: {
                    audio: true,
                    video: false
                },
                render: {
                    remote: {
                        video: this.$('.remote').get(0)
                    }
                }
            }
        });

        // Makes the call
        this.session = userAgent.invite(this.options.number, options);
        this.session.on('connecting', function (response, cause) {
            that.setStatus('Connecting...');
        });
        this.session.on('progress', function (response, cause) {
            that.setStatus('Progressing...');
        });
        this.session.on('failed', function (response, cause) {
            console.log(response, cause);
            dialogs.alert("Call Failed: "+response.reason_phrase);
            that.hangup();
        });
        this.session.on('terminated', function (response, cause) {
            console.log("Terminated", response, cause);
            that.hangup();
        });

        this.update();
        this.toggle(true);
    },

    // Toggle visibility
    toggle: function(t) {
        this.$el.toggleClass('visible', t);
    }
});

module.exports = Controller;
