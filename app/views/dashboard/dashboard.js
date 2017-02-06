var frameModule = require("ui/frame");
var appSettings = require("application-settings");
var view = require("ui/core/view");
var frameModule = require("ui/frame");
var fetchModule = require("fetch");
var loadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;
var listViewModule = require("ui/list-view");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array").ObservableArray;
var googleAnalytics = require("nativescript-google-analytics");

/* Ads */
var admob = require("nativescript-admob");

var page;
var drawer;

/* Loading Indicator */
var loader = new loadingIndicator;
var loaderOptions = {
    message: 'Loading...', progress: 0,
    android: { indeterminate: true, cancelable: false, max: 100, progressNumberFormat: "%1d/%2d", progressPercentFormat: 0.53, progressStyle: 1, secondaryProgress: 1 },
    ios: { details: "Please wait", square: false, margin: 10, dimBackground:true, color: "#4b9ed6" }
};
loader.show(loaderOptions);

/* API */
var apiURL = appSettings.getString("apiURL");

/**
 * Page Functions
 */
exports.loaded = function(args){
    /* Load Data - Leagues */
    var userId = appSettings.getString("id");
    var groupArray = [];
    var pageData;
    page = args.object;

    /* Ads */
    admob.createBanner({
        // if this 'view' property is not set, the banner is overlayed on the current top most view
        // view: ..,
        testing: true, // set to false to get real banners
        size: admob.AD_SIZE.SMART_BANNER, // anything in admob.AD_SIZE, like admob.AD_SIZE.SMART_BANNER
        //iosBannerId: "ca-app-pub-XXXXXX/YYYYYY", // add your own
        androidBannerId: "ca-app-pub-6311725785805657/1855866252", // add your own
        // Android automatically adds the connected device as test device with testing:true, iOS does not
        //iosTestDeviceIds: ["yourTestDeviceUDIDs", "canBeAddedHere"],
        margins: {
            // if both are set, top wins
            //top: 10
            bottom: 0
        }
    }).then(
        function() {
            console.log("admob createBanner done");
        },
        function(error) {
            console.log("admob createBanner error: " + error);
        }
    )

    fetchModule.fetch(apiURL+"groups/user/"+userId,{
            method: "get"
        }).then(function(response){
            var r = JSON.parse(response._bodyText);
            if(r.response=="success"){
                r.data[0].forEach(function(e){
                    var item = { icon: e.captain==appSettings.getString("id") ? "res://icon_league_captain" : "res://icon_league_player", name: e.name, date: e.date };
                    groupArray.push(item);
                });
            }

            var height = groupArray.length * 40;
            var groupsHeight = height;

            /* Page Data */
            pageData = new observableModule.fromObject({
                groups: new observableArray(groupArray),
                profilePic: appSettings.getString("img"),
                username: appSettings.getString("username"),
                scorevalue: "420",
                groupsHeight: groupsHeight
            });


            page.bindingContext = pageData;
            drawer = view.getViewById(page,"sideDrawer");
            loader.hide();
        });



    console.log("Dashboard loaded successfully");

    googleAnalytics.logView("Dashboard");
}

exports.toggleDrawer = toggleDrawer;
function toggleDrawer(args){

    drawer.toggleDrawerState();
}

exports.navSettings = navSettings;
function navSettings(){
    navigate("settings");
}

exports.navTopUp = navTopUp;
function navTopUp(){
    navigate("top-up");
}

exports.navGroupStart = navGroupStart;
function navGroupStart(){
    frameModule.topmost().navigate({
        moduleName: "views/group-start/group-start",
        aniamted: true,
        transition: {
            name: "slideLeft",
            curve: "easeIn"
        }
    });
}

function navigate(view){
    toggleDrawer();
    frameModule.topmost().navigate({
        moduleName: "views/"+view+"/"+view,
        animated: true,
        clearHistory: true,
        transition: {
            name: "fade",
            curve: "easeIn"
        }
    });
}
