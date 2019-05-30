# Guitar-Effects

Webaudio/HTML5 effects for guitar

Guitar-Effects+ will be available soon, all changes in GE will be added to GE+

### Support me on patreon

[https://www.patreon.com/marianofromlaruta](https://www.patreon.com/marianofromlaruta)

### Compile like native app

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
