# 面向下一代超节点的系统级仿真框架

NICS-EFC SysArch 的研究背景与交互图解。

[在线浏览](https://hazuyuki.github.io/supernode-system-simulator/)

网页围绕超节点的系统设计需求、计算/互连/存储约束、可解释性能建模与推理服务调度展开。包含任务波次、LRU 缓存与异步调度的交互图解。

## 文件结构

- `index.html`：页面内容与章节结构。
- `styles.css`：桌面和移动端样式。
- `scripts/timeline.js`：独立时间轴、暂停、重播与阶段定位。
- `scripts/figures.js`：SVG 机制图与教学示例。
- `scripts/app.js`：页面交互、导航和 Canvas 背景。
- `data/cases.js`：案例数据，已包含 scale-up memory pool 的结果与分析。
- `scripts/case-studies.js`、`case-studies.css`：案例版式与交互图解。
- `assets/cases/memory-pool/`：服务前沿、敏感性和算子时间线。

## 更新与部署

本页位于 [Hazuyuki/Hazuyuki.github.io](https://github.com/Hazuyuki/Hazuyuki.github.io/tree/master/supernode-system-simulator) 的 `supernode-system-simulator/` 子目录。GitHub Pages 从该仓库的 `master` 分支发布；推送页面更新后自动重新部署。

页面使用原生 HTML/CSS/JavaScript，无第三方运行时依赖。可以使用任意静态 HTTP 服务器本地预览。

## 材料与图解

背景依据所提供的演示材料整理；scale-up memory pool 案例来自所提供论文的 Case Study I，结果图保留其原始矢量内容。所有动画时间与教学示例均按正文标明的条件解释，不代表通用硬件性能结论。后续案例使用真实配置与数据补充。

团队：朱振华、杨昕昊、朱昱、廖天羽、谢童欣 · NICS-EFC SysArch。
