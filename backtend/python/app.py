from flask import Flask, jsonify
from flask_cors import CORS
from pynput import mouse, keyboard
import threading
from threading import Thread

app = Flask(__name__)
CORS(app)

# Shared state
set_key = None
is_set_key = False
lock = threading.Lock()  # To ensure thread safety


def on_click(x, y, button, pressed):
    global set_key, is_set_key
    if is_set_key and pressed and set_key is None:
        with lock:
            set_key = str(button)  # Set main key on mouse click
            is_set_key = False  # Reset flag after key is set
            print(f"Captured mouse: {is_set_key}")


def on_press(key):
    global set_key, is_set_key
    if is_set_key and set_key is None:
        with lock:
            set_key = str(key)  # Set main key on keyboard press
            is_set_key = False  # Reset flag after key is set
            print(f"Captured key: {set_key}")


@app.route('/setKey', methods=['GET'])
def set_main_key():
    global is_set_key, set_key
    with lock:
        set_key = None
        is_set_key = True  # Set flag to capture the next click
    print("Ready to capture main key")
    return jsonify({"message": "Ready to capture main key"})


@app.route('/getKey', methods=['GET'])
def get_main_key():
    global set_key
    with lock:
        if set_key:
            print(f"Returning captured key/mouse: {set_key}")
        return jsonify({"key": set_key})


# Start keyboard listener
def start_keyboard_listener():
    print("Starting keyboard listener...", flush=True)
    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()


# Start mouse listener
def start_mouse_listener():
    print("Starting mouse listener...", flush=True)
    with mouse.Listener(on_click=on_click) as listener:
        listener.join()


if __name__ == '__main__':
    # Create and start threads for both listeners
    keyboard_thread = Thread(target=start_keyboard_listener, daemon=True)
    mouse_thread = Thread(target=start_mouse_listener, daemon=True)

    keyboard_thread.start()
    mouse_thread.start()

    # Run Flask server
    app.run(host="127.0.0.1", port=5000)
