# 个人作品集网站使用说明

这是一个基于 `Next.js` 构建的个人作品集网站项目，定位是：

- 视觉精致
- 结构简单
- 易于维护
- 适合新手部署到自己的 Ubuntu 服务器

本说明文档会用中文介绍项目的技术方案、本地运行方式、服务器部署流程、域名绑定、HTTPS 配置，以及后续更新方法。

## 第 1 部分：最终推荐方案

### 推荐方案

推荐你使用：

- `Next.js`
- `TypeScript`
- `React`
- `纯 CSS`
- `Nginx`
- `Ubuntu 22.04`

并采用 **静态网站** 方案部署。

### 为什么这样选

这个方案最适合你目前的情况，原因是：

- 不需要后端和数据库，复杂度低
- 页面效果可以做得非常精致
- 构建完成后就是静态文件，部署简单
- 性能好，加载快
- SEO 基础支持比较完整
- 以后如果你想增加博客、表单、CMS，也方便扩展

### 是否需要后端或数据库

目前 **不需要**。

因为这个项目只是个人介绍型网站，主要内容包括：

- 自我介绍
- 技能展示
- 项目展示
- 经历和教育信息
- 联系方式

这些内容都可以直接写在前端文件中，不需要数据库。

### 推荐结论

这是一个典型的：

- **静态网站**
- **无后端**
- **无数据库**
- **适合新手维护**

的作品集项目。

## 第 2 部分：项目架构说明

### 技术栈

- `Next.js`：网站框架
- `React`：组件开发
- `TypeScript`：增强代码可读性和安全性
- `纯 CSS`：避免引入不必要的样式框架
- `Vitest + Testing Library`：基础测试
- `Nginx`：生产环境静态网站服务

### 为什么适合这个项目

- 文件少，结构清晰
- 没有后台逻辑，适合理解
- 部署方式稳定
- 后续修改成本低
- 只要重新构建并上传 `out/` 目录即可更新网站

### 项目目录结构

```text
personal_profile_website/
├─ app/
│  ├─ globals.css
│  ├─ icon.svg
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ robots.ts
│  └─ sitemap.ts
├─ data/
│  └─ site-content.ts
├─ deploy/
│  └─ nginx/
│     └─ personal-profile.conf
├─ tests/
│  ├─ home.test.tsx
│  └─ setup.ts
├─ .gitignore
├─ eslint.config.mjs
├─ next.config.ts
├─ next-env.d.ts
├─ package.json
├─ tsconfig.json
├─ vitest.config.ts
├─ README.md
└─ README.zh-CN.md
```

### 你最常修改的文件

#### 1. `data/site-content.ts`

这是内容配置文件。你以后主要会在这里修改：

- 你的姓名
- 你的职位描述
- 所在地
- 自我介绍
- 项目介绍
- 经历信息
- 邮箱
- GitHub 链接
- LinkedIn 链接

#### 2. `content/blog/*.md`

这是博客文章目录。以后你每新增一篇文章，都可以直接在这里创建一个新的 Markdown 文件。

#### 3. `app/page.tsx`

这是首页结构文件。你可以在这里调整：

- 板块顺序
- 区块内容
- 按钮文案
- 页面结构

#### 4. `app/globals.css`

这是全局样式文件。你可以在这里修改：

- 颜色
- 间距
- 字体风格
- 卡片样式
- 响应式布局
- 动画效果

## 第 3 部分：完整项目代码说明

完整代码已经写入当前仓库，不需要你再手动复制一大段代码。

当前项目已经包含：

- 页面代码
- 样式代码
- 内容数据文件
- SEO 基础配置
- 测试文件
- Nginx 配置模板
- 英文版说明文档
- 中文版说明文档

### 当前博客页面

- `/blog`：文章列表页
- `/blog/[slug]`：文章详情页
- `/blog/category/[category]`：分类页
- `/blog/tag/[tag]`：标签页

### 项目实现要点

- 网站是 **单页结构**
- 所有内容集中在 `data/site-content.ts`
- 使用 `output: "export"` 输出静态文件
- 构建后生成 `out/` 目录
- 已包含基础 SEO：
  - `metadata`
  - `robots.txt`
  - `sitemap.xml`

### 本地常用命令

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

运行测试：

```bash
npm test
```

运行代码检查：

```bash
npm run lint
```

打包生产文件：

```bash
npm run build
```

构建完成后，静态文件会输出到：

```text
out/
```

### 如何新建一篇博客文章

在下面这个目录里新建一个 Markdown 文件：

```text
content/blog/
```

例如：

```text
content/blog/my-first-post.md
```

文章格式建议如下：

```md
---
title: "我的第一篇文章"
date: "2026-04-16"
summary: "这里写文章摘要，会显示在文章列表和首页预览中。"
tags: ["Next.js", "Blog"]
category: "开发记录"
featured: false
published: true
---

这里开始写正文。
```

字段含义：

- `title`：文章标题
- `date`：发布日期，格式建议使用 `YYYY-MM-DD`
- `summary`：文章摘要
- `tags`：标签数组
- `category`：分类
- `featured`：是否作为精选文章展示
- `published`：是否公开显示在网站上

## 第 4 部分：本地开发指南

### 1. 本地电脑需要安装什么

你需要先安装这些工具：

- `Node.js` LTS 版本
- `npm`（通常会随 Node.js 一起安装）
- `Git`
- `VS Code` 或其他代码编辑器

检查是否安装成功：

```bash
node -v
npm -v
git --version
```

如果这些命令都能输出版本号，说明安装成功。

### 2. 如何在本地运行项目

在项目目录里执行：

```bash
npm install
npm run dev
```

然后在浏览器打开：

```text
http://localhost:3000
```

### 3. 如何修改内容

打开文件：

```text
data/site-content.ts
```

你可以直接修改里面的文字内容，例如：

- 姓名
- 标题
- 个人简介
- 项目描述
- 教育经历
- 联系方式

### 4. 如何测试网站

运行：

```bash
npm test
```

这个测试会检查首页中的关键模块是否正确渲染。

### 5. 如何构建生产版本

运行：

```bash
npm run build
```

成功后会生成 `out/` 目录，这个目录里的内容就是部署到服务器上的最终网站文件。

## 第 5 部分：Ubuntu 服务器部署指南

你的服务器信息：

- 公网 IP：`111.230.182.246`
- 系统：`Ubuntu 22.04`

### 1. 通过 SSH 登录服务器

在你本地电脑上执行：

```bash
ssh root@111.230.182.246
```

作用：

- 使用 root 用户连接服务器

### 2. 更新系统软件包

登录服务器后执行：

```bash
apt update
apt upgrade -y
```

作用：

- `apt update`：刷新软件包索引
- `apt upgrade -y`：安装可更新的软件包

### 3. 创建一个普通用户

假设你要创建的用户名是 `alex`：

```bash
adduser alex
usermod -aG sudo alex
```

作用：

- 创建一个新的普通用户
- 把这个用户加入 `sudo` 组，之后可以执行管理员命令

### 4. 给新用户配置 SSH 登录

如果你本地已经有 SSH Key，可以执行：

```bash
ssh-copy-id alex@111.230.182.246
```

然后测试：

```bash
ssh alex@111.230.182.246
```

### 5. 配置防火墙

在服务器上执行：

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

作用：

- 开放 SSH 端口，避免你被锁在服务器外
- 开放 HTTP 和 HTTPS
- 启用防火墙

### 6. 安装 Nginx

```bash
sudo apt install nginx -y
```

检查 Nginx 是否正常运行：

```bash
sudo systemctl status nginx
```

### 7. 创建网站目录

```bash
sudo mkdir -p /var/www/personal-profile-site
sudo chown -R $USER:$USER /var/www/personal-profile-site
```

作用：

- 创建网站部署目录
- 把目录权限交给当前用户

### 8. 在本地构建网站

回到你自己的电脑，在项目目录执行：

```bash
npm install
npm run build
```

### 9. 上传构建后的静态文件

在本地执行：

```bash
scp -r out/* alex@111.230.182.246:/var/www/personal-profile-site/
```

作用：

- 把 `out/` 中的静态文件复制到服务器的网站目录

### 10. 配置 Nginx

项目中已经提供了 Nginx 配置模板：

```text
deploy/nginx/personal-profile.conf
```

你需要把它放到服务器：

```bash
sudo cp deploy/nginx/personal-profile.conf /etc/nginx/sites-available/personal-profile
```

如果这个文件还没有上传到服务器，可以先手动上传，或者直接在服务器中创建文件。

编辑配置文件：

```bash
sudo nano /etc/nginx/sites-available/personal-profile
```

把里面的：

```text
example.com
www.example.com
```

替换成你的真实域名。

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/personal-profile /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

作用：

- 建立启用链接
- 检查 Nginx 配置是否正确
- 重新加载 Nginx 配置

## 第 6 部分：域名与 HTTPS 指南

### 1. 如何购买域名

你可以在这些平台注册域名：

- Cloudflare Registrar
- Namecheap
- Porkbun
- GoDaddy

### 2. 域名怎么选

建议原则：

- 尽量短
- 容易拼写
- 容易记忆
- 尽量和你的真实姓名或个人品牌相关

推荐格式：

- `yourname.com`
- `yourname.dev`
- `yourname.design`
- `firstname-lastname.com`

### 3. 什么是 A 记录

`A record` 的作用是：

- 把你的域名指向一个 IPv4 地址

你的服务器公网 IP 是：

```text
111.230.182.246
```

所以你的域名最终要指向这个 IP。

### 4. 如何配置根域名和 www

在你的 DNS 控制台中添加两条记录：

```text
Type: A
Host: @
Value: 111.230.182.246
```

```text
Type: A
Host: www
Value: 111.230.182.246
```

含义：

- `@` 表示主域名，例如 `example.com`
- `www` 表示 `www.example.com`

### 5. 如何验证 DNS 是否生效

在本地执行：

```bash
nslookup example.com
nslookup www.example.com
```

如果结果都解析到：

```text
111.230.182.246
```

说明 DNS 已经基本生效。

### 6. 开启 HTTPS 之前要先确认什么

在申请 HTTPS 证书之前，你需要确认：

- 域名已经指向服务器
- Nginx 已经正常运行
- 网站可以先通过 HTTP 打开
- 80 端口没有被防火墙拦截

### 7. 使用 Let's Encrypt 开启 HTTPS

Ubuntu 22.04 + Nginx 的常见安装方式如下：

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com -d www.example.com
```

作用：

- 安装 Certbot
- 自动为 Nginx 配置 SSL 证书
- 自动设置续期规则

测试自动续期：

```bash
sudo certbot renew --dry-run
```

## 第 7 部分：后续维护与更新流程

以后如果你想更新网站，流程通常是：

1. 在本地修改内容或样式
2. 运行测试
3. 重新构建
4. 上传新的 `out/` 文件到服务器

常用命令：

```bash
npm test
npm run build
scp -r out/* alex@111.230.182.246:/var/www/personal-profile-site/
```

### 推荐的 Git 提交流程

如果你还没有初始化 Git：

```bash
git init
git add .
git commit -m "Initial portfolio site"
```

后续更新：

```bash
git add .
git commit -m "Update portfolio content"
```

## 第 8 部分：常见问题排查

### 问题 1：`npm install` 失败

常见原因：

- Node.js 版本过旧
- 网络问题
- npm 缓存异常

可以尝试：

```bash
node -v
npm cache clean --force
npm install
```

### 问题 2：`npm run build` 失败

常见原因：

- TypeScript 报错
- import 路径错误
- 修改代码时出现语法错误

排查方法：

```bash
npm test
npm run build
```

优先看第一条报错，通常第一条最关键。

### 问题 3：Nginx 配置测试失败

运行：

```bash
sudo nginx -t
```

常见原因：

- `root` 路径写错
- 少了分号
- `server_name` 配置错误

### 问题 4：域名打不开

检查以下内容：

- DNS A 记录是否正确
- 防火墙是否开放 80 和 443
- Nginx 是否正在运行

命令：

```bash
sudo systemctl status nginx
nslookup example.com
```

### 问题 5：HTTPS 证书申请失败

检查：

- 域名是否已经解析到服务器
- 80 端口是否开放
- 网站是否已经可以通过 HTTP 打开

命令：

```bash
sudo ufw status
sudo systemctl status nginx
```

### 问题 6：上传后网站还是旧内容

常见原因：

- 浏览器缓存
- 上传到了错误目录

处理方式：

- 浏览器强制刷新
- 检查 `/var/www/personal-profile-site` 中的文件是否已经更新

## 官方参考资料

- Next.js 部署文档：`https://nextjs.org/docs/app/getting-started/deploying`
- Certbot 官方说明：`https://certbot.eff.org/instructions`

## 补充建议

如果你后面想继续增强这个网站，可以逐步加入：

- 自定义域名后的真实 SEO 信息
- 真实头像或项目图片
- 简历下载按钮
- 联系表单
- 访问统计
- 博客系统

但对第一版来说，当前这个静态方案已经足够专业、稳定，而且最容易落地。
