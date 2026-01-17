# 个人主页技术栈建议（偏 C++ 方向）

## 目标与场景
- 在腾讯云服务器上部署个人主页，用于记录学习内容与项目总结。
- 期望偏 C++ 方向，但也要兼顾部署与维护成本。

## 推荐技术栈（按复杂度由低到高）
### 1) 纯静态站点 + 轻量生成器（最省心）
- **前端**：HTML/CSS + 少量 JavaScript。
- **静态站点生成器**：Hugo（Go 编写，速度快）、MkDocs（Python，适合文档型内容）。
- **部署**：Nginx 反向代理 + HTTPS（Let’s Encrypt）。
- **适用**：以文章/笔记为主，几乎不需要后端逻辑。

### 2) C++ 轻量后端 + 静态前端
- **后端**：
  - Crow（轻量 HTTP 框架，类似 Flask 风格）
  - Drogon（更成熟的 C++ Web 框架，生态更全，支持 ORM/WebSocket）
- **前端**：
  - 继续使用静态页面，或配合模板引擎（如 C++ 的 inja）。
- **数据库**：SQLite（学习/小型数据）或 PostgreSQL。
- **适用**：希望有搜索、评论或 API 等小功能。

### 3) C++ 服务 + 现代前端
- **后端**：Drogon/Crow 提供 REST API。
- **前端**：Vue/React/Svelte 任一。
- **适用**：希望练习前后端分离与 API 设计。

## C++ 学习内容推荐（可作为主页内容结构）
- **基础**：现代 C++（C++11/14/17/20）语法、RAII、智能指针、移动语义。
- **工具链**：CMake、vcpkg/Conan、clang-tidy、clang-format。
- **并发**：std::thread、future/promise、lock-free 思想、异步 I/O。
- **网络编程**：asio/boost::asio，HTTP/TCP/UDP 基础。
- **工程化**：单元测试（Catch2/GoogleTest）、CI/CD、容器化。

## 部署与运维建议
- **Nginx**：静态资源托管 + 反向代理。
- **HTTPS**：Let’s Encrypt + Certbot。
- **进程管理**：systemd 或 supervisor。
- **日志**：最少要有 access/error log。

## 结论（推荐起步方案）
如果你主要想记录学习内容且偏 C++ 方向：
- **起步**：静态站点（Hugo/MkDocs）+ Nginx + HTTPS。
- **进阶**：用 Drogon 或 Crow 加一点 API 服务，把 C++ 学习内容/小项目做成可交互功能。
