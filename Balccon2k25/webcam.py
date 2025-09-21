import cv2
import numpy as np
import serial
import serial.tools.list_ports
import time

# --- Constants ---
WIDTH = 75
HEIGHT = 32
NUM_LEDS = WIDTH * HEIGHT
BAUD_RATE = 1000000


def find_teensy_port():
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        if "ttyACM" in p.device or "ttyUSB" in p.device:
            return p.device
    print("Teensy not found. Available ports:")
    for p in ports:
        print(f"  - {p.device}: {p.description}")
    return None

def setup_serial():
    teensy_port = find_teensy_port()
    if teensy_port is None:
        raise Exception("Teensy device not found. Please check connection.")
    print(f"Connecting to Teensy on port: {teensy_port}")
    return serial.Serial(teensy_port, BAUD_RATE)

def process_frame(frame):
    resized = cv2.resize(frame, (WIDTH, HEIGHT))
    #resized = cv2.flip(resized, 0) # Flip vertically
    
    buffer = bytearray(NUM_LEDS * 3 + 1)
    buffer[0] = 1  # Start byte
    

    row_order = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
    
    for y in range(HEIGHT):
        for x in range(WIDTH):
            src_y = row_order[y]
            src_x = x if y % 2 == 0 else WIDTH - 1 - x
            
            i = (y * WIDTH + x) * 3 + 1
            
            # Get original colors
            orig_r = resized[src_y, src_x, 2]
            orig_g = resized[src_y, src_x, 1]
            orig_b = resized[src_y, src_x, 0]

            # Send data in the order the Arduino expects: Blue, Red, Green
            #buffer[i:i+3] = [b, r, g]
            buffer[i:i+3] = [orig_g, orig_r, orig_b]
    
    return buffer, resized

def main():
    try:
        ser = setup_serial()
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            # If this fails, make sure your webcam is not in use by another program
            raise Exception("Could not open video capture")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame from camera. Exiting.")
                break
            
            led_data, display_frame = process_frame(frame)
            ser.write(led_data)
            
            # You should now be able to see both the original and the preview
            # cv2.imshow('Original Webcam', frame) 
            cv2.imshow('LED Wall Preview', cv2.resize(display_frame, (WIDTH*10, HEIGHT*10), interpolation=cv2.INTER_NEAREST))
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    
    finally:
        if 'cap' in locals() and cap.isOpened():
            cap.release()
        cv2.destroyAllWindows()
        if 'ser' in locals() and ser.isOpen():
            ser.close()

if __name__ == "__main__":
    main()
