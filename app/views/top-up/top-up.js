var frameModule = require("ui/frame");
var appSettings = require("application-settings");
var dialogs = require("ui/dialogs");
var observable = require("data/observable");
var loadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;


var loader = new loadingIndicator;
loader.show({
    message: 'Loading...', progress: 0,
    android: { indeterminate: true, cancelable: false, max: 100, progressNumberFormat: "%1d/%2d", progressPercentFormat: 0.53, progressStyle: 1, secondaryProgress: 1 },
    ios: { details: "Please wait", square: false, margin: 10, dimBackground:true, color: "#4b9ed6" }
});
var page;
var apiURL = appSettings.getString("apiURL");

exports.loaded = function(args){
    page = args.object;
    page.bindingContext = {};

    console.log(1);
    loader.hide();
    console.log("Settings Page successfully loaded");
}
