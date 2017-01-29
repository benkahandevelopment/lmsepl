var frameModule = require("ui/frame");
var appSettings = require("application-settings");
var view = require("ui/core/view");
var dialogs = require("ui/dialogs");
var imageModule = require("image-source");
var fs = require("file-system");
var imagepicker = require("nativescript-imagepicker");
var loadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;
var http = require("http");
var permissions = require( "nativescript-permissions" );

var loader = new loadingIndicator;
var loaderOptions = {
    message: 'Loading...',
    progress: 0,
    android: {
        indeterminate: true,
        cancelable: false,
        max: 100,
        progressNumberFormat: "%1d/%2d",
        progressPercentFormat: 0.53,
        progressStyle: 1,
        secondaryProgress: 1
    },
    ios: {
        details: "Please wait",
        square: false,
        margin: 10,
        dimBackground:true,
        color: "#4b9ed6"
    }
};

loader.show(loaderOptions);

var drawer;
var imgLocal;

var username = appSettings.getString("username");
var img = appSettings.getString("img");

exports.loaded = function(args){
    var page = args.object;
    page.bindingContext = {
        //"toggleableItem" : settings[1][2],
        "username" : username,
        "img" : img
    };
    drawer = view.getViewById(page,"sideDrawer");

    var usernameField = view.getViewById(page,'username');
        var fArray = [];
        fArray[0] = new android.text.InputFilter.LengthFilter(16);
        usernameField.android.setFilters(fArray);

    loader.hide();
    console.log("Settings page successfully loaded");
}

exports.toggleDrawer = toggleDrawer;
function toggleDrawer(args){
    drawer.toggleDrawerState();
}

exports.navDashboard = navDashboard;
function navDashboard(){
    frameModule.topmost().navigate("views/dashboard/dashboard");
}

exports.save = save;
function save(args){
    var page = args.object.bindingContext;
    //appSettings.setBoolean("toggleableItem", page["toggleableItem"]);
    var n_username = page["username"];

    console.log("Settings saved");
}

exports.changeImg = changeImg;
function changeImg(args){
    var page = args.object;
    console.log("Image change selected");
    loader.show(loaderOptions);

    var permiss;
    permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "We need this permission to allow us to save your new Avatar to your profile")
        .then(function(){
            permiss = true;
            console.log("Permissions accepted");
        })
        .catch(function(){
            permiss = false;
            console.log("Permissions denied");
        });

    if(permiss){
        var context = imagepicker.create({
            mode: "single"
        });
        context
            .authorize()
            .then(function(){
                return context.present();
            }).then(function(selection){
                imgLocal = selection[0].uri;
                imgLocalFile = selection[0].fileUri;
                page.bindingContext = {
                    "img" : imgLocal
                };

                http.getImage(imgLocalFile).then(function(r){
                    var imgview = page.getViewById("img");
                    imgview.imageSource = r;
                    var saved = imgView.imageSource.saveToFile(fs.path.join(fs.knownFolders.documents().path, "profilePicNew.jpg"), "jpg");
                })

                //loader.hide();
            }).catch(function(e){
                console.log("File pick error: "+e);
            });
    }

}

exports.logout = logout;
function logout(args){
    dialogs.confirm({
        title: "Log Out",
        message: "Are you sure you want to log out? All your data on this device will be removed, but if you log in again your data will be restored.",
        okButtonText: "Log Out",
        cancelButtonText: "Cancel"
    }).then(function(result){
        if(result){
            appSettings.clear();
            console.log("User data deleted");
            frameModule.topmost().navigate("views/start/start");
        } else {
            return false;
        }
    })
}