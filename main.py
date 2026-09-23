import os
import cv2
import numpy as np
import threading
import time
import requests
from ultralytics import YOLO

# Clean up legacy environment variables
if "OPENCV_FFMPEG_CAPTURE_OPTIONS" in os.environ:
    del os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"]

# Endpoint Configuration
BACKEND_ALERT_URL = "http://localhost:5000/api/v1/telemetry/alert"
NODE_ID = "EDGE_NODE_AMMAN_01"

class VideoStreamWorker:
    def __init__(self, source="test_feed.mp4"):
        # Use a video file or secondary stream so it doesn't lock the browser webcam (0)
        self.cap = cv2.VideoCapture(source)
        self.ret, self.frame = self.cap.read()
        self.stopped = False

    def start(self):
        threading.Thread(target=self.update, daemon=True).start()
        return self

    def update(self):
        while not self.stopped:
            if not self.cap.isOpened():
                time.sleep(0.01)
                continue
            self.ret, self.frame = self.cap.read()
            if not self.ret:
                # Loop video if it ends
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            time.sleep(0.01)

    def read(self):
        return self.ret, self.frame

    def stop(self):
        self.stopped = True
        self.cap.release()

def send_alert_async(payload):
    def worker():
        try:
            res = requests.post(BACKEND_ALERT_URL, json=payload, timeout=0.5)
            print(f"📡 Telemetry Sent | Status: {res.status_code} | Zone Targets: {payload['in_zone_count']}")
        except Exception as e:
            print(f"⚠️ Network Telemetry Drop: {e}")

    threading.Thread(target=worker, daemon=True).start()

# 1. Load YOLOv8 Model
model = YOLO('yolov8n.pt')

# 2. Dynamic Spatial Security Zone Polygon
ZONE_POLYGON = np.array([[100, 100], [860, 100], [860, 520], [100, 520]], np.int32)

print("⌛ Launching Real-Inference Edge Vision Node...")
# Note: Place a sample video file named 'test_feed.mp4' in your folder, 
# or change this to an RTSP security camera stream URL if applicable.
stream = VideoStreamWorker("test_feed.mp4").start()
time.sleep(1.0)

last_alert_time = 0
ALERT_COOLDOWN_SEC = 0.5 
prev_frame_time = time.time()

try:
    while True:
        ret, frame = stream.read()
        if not ret or frame is None:
            time.sleep(0.01)
            continue

        # Resize canvas
        h, w = frame.shape[:2]
        target_w = 960
        target_h = int(h * (target_w / w))
        frame = cv2.resize(frame, (target_w, target_h), interpolation=cv2.INTER_LINEAR)

        # FPS Calculation
        new_frame_time = time.time()
        fps = 1.0 / (new_frame_time - prev_frame_time + 1e-6)
        prev_frame_time = new_frame_time

        # Run Real YOLOv8 Tracking
        results = model.track(frame, persist=True, conf=0.25, iou=0.45, verbose=False)[0]

        total_detected = 0
        in_zone_count = 0
        detected_objects = []

        if results.boxes is not None:
            for box in results.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                track_id = int(box.id[0]) if box.id is not None else -1

                total_detected += 1
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                center_x = (x1 + x2) // 2
                center_y = (y1 + y2) // 2

                # Point-in-polygon Spatial Check
                inside = cv2.pointPolygonTest(ZONE_POLYGON, (float(center_x), float(center_y)), False) >= 0
                label_name = model.names[class_id].upper()

                if inside:
                    in_zone_count += 1

                detected_objects.append({
                    "track_id": track_id,
                    "class": label_name,
                    "confidence": round(confidence, 2),
                    "bbox": [x1, y1, x2, y2]
                })

        # Dispatch Real-Time Telemetry Payload to Node Backend twice a second
        if (time.time() - last_alert_time) > ALERT_COOLDOWN_SEC:
            payload = {
                "node_id": NODE_ID,
                "timestamp": round(time.time(), 3),
                "fps": round(fps, 1),
                "in_zone_count": in_zone_count,
                "total_detected": total_detected,
                "objects": detected_objects,
                "status": "BREACH_ALERT" if in_zone_count > 0 else "NOMINAL"
            }
            send_alert_async(payload)
            last_alert_time = time.time()

        time.sleep(0.01)

except KeyboardInterrupt:
    print("🛑 Vision Node Terminated.")
    stream.stop()