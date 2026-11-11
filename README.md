# Uni³Sim: Open-Source Simulation for LLM Serving at Scale

Uni³ spans compute architectures, communication protocols, and memory & storage. Research background and interactive diagrams by NICS-EFC SysArch.

[English (default)](https://thu-nics.github.io/uni3sim-website/) · [中文版](https://thu-nics.github.io/uni3sim-website/zh/)

主网址默认英文，导航栏右侧提供 English / 中文切换，并保留当前阅读章节。正文、案例说明、动画阶段、图内文字和无障碍标签均支持两种语言。

网页围绕超节点的系统设计需求、计算/互连/存储约束、可解释性能建模与推理服务调度展开。包含任务波次、LRU 缓存与异步调度的交互图解。

## 文件结构

- `index.html`：默认英文页。
- `zh/index.html`：中文页，与英文共用代码和图表资产。
- `en/index.html`：保留的英文入口。
- `data/i18n.js`：英文文案与语言辅助函数。
- `styles.css`：桌面和移动端样式。
- `readability.css`：正文、图注及移动端的字号和对比度调整。
- `scripts/timeline.js`：独立时间轴、暂停、重播与阶段定位。
- `scripts/figures.js`：SVG 机制图与教学示例。
- `scripts/app.js`：页面交互、导航和 Canvas 背景。
- `data/cases.js`：案例顺序与文案：TTFT SLO / Prefill 余量、scale-up memory pool、HBFrame 存储层次。
- `scripts/case-studies.js`、`case-studies.css`：案例版式与交互图解。
- `scripts/prefill-slo-case.js`、`prefill-slo.css`：Prefill 余量案例、原始忙碌率阶梯曲线与机制动画。
- `data/prefill-slo.js`：2P1D、TP8 配置下 10–55 秒窗口的 90 个 0.5 秒原始桶。
- `scripts/hbframe-tier-case.js`、`hbframe-tier.css`：HBFrame 四种供给过程、H2P / H2C 联动动画、进度和 SVG 保存。
- `data/hbframe-tier.js`：8 份原始受控微型轨迹，保留事件时间和 Block 状态边界。
- `assets/cases/memory-pool/`：三模型服务前沿和算子时间线。

## 更新与部署

本页由 [thu-nics/uni3sim-website](https://github.com/thu-nics/uni3sim-website) 托管。GitHub Pages 从 `main` 分支的仓库根目录 `/` 发布；后续页面更新推送到该分支后，新网址自动重新部署。

网页源码从原个人主页仓库的 `supernode-system-simulator/` 子目录导入，保留了 12 次网页修改历史。

页面使用原生 HTML/CSS/JavaScript，无第三方运行时依赖。可以使用任意静态 HTTP 服务器本地预览。

## 材料与图解

背景依据所提供的演示材料整理；scale-up memory pool 案例来自所提供论文的 Case Study I，结果图保留其原始矢量内容。所有动画时间与教学示例均按正文标明的条件解释，不代表通用硬件性能结论。后续案例使用真实配置与数据补充。

Prefill 余量案例的忙碌率定义为有 kernel 执行的时间 / 窗口时长；多 GPU 按 GPU·s 加权。P 池均值 27.3%，D 池 82.7%，24 张卡总体 45.8%；曲线保留原始时间桶，不做平滑。随机到达、排队和预留 P 容量的动画是机制示意，与观测曲线分别标注。原始包不含逐请求 TTFT，因此页面不推断具体 SLO 达标率。

最后的 HBFrame 案例比较 L1E 直接使用、提升、L2 恢复及 HBM/HBF 联合 L1 的供给机制。两侧共用模拟时钟、保留各自完成时刻；事件条与持久 KV / 临时窗口占用来自所提供的微型运行。联合供给轮次为机制示意，不增加原始访问数，不据此进行完整模型性能排名。

团队：朱振华、杨昕昊、朱昱、廖天羽、谢童欣 · NICS-EFC SysArch。
