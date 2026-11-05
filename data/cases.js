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
  comparison: { image: 'assets/cases/memory-pool/frontiers.svg', alt: 'DeepSeek-V3、GLM-5.2、Qwen3-235B 在百万 token 上下文下的池化与无池服务前沿；GLM-5.2 的 G1 标注 TGS 提升 31%。' },
  memoryTiers: [
    ['H200 HBM', '141 GB / GPU', '4.8 TB/s', '未单独建模'],
    ['Host DRAM', '256 GB / GPU', '64 GB/s', '2 μs'],
    ['Host SSD', '3.84 TB / GPU', '6.8 GB/s', '80 μs'],
    ['LPDDR5X 池', '480 GB / 节点', '335 GB/s', '1 μs'],
    ['NVMe 池', '30.72 TB / 节点', '14 GB/s', '60 μs'],
    ['HBF 池', '1.024 TB / 节点', '3.2 TB/s', '20 μs']
  ]
}];
