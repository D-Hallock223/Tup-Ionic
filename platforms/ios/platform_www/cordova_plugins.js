cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com.phonegap.plugins.nativesettingsopener.Settings",
      "file": "plugins/com.phonegap.plugins.nativesettingsopener/www/settings.js",
      "pluginId": "com.phonegap.plugins.nativesettingsopener",
      "clobbers": [
        "cordova.plugins.settings"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-dialogs.notification",
      "file": "plugins/cordova-plugin-dialogs/www/notification.js",
      "pluginId": "cordova-plugin-dialogs",
      "merges": [
        "navigator.notification"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.Coordinates",
      "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "Coordinates"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.PositionError",
      "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "PositionError"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.Position",
      "file": "plugins/cordova-plugin-geolocation/www/Position.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "Position"
      ]
    },
    {
      "id": "cordova-plugin-geolocation.geolocation",
      "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
      "pluginId": "cordova-plugin-geolocation",
      "clobbers": [
        "navigator.geolocation"
      ]
    },
    {
      "id": "cordova-plugin-google-analytics.UniversalAnalytics",
      "file": "plugins/cordova-plugin-google-analytics/www/analytics.js",
      "pluginId": "cordova-plugin-google-analytics",
      "clobbers": [
        "analytics"
      ]
    },
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open",
        "window.open"
      ]
    },
    {
      "id": "cordova-plugin-ionic-keyboard.keyboard",
      "file": "plugins/cordova-plugin-ionic-keyboard/www/ios/keyboard.js",
      "pluginId": "cordova-plugin-ionic-keyboard",
      "clobbers": [
        "window.Keyboard"
      ]
    },
    {
      "id": "cordova-plugin-ionic-webview.IonicWebView",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/util.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "Ionic.WebView"
      ]
    },
    {
      "id": "cordova-plugin-ionic-webview.ios-wkwebview-exec",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/ios/ios-wkwebview-exec.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "cordova.exec"
      ]
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "ionic-plugin-keyboard.keyboard",
      "file": "plugins/ionic-plugin-keyboard/www/ios/keyboard.js",
      "pluginId": "ionic-plugin-keyboard",
      "clobbers": [
        "cordova.plugins.Keyboard"
      ],
      "runs": true
    },
    {
      "id": "uk.co.workingedge.phonegap.plugin.LaunchNavigator.LaunchNavigator",
      "file": "plugins/uk.co.workingedge.phonegap.plugin.LaunchNavigator/www/ios/launchnavigator.js",
      "pluginId": "uk.co.workingedge.phonegap.plugin.LaunchNavigator",
      "clobbers": [
        "launchnavigator"
      ]
    }
  ];
  module.exports.metadata = {
    "com.phonegap.plugins.nativesettingsopener": "1.0",
    "cordova-plugin-device": "1.1.0",
    "cordova-plugin-dialogs": "1.1.1",
    "cordova-plugin-geolocation": "1.0.1",
    "cordova-plugin-google-analytics": "0.8.1",
    "cordova-plugin-inappbrowser": "1.1.0",
    "cordova-plugin-ionic-keyboard": "2.2.0",
    "cordova-plugin-ionic-webview": "4.1.3",
    "cordova-plugin-splashscreen": "3.0.0",
    "cordova-plugin-statusbar": "2.0.0",
    "cordova-plugin-whitelist": "1.2.1",
    "ionic-plugin-keyboard": "1.0.8",
    "uk.co.workingedge.phonegap.plugin.LaunchNavigator": "2.9.6"
  };
});