---
title: "Network debugging notes: how I structure investigation before touching code"
date: "2026-04-08"
summary: "整理我在网络相关问题中常用的排查框架，包括状态观察、链路假设、协议定位和结果验证。"
tags: ["Network", "Linux", "Debugging"]
category: "Engineering Notes"
featured: false
published: true
---

很多网络问题看起来像代码问题，但如果一开始就改代码，通常效率不高。

我更常用的排查顺序是：

1. 先确认问题是否稳定复现
2. 再确认问题发生在哪一层
3. 再决定是否需要深入协议或系统调用

## First observe, then hypothesize

如果没有一轮基本观察，后面的排查很容易失焦。

我通常会优先确认：

- 网络接口状态
- RTT 是否异常
- 是否有丢包
- DNS 是否正常
- 问题是局部还是全局

这些信息能快速决定接下来是看配置、看链路、看协议还是看应用。

## Separate symptoms from causes

很多现象只是结果，不是原因。

例如：

- 接口流量异常不一定是接口本身的问题
- 超时不一定是服务端故障
- 丢包不一定发生在应用层

所以我会尽量先画出一个最小的判断树，而不是直接沉到某一条猜测里。

## Why notes matter

技术笔记的价值，不只是记录结论，更是把思路沉淀下来。

对我来说，写这些记录的目的就是：

- 让未来的自己更快进入问题
- 让排查过程更可复用
- 让技术表达更接近真实工程
