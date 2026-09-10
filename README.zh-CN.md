# 个人网站使用说明

这是一个基于 Next.js、React、TypeScript 和原生 CSS 构建的动态个人网站与技术日志。

## 当前能力

- 自适应明暗主题
- 自然的个人介绍、项目故事与技术思考
- 邮箱和 GitHub 联系入口
- 滚动衔接动效与可展开的项目故事
- Markdown 技术日志
- 多访客共享点赞计数
- 减少动态效果与减少透明度的无障碍降级

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

共享点赞默认保存在 `.data/hero-likes.json`。文件会自动创建，并且不会提交到 Git。

## 检查与构建

```bash
npm run lint
npm test
npm run build
```

## 多访客共享点赞

首页通过 `/api/likes` 读取和写入真实共享总数。

- 每个浏览器生成一个随机访客 ID。
- 服务端只保存该 ID 的 SHA-256 哈希。
- 同一浏览器重复提交或并发提交时只计一次。
- 写入按顺序执行，并通过原子重命名避免半写入文件。
- 接口临时不可用时，页面显示 `public/likes.json` 中的静态基线，并允许重试。

可选环境变量：

```bash
HERO_LIKE_STORE_PATH=/绝对路径/hero-likes.json
HERO_LIKE_INITIAL_COUNT=12
```

这是轻量的浏览器级去重，不是账号级反作弊。如果以后需要多台服务器横向扩容，应把文件存储替换成 Redis 或数据库。

## Ubuntu 部署

因为点赞总数需要写入持久化存储，网站现在需要以小型 Node 服务运行，不再是纯静态导出。

1. 在 `/var/www/personal-profile-site` 安装依赖并构建。
2. 创建独立的持久化目录：

```bash
sudo mkdir -p /var/lib/personal-profile-site
sudo chown -R www-data:www-data /var/lib/personal-profile-site
```

3. 安装仓库内的 systemd 服务：

```bash
sudo cp deploy/systemd/personal-profile.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now personal-profile
```

4. 安装 `deploy/nginx/personal-profile.conf`，然后重新加载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 常用内容入口

- 首页内容：`app/page.tsx`
- 博客文案和 WakaTime 配置：`data/site-content.ts`
- 博客文章：`content/blog/*.md`
- 全站样式：`app/globals.css`
- 首页样式：`app/profile.module.css`
- 原有交互组件样式：`app/home.css`
