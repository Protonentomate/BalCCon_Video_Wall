There now is a videocue_server

This can be run with bun
Just put on a Server and run with:

bun install
bun run

This will run a Webserver on Port 80
On the index page Users can submit a new Youtube Video.
On the /viewer.html the current cued Youtube Video is played.
In the default config this is 5min per video or until the video is finisshed what ever is sooner.
If the cue is empty it will just show the default Video in a loop.




## Balccon 2k25 Updated Diagramm:

<img src="2k25_BalcconLEDwall_diagramm.jpg"> 

## Setup:
The simple steps are as following:
Connect all the 5V power Supply in parallel in all the LED Strips.
Connect the Teensy with the OctoWS2811 to the LED's according to the diagramm.

Flash the Teens with the glediator.ino for interactive content or the PlasmaAnimation if you just want a static animation.

To use the LED Wall as a Screen flash the glediator, this should probably already be flashed.

Connect the Teensy over USB to the mini PC (Be careful with the usb this can be fragile on the teensy)

On the mini PC connect the HDMI Capture card and then the HDMI output of the minipc to the Capture card so it loops in to itself. The monitoring output of the hdmi capture card can go to a Screen so you can see what is on the miniPC.

On the minipc a ubuntu is installed and it should auto Boot.
On the Desktop there is a Folder Called 2k25 in there is a python script that you can run. just cd and then python3 script.py

The Script will take the inpout of the HDMI capture card, scale it to the correct size and then send out the data over usb serial to the teensy for it to dispaly.

Just open a Youtube Video, Game, the VideoCue server or anything else you want to display on the led wall.