mkdir firefoxos
mkdir firefoxos/audio
mkdir firefoxos/img
mkdir firefoxos/scripts
mkdir firefoxos/styles
mkdir firefoxos/webapp
mkdir firefoxos/demo
cp -r audio/* firefoxos/audio
cp img/*.jpg firefoxos/img
cp img/*.png firefoxos/img
cp scripts/compiled.js firefoxos/scripts/compiled.js
cp styles/* firefoxos/styles
cp webapp/32.png firefoxos/webapp/32.png
cp webapp/48.png firefoxos/webapp/48.png
cp webapp/60.png firefoxos/webapp/60.png
cp webapp/72.png firefoxos/webapp/72.png
cp webapp/90.png firefoxos/webapp/90.png
cp webapp/128.png firefoxos/webapp/128.png
cp webapp/256.png firefoxos/webapp/256.png
cp index.html firefoxos/index.html
cp manifest.webapp firefoxos/manifest.webapp
cp demo/Demo.ogg firefoxos/demo/Demo.ogg
cd firefoxos
zip -r f.zip *
cd ..
cp firefoxos/f.zip firefoxos.zip
rm -r firefoxos