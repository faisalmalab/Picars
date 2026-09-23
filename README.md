# Picars - Real-Time Edge Computer Vision & Security System

A high-performance computer vision and security intrusion detection system built with Python, OpenCV, and YOLOv8. Designed to process live video streams, execute custom spatial boundary logic, and trigger automated security alerts.

## Architecture & Features
* **Edge AI Inference:** Utilizes YOLOv8n (Ultralytics / PyTorch) optimized for real-time object detection and tracking[cite: 1].
* **Spatial Polygon Intrusion Detection:** Implements custom point-in-polygon geometry algorithms (`pointPolygonTest`) to monitor restricted security zones dynamically[cite: 1].
* **Asynchronous Alert Pipelines:** Features threaded background workers and event handlers to prevent frame drops and ensure low-latency telemetry logging[cite: 1].
* **Multi-Stream Support:** Capable of processing local media test feeds as well as RTSP security camera streams[cite: 1].

## Tech Stack
* **Language:** Python 3.11+[cite: 1]
* **Computer Vision & AI:** OpenCV, YOLOv8, PyTorch, NumPy[cite: 1]
* **Concurrency:** Python `threading` for non-blocking stream ingestion and alert dispatching[cite: 1]

## Quick Start
1. Clone the repository and set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate