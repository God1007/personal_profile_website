# Personal Learning Hub (C++ / Drogon)

A minimal, single-server learning journal with:
- Notes CRUD
- PDF/Markdown upload + preview
- Spaced repetition scheduling
- Interview records management
- Study timeline with calendar
- Light, clean UI

This project is designed to be **C++-first** with **minimal configuration**. It uses:
- **Drogon** (C++ web framework)
- **SQLite** (single-file database)
- **Nginx** (optional reverse proxy)
- Simple HTML/CSS/JS front-end

## Features
- Create/edit/delete notes with tags
- Upload PDF/Markdown attachments and preview them in the browser
- Spaced repetition review queue
- Create/delete interview records
- Record timeline events and view highlighted study days in calendar

## Quick Start (local)
> You need a C++17 compiler, CMake, Drogon (1.9.11), and SQLite.

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

## Deployment (single Ubuntu server from scratch)
以下流程按**裸机 Ubuntu 22.04/24.04**设计，目标是让服务开机自启，并可通过 IP 访问。

### 0) 准备系统
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release git build-essential cmake pkg-config libsqlite3-dev libjsoncpp-dev uuid-dev openssl libssl-dev zlib1g-dev
```

### 1) 安装 Drogon（推荐源码安装，版本可控）
```bash
git clone --depth 1 --branch v1.9.11 https://github.com/drogonframework/drogon.git
cd drogon
git submodule update --init --recursive
mkdir -p build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
cmake --build . -j$(nproc)
sudo cmake --install .
sudo ldconfig
```

### 2) 拉取并构建项目
```bash
cd /opt
sudo git clone <your-repo-url> personal_profile_website
sudo chown -R $USER:$USER /opt/personal_profile_website
cd /opt/personal_profile_website
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
```

### 3) 初始化目录与运行用户
```bash
cd /opt/personal_profile_website
mkdir -p data/uploads
sudo useradd --system --no-create-home --shell /usr/sbin/nologin plh || true
sudo chown -R plh:plh /opt/personal_profile_website/data
```

### 4) 先前台启动验证
```bash
cd /opt/personal_profile_website
PLH_DB_PATH=/opt/personal_profile_website/data/app.db PLH_UPLOAD_DIR=/opt/personal_profile_website/data/uploads PLH_PORT=8080 ./build/personal_learning_hub
```
浏览器打开：`http://<server-ip>:8080`

### 5) 配置 systemd 守护进程
```bash
sudo tee /etc/systemd/system/personal-learning-hub.service > /dev/null <<'SERVICE'
[Unit]
Description=Personal Learning Hub
After=network.target

[Service]
Type=simple
User=plh
Group=plh
WorkingDirectory=/opt/personal_profile_website
ExecStart=/opt/personal_profile_website/build/personal_learning_hub
Restart=always
RestartSec=2
Environment=PLH_DB_PATH=/opt/personal_profile_website/data/app.db
Environment=PLH_UPLOAD_DIR=/opt/personal_profile_website/data/uploads
Environment=PLH_PORT=8080

[Install]
WantedBy=multi-user.target
SERVICE

sudo systemctl daemon-reload
sudo systemctl enable --now personal-learning-hub
sudo systemctl status personal-learning-hub --no-pager
```

### 6) （可选）Nginx 反向代理到 80 端口
```bash
sudo apt-get install -y nginx
sudo tee /etc/nginx/sites-available/personal-learning-hub > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/personal-learning-hub /etc/nginx/sites-enabled/personal-learning-hub
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 7) 防火墙（如果启用 UFW）
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 8080/tcp
sudo ufw enable
sudo ufw status
```

### 8) 运维常用命令
```bash
# 看服务日志
journalctl -u personal-learning-hub -f

# 重启服务
sudo systemctl restart personal-learning-hub

# 备份数据库
cp /opt/personal_profile_website/data/app.db /opt/personal_profile_website/data/app.db.$(date +%F_%H%M%S).bak
```

### 常见故障排查
- `CMake 找不到 DrogonConfig.cmake`：说明 Drogon 未正确安装，重新执行第 1 步并确认 `sudo ldconfig` 已执行。
- 上传 PDF 后无法预览：检查 `PLH_UPLOAD_DIR` 目录权限是否归 `plh` 用户。
- 访问超时：确认安全组/UFW 已放行 80 或 8080 端口。
- 服务启动失败：`journalctl -u personal-learning-hub -n 200 --no-pager` 查看详细错误。

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
