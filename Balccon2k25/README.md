# Balccon 2k25 LED Wall

This repository contains the software and documentation for the Balccon 2k25 LED Wall project. The LED wall is a large, custom-built display that can be used to show videos, animations, and other visual content.

## Project Overview

The Balccon 2k25 LED Wall is a DIY project that uses a Teensy 3.2 with an OctoWS2811 adapter to control 48 strips of WS2811 LEDs. The total resolution of the wall is 32x75 pixels, for a total of 2400 LEDs. A mini PC with an HDMI capture card is used to send video data to the Teensy, which then drives the LEDs.

The project also includes a `videocue_server` that allows users to queue up YouTube videos to be displayed on the LED wall.

## Hardware Components

*   **LED Strips:** 48x WS2811 LED strips (50 LEDs per strip)
*   **Microcontroller:** Teensy 3.2 with OctoWS2811 adapter
*   **Power Supply:** 4x 5V PSUs in parallel
*   **Computer:** mini PC running Ubuntu
*   **Video Capture:** USB HDMI capture card
*   **Cabling:** Ethernet cables, USB cable, HDMI cable

## Software

### `videocue_server`

The `videocue_server` is a BUN Node.js application that allows users to submit YouTube videos to a queue. The server then plays the videos in the order they were submitted.

**Installation and Usage:**

1.  Navigate to the `videocue_server` directory.
2.  Install the dependencies using `bun`:
    ```bash
    bun install
    ```
3.  Run the server:
    ```bash
    bun run
    ```
The web server will be running on port 80. Users can submit new YouTube videos on the index page (`/`), and the currently cued video will be played on the viewer page (`/viewer.html`). By default, each video plays for a maximum of 5 minutes. If the queue is empty, a default video will loop.

### Teensy Code

The `TeensyCode` directory contains the Arduino sketches for the Teensy microcontroller.

*   **`glediator.ino`:** This script allows the LED wall to be used as a screen. It receives pixel data from the mini PC over USB and displays it on the LEDs. This should be the default firmware flashed on the Teensy for interactive content.
*   **`PlasmaAnimation.ino`:** This script provides a standalone plasma animation for the LED wall. It does not require any serial data input.

## Setup and Operation

### Hardware Assembly

1.  Connect the 5V power supplies in parallel to all the LED strips.
2.  Connect the Teensy with the OctoWS2811 to the LED strips according to the diagram below.

### Software Setup

1.  **Flash the Teensy:**
    *   For use as a screen, flash the `glediator.ino` sketch to the Teensy this is probably already installed on the Teensy.
    *   For a standalone animation, flash the `PlasmaAnimation.ino` sketch.
    *   Both Scripts are part of the default Examples from the OctoWS2811 Libary

2.  **Connect the Mini PC:**
    *   Connect the Teensy to the mini PC via USB.
    *   Connect the HDMI output of the mini PC to the HDMI input of the capture card.
    *   Connect the monitoring output of the capture card to an external monitor to see the mini PC's desktop.

3.  **Run the Python Script:**
    *   The mini PC should auto-boot into Ubuntu.
    *   On the desktop, there is a folder called `2k25`.
    *   Open a terminal, navigate to the `2k25` folder, and run the Python script:
        ```bash
        cd ~/Desktop/2k25
        python3 script.py
        ```
    *   This script captures the HDMI input, scales it to the correct resolution (32x75), and sends the pixel data to the Teensy over USB.

4.  **Display Content:**
    *   You can now open any content on the mini PC to display it on the LED wall. This can be a YouTube video, a game, the `videocue_server` viewer page, or anything else.

## LED Wall Diagram

![Balccon 2k25 LED Wall Diagram](2k25_BalcconLEDwall_diagramm.jpg)
