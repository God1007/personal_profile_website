# 个人网站使用说明

这是一个基于 `Next.js` 构建的个人网站项目，当前版本包含：

- 个人主页
- 博客系统
- 明暗双主题
- 静态部署方案

整体风格不是普通模板站，而是偏“技术品牌官网”路线：

- `Light` 主题更偏高级、克制、品牌感
- `Dark` 主题更偏工程感、技术感、层次更强

项目最终会构建成静态文件，适合部署到 Ubuntu + Nginx。

## 一、技术方案

当前使用的技术栈：

- `Next.js`
- `React`
- `TypeScript`
- `plain CSS`
- `gray-matter` + `marked`
- `Vitest` + `Testing Library`

这套方案的优点：

- 不需要后端和数据库
- 部署简单
- 性能好
- SEO 基础完整
- 后续可以继续扩展博客、CMS、搜索等能力

## 二、项目结构

主要目录如下：

```text
app/
components/
content/blog/
data/
deploy/nginx/
lib/
tests/
```

你后面最常改的文件：

- `data/site-content.ts`
  修改个人信息、项目、时间线、联系方式、首页文案。
- `content/blog/*.md`
  写博客文章。
- `app/globals.css`
  修改颜色、主题、动效、布局和整体视觉风格。
- `app/page.tsx`
  修改首页结构。

## 三、主题系统

网站支持明暗双主题：

- 默认跟随系统主题
- 用户也可以手动点击右上角切换
- 主题选择会保存在浏览器本地

相关文件：

- `components/theme/theme-provider.tsx`
- `components/theme/theme-toggle.tsx`
- `app/globals.css`

目前主要通过 CSS 变量控制主题：

- `--bg`
- `--surface`
- `--ink`
- `--muted`
- `--line`
- `--accent`
- `--glow`

如果你以后想继续微调风格，优先改这些变量。

## 四、博客写作方式

博客采用 `Markdown + frontmatter` 的方式发布。

在下面这个目录中新建文章：

```text
content/blog/
```

例如：

```text
content/blog/my-note.md
```

文章格式如下：

```md
---
title: "我的一篇技术记录"
date: "2026-04-16"
summary: "这里写文章摘要，会显示在首页和博客列表。"
tags: ["Next.js", "Linux"]
category: "技术记录"
featured: false
published: true
---

这里开始写正文内容。
```

字段说明：

- `title`：文章标题
- `date`：发布日期，建议格式 `YYYY-MM-DD`
- `summary`：摘要
- `tags`：标签数组
- `category`：分类
- `featured`：是否作为精选文章展示
- `published`：是否公开显示

当前示例文章：

- `content/blog/demo.md`

## 五、本地运行

先安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

浏览器打开：

```text
http://localhost:3000
```

## 六、检查与打包

开发完成后，建议依次执行：

```bash
npm run lint
npm test
npm run build
```

说明：

- `npm run lint`：检查代码规范问题
- `npm test`：运行自动化测试
- `npm run build`：生成生产环境静态文件

构建结果会输出到：

```text
out/
```

## 七、Ubuntu 部署

### 1. 构建项目

```bash
npm run build
```

### 2. 上传到服务器

你有两种常见方式：

- 本地构建后，把 `out/` 上传到服务器
- 在服务器上 `git pull` 代码，再执行 `npm install` 和 `npm run build`

推荐网站目录：

```text
/var/www/personal-profile-site
```

### 3. Nginx 配置

项目里已经带了一个配置模板：

```text
deploy/nginx/personal-profile.conf
```

典型配置如下：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/personal-profile-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

修改 Nginx 配置后执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 八、以后如何更新网站

如果你只改了文案、项目、博客或样式，通常流程就是：

```bash
npm run build
```

然后把新的 `out/` 内容同步到服务器目录。

如果你是在服务器上直接部署代码仓库，则流程一般是：

```bash
git pull
npm install
npm run build
```

然后把新的构建结果发布到 Nginx 目录。

## 九、当前重点入口文件

如果你接下来继续自己改，优先看这些文件：

- `app/page.tsx`
- `app/globals.css`
- `data/site-content.ts`
- `components/theme/theme-provider.tsx`
- `components/theme/theme-toggle.tsx`
- `content/blog/demo.md`

## 十、补充说明

- 当前项目不需要数据库
- 当前项目不需要后端
- 这是一个静态站点
- 如果以后想加 CMS、评论、搜索，都可以在现有结构上继续扩展
