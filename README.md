# Guitar-Effects

Webaudio/HTML5 effects for guitar

Guitar-Effects+ will be available soon, all changes in GE will be added to GE+

[Demo online](https://larutaproducciones.xyz/guitareffects/online/)

[Official Page](https://larutaproducciones.xyz/guitareffects/)

[Support me on patreon](https://www.patreon.com/marianofromlaruta)

## Compile the hybrid app

### Linux, Mac OS & Windows

Use Electron or NW.js. Instructions soon.

### Linux

The fast way is use Qt Creator, just create a new QT Quick project, in the main.qml replace the text for this one:

~~~~
import QtQuick 2.6
import QtQuick.Window 2.2
import QtWebView 1.1

Window {
    visible: true
    width: 800
    height: 480
    title: qsTr("Guitar-Effects")
    WebView{
        url: "qrc:///www/index.html"
        anchors.fill: parent

    }
}
~~~~

After that just add the folder of guitar effects(rename before to www) and put inside the resources(qml.qrc/)

### Android

Add to the onCreate function on MainActivity:

~~~~
WebView myWebView = findViewById(R.id.webview);
WebSettings webSettings = myWebView.getSettings();
webSettings.setJavaScriptEnabled(true);
//myWebView.setWebContentsDebuggingEnabled(true);//inspect support on chrome
webSettings.setAllowFileAccessFromFileURLs(true);
webSettings.setDomStorageEnabled(true);
webSettings.setDatabaseEnabled(true);
webSettings.setMediaPlaybackRequiresUserGesture(false);
myWebView.setWebChromeClient(new WebChromeClient(){
      @Override
      public void onPermissionRequest(PermissionRequest request){
           request.grant(request.getResources());
           }
      });
myWebView.loadUrl("file:///android_asset/index.html");
~~~~

Add permissions to the manifest:

~~~~
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
~~~~

In the activity_main.xml add the webview:

~~~~
<WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        />
~~~~

Finally copy the files from this repository to the assets folder(src/main/assets), create it if don't exist.

### Mac OS & iOS

I don't have a Mac to compile to this platforms, please contact me to marianocarrazana@gmail.com if you have one with XCode installed.
