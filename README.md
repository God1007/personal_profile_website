# Personal Learning Hub (C++ / Drogon)

A minimal, single-server learning journal with:
- Notes CRUD
- PDF upload + preview
- Spaced repetition scheduling
- Light, clean UI

This project is designed to be **C++-first** with **minimal configuration**. It uses:
- **Drogon** (C++ web framework)
- **SQLite** (single-file database)
- **Nginx** (optional reverse proxy)
- Simple HTML/CSS/JS front-end

## Features
- Create/edit/delete notes with tags
- Upload PDFs and preview them in the browser
- Spaced repetition review queue

## Quick Start (local)
> You need a C++20 compiler, CMake, Drogon, and SQLite.

### 1) Install dependencies (Ubuntu example)
```bash
sudo apt-get update
sudo apt-get install -y g++ cmake git libsqlite3-dev
```

### 2) Build
```bash
mkdir -p build
cd build
cmake ..
cmake --build . -j
```

### 3) Run
```bash
./personal_learning_hub
```

Open: `http://localhost:8080`

## Deployment (single server, no domain)
These steps assume **Ubuntu 20.04/22.04** and a single server. You can access the site by **IP address**.

### 1) Install build dependencies
```bash
sudo apt-get update
sudo apt-get install -y g++ cmake git libsqlite3-dev
```

### 2) Install Drogon
If your distro packages Drogon, install it directly:
```bash
sudo apt-get install -y libdrogon-dev
```

If not available, build it from source:
```bash
git clone https://github.com/drogonframework/drogon.git
cd drogon
mkdir -p build && cd build
cmake ..
cmake --build . -j
sudo cmake --install .
```

### 3) Build this project
```bash
git clone <your-repo-url>
cd personal_profile_website
mkdir -p build
cd build
cmake ..
cmake --build . -j
```

### 4) Prepare data directories
```bash
cd /path/to/personal_profile_website
mkdir -p data/uploads
```

### 5) Run the service (foreground)
```bash
./build/personal_learning_hub
```

Open in browser: `http://<server-ip>:8080`

### 6) (Optional) Run as a systemd service
Create a service file:
```bash
sudo tee /etc/systemd/system/personal-learning-hub.service > /dev/null <<'SERVICE'
[Unit]
Description=Personal Learning Hub
After=network.target

[Service]
WorkingDirectory=/path/to/personal_profile_website
ExecStart=/path/to/personal_profile_website/build/personal_learning_hub
Restart=always
Environment=PLH_DB_PATH=/path/to/personal_profile_website/data/app.db
Environment=PLH_UPLOAD_DIR=/path/to/personal_profile_website/data/uploads
Environment=PLH_PORT=8080

[Install]
WantedBy=multi-user.target
SERVICE
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable personal-learning-hub
sudo systemctl start personal-learning-hub
sudo systemctl status personal-learning-hub
```

### 7) (Optional) Nginx reverse proxy
Install Nginx:
```bash
sudo apt-get install -y nginx
```

Create a server block (no domain needed):
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Configuration
The app uses environment variables (optional):
- `PLH_DB_PATH` (default: `./data/app.db`)
- `PLH_UPLOAD_DIR` (default: `./data/uploads`)
- `PLH_PORT` (default: `8080`)

## Nginx (optional)
Reverse proxy to the app:
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Notes
- PDF preview is handled via PDF.js loaded from a CDN.
- Spaced repetition intervals: 1/3/7/14/30 days.

## Project Structure
```
.
├── CMakeLists.txt
├── README.md
├── src
│   └── main.cpp
└── public
    ├── index.html
    ├── app.js
    └── styles.css
```
