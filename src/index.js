require("./stylesheets/main.less");

var Controller = require("./controller");

var Q = codebox.require("q");
var $ = codebox.require("jquery");
var commands = codebox.require("core/commands");
var dialogs = codebox.require("utils/dialogs");

var controller = new Controller();
controller.appendTo($('body'));

commands.register({
    id: "sip.call",
    title: "SIP: Call",
    run: function(args, ctx) {
    	return Q()
    	.then(function() {
    		if (args.number) return args.number;
    		return dialogs.prompt("Enter a phone number to call:");
    	})
    	.then(function(number) {
    		controller.call(number);
    	});
    }
});

// Make controller accessibl by other packages
codebox.sip = controller;
