# 🌐 Picars: Integrated Fleet Telemetry & AI Security System

![React](https://img.shields.io/badge/React-Frontend-blue) ![Node.js](https://img.shields.io/badge/Node.js-Backend-green) ![Python](https://img.shields.io/badge/Python-Computer_Vision-yellow) ![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-orange)

**Picars** is a comprehensive, full-stack ecosystem designed to solve two major operational challenges: **real-time fleet telemetry tracking** and **automated edge-AI perimeter security**. 

The system bridges a responsive **React frontend dashboard** with a robust **Node.js backend** and an advanced **Python-based computer vision module**, providing real-time data visualization, telemetry stream tracking, and intrusion detection alerts.

---

## ✨ Key Features & Architecture

### 💻 1. Interactive Frontend Dashboard (`React`)
* **Real-Time Data Visualization:** Built with React to provide a dynamic user interface for monitoring system stats, fleet telemetry, and camera feeds.
* **Responsive UI/UX:** Clean, modular component architecture ensuring smooth interaction across system controls and live views.
* **State Management:** Efficiently handles live data updates streamed from the backend API.

### 📡 2. Predictive Fleet Telemetry (`Node.js Backend`)
* **Real-Time Data Ingestion:** Powered by Express and WebSockets to handle high-frequency data streams from simulated fleet vehicles.
* **Persistent Storage:** Utilizes SQL databases for robust logging, querying, and historic state management.
* **Modular Routing:** Separates telemetry data processing from user authentication and system event logs.

### 👁️ 3. Edge-AI Intrusion Detection (`Python CV Module`)
* **Real-Time Object Detection:** Leverages Ultralytics YOLOv8 and PyTorch to process live video feeds with minimal latency.
* **Spatial Tracking:** Implements custom Point-in-Polygon (PIP) mathematical algorithms using OpenCV to define dynamic security perimeters.
* **Automated Threat Alerting:** Instantly detects and flags unauthorized entities breaching designated zones.

---

## 🏗️ System Architecture

```text
[ React Frontend Dashboard ] <--(WebSockets/REST)--> [ Node.js / Express API ] --> [ SQL Database ]
                                                          
[ Live Video Feed ] --------> [ Python / YOLOv8 Module ]  --> [ Local Event Logs ]
