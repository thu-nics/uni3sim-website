/* Case content follows the supplied manuscript's active text and original plots. */
window.SIMULATOR_CASES = [{
  id: 'case-memory-pool',
  type: 'memory-pool',
  kicker: 'CASE 01 / SCALE-UP MEMORY POOL',
  title: '更多容量，何时变成更高吞吐？',
  summary: '百万 token 上下文让 KV 容量成为系统约束。我们把内存池接入 scale-up fabric，在相同的 128 张 H200 预算下，联合评估部署策略、存储介质和互连拓扑。容量收益，需要覆盖远端读取与共享链路竞争的代价。',
  badges: ['100 万 token 上下文', '128 × H200', '三种模型 · 仿真分析'],
  metrics: [
    { value: '1.31×', label: 'G1 报告的 TGS 与交互性', detail: 'GLM-5.2 的选定设计点' },
    { value: '0.54%', label: '单个稀疏层的 KV 读取占比', detail: '选中的 2,048 tokens 与索引摘要' },
    { value: '4 层', label: '共用一组稀疏索引选择', detail: '为跨 batch 交叠提供窗口' }
  ],
  models: [
    { key: 'glm', label: 'GLM-5.2', image: 'assets/cases/memory-pool/frontier-glm.svg', alt: 'GLM-5.2 的 TGS—交互性前沿；绿色菱形为池化前沿点，G1 标注 TGS 提升 31%。', title: 'G1：容量支持更多副本与更大 batch。', body: 'HBF 池把前沿推向更高的服务能力。G1 报告 TGS 与单用户交互性均为 1.31×；它代表联合设计空间中的一个选定配置。', facts: [['部署', '8 个副本 × TP16 × batch64'], ['GPU', '同置执行，共用 128 张 H200'], ['内存池', '46 个 HBF 节点，存放溢出 KV'], ['拓扑', 'Rail-optimized fat tree']], insight: '主要收益来自容量支持的部署与组批选择，不能推为所有用户的 decode 都固定加速 31%。' },
    { key: 'deepseek', label: 'DeepSeek-V3', image: 'assets/cases/memory-pool/frontier-deepseek.svg', alt: 'DeepSeek-V3 的池化与无池设计分布，以及本次扫描得到的服务前沿。', title: '额外容量，要放回整条服务前沿判断。', body: '这组设计空间中，无池设计构成了图示前沿。池化点提供了更多容量选择，但没有在这个模型上形成更优的 TGS—交互性折中。', facts: [['比较范围', '相同的 128 张 H200 预算'], ['工作负载', '100 万 token 上下文'], ['读图方式', '同时观察 TGS 与单用户交互性']], insight: 'GLM-5.2 的 G1 收益不能直接外推到其他模型；还要结合 KV 读取量与传输是否进入关键路径。' },
    { key: 'qwen', label: 'Qwen3-235B', image: 'assets/cases/memory-pool/frontier-qwen.svg', alt: 'Qwen3-235B 的池化与无池设计分布，图示最优前沿由无池点组成。', title: '容量增加，并不保证前沿前移。', body: '图示前沿由无池设计组成。是否增加内存池，需要结合模型的访问方式、部署选择和共享 fabric 上的数据搬运成本。', facts: [['比较范围', '相同的 128 张 H200 预算'], ['工作负载', '100 万 token 上下文'], ['观察重点', '额外容量与远端访问的共同作用']], insight: '本次结果体现模型之间的差异，不能概括为所有工作负载都适合池化。' },
    { key: 'all', label: '三模型对比', image: 'assets/cases/memory-pool/frontiers.svg', alt: 'DeepSeek-V3、GLM-5.2、Qwen3-235B 在百万 token 上下文下的池化与无池服务前沿。', title: '相同 GPU 预算，不同模型给出不同答案。', body: '完整前沿把吞吐与单用户速度放在一起比较。GLM-5.2 的稀疏 KV 访问为池化创造了机会，另外两个模型的图示结果体现了适用范围。', facts: [['GPU 预算', '128 × H200，每张 141 GB HBM'], ['设计空间', '151 个设计点，含 23 个无池配置'], ['搜索范围', '三模型共 2,353 种合法并行组合']], insight: '本案例的判断单位是工作负载与系统配置的组合。' }
  ],
  sensitivities: [
    { key: 'bandwidth', label: '读带宽', image: 'assets/cases/memory-pool/sensitivity-bandwidth.svg', alt: 'G1 的 HBF 每节点带宽敏感性：带宽不足时，归一化 TGS 和交互性共同下降。', title: '传输变长，就可能进入关键路径。', body: '当持续读带宽不足，同一批 KV 要更久才能到达 GPU。可用于交叠的计算窗口有限，传输一旦超出窗口，两项服务指标都会受影响。', points: ['要同时考虑节点带宽、接入链路和共享 fabric。', '增加并行通道与 memory-bank bandwidth，才能支撑持续传输。'] },
    { key: 'latency', label: '固定时延', image: 'assets/cases/memory-pool/sensitivity-latency.svg', alt: 'G1 的固定时延敏感性：基准附近两项指标较平缓，较大时延下仍出现下降。', title: 'G1 附近，固定时延有一定余量。', body: '远端读取与另一 batch 的计算交叠，使流水线能够容忍部分额外访问时延。读取超出可用窗口之后，固定时延同样会影响 TPOT 与 TGS。', points: ['可以在交换层级、链路距离和介质容量之间探索取舍。', '这一余量依赖具体流水线与带宽，不能推为时延不重要。'] }
  ],
  memoryTiers: [
    ['H200 HBM', '141 GB / GPU', '4.8 TB/s', '未单独建模'],
    ['Host DRAM', '256 GB / GPU', '64 GB/s', '2 μs'],
    ['Host SSD', '3.84 TB / GPU', '6.8 GB/s', '80 μs'],
    ['LPDDR5X 池', '480 GB / 节点', '335 GB/s', '1 μs'],
    ['NVMe 池', '30.72 TB / 节点', '14 GB/s', '60 μs'],
    ['HBF 池', '1.024 TB / 节点', '3.2 TB/s', '20 μs']
  ]
}];
