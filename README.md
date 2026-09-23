# 🌐 Picars: Integrated Fleet Telemetry & AI Security System

![Node.js](https://img.shields.io/badge/Node.js-Backend-green) ![Python](https://img.shields.io/badge/Python-Computer_Vision-blue) ![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-yellow) ![OpenCV](https://img.shields.io/badge/OpenCV-Image_Processing-red)

**Picars** is a comprehensive, full-stack ecosystem designed to solve two major operational challenges: **real-time fleet telemetry tracking** and **automated edge-AI perimeter security**. 

By bridging a robust Node.js backend with an advanced Python-based computer vision module, this system ingests live data streams, processes spatial intrusion algorithms, and maintains a persistent operational state.

---

## ✨ Key Features

### 📡 1. Predictive Fleet Telemetry (Backend API)
* **Real-Time Data Streaming:** Built on Node.js and Express to handle high-frequency data ingestion from simulated fleet vehicles.
* **WebSocket Integration:** Enables live, bi-directional communication for real-time dashboard updates.
* **Persistent Storage:** Utilizes PostgreSQL/SQLite for robust data logging, querying, and state management.
* **Scalable Architecture:** Designed with modular API routes to separate telemetry ingestion from user authentication and system logs.

### 👁️ 2. Edge-AI Intrusion Detection (Computer Vision)
* **Real-Time Object Detection:** Leverages Ultralytics YOLOv8 and PyTorch to process live video feeds with minimal latency.
* **Spatial Tracking:** Implements custom Point-in-Polygon (PIP) mathematical algorithms using OpenCV to define dynamic security boundaries.
* **Automated Threat Alerting:** Instantly detects when unauthorized entities breach designated polygon zones.
* **Performance Optimized:** Uses Polars and NumPy for high-speed data frame manipulation and array calculations during frame-by-frame analysis.

---

## 🏗️ System Architecture

The project is split into two independent but complementary modules, allowing for isolated testing, scaling, and deployment.

```text
[ Live Video Feed ]  -->  [ Python / YOLOv8 Module ]  -->  [ Local Event Logs ]
                                    |
                             (Future API Link)
                                    |
[ Fleet Simulators ] -->  [ Node.js / Express API ]   -->  [ SQL Database ]
