convert -resize 256x256 512.png 256.png 
convert -resize 128x128 512.png 128.png 
convert -resize 90x90 512.png 90.png 
convert -resize 72x72 512.png 72.png 
convert -resize 60x60 512.png 60.png 
convert -resize 48x58 512.png 48.png 
convert -resize 32x32 512.png 32.png
cd ..
convert -colors 256 -resize 16x16 webapp/512.png favicon.png