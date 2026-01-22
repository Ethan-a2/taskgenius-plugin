# Task Genius 项目目标、演进与关键特性

日期：2026-01-22

## 项目目标与演进

### 短期目标（1-3 个版本）
- 提升任务索引与解析稳定性（减少误判与漏判），完善自然语言时间解析（chrono-node）与重复规则（rrule）。
- 优化 Widgets 与 Pages 的交互与性能（Kanban、Calendar、Forecast、Tasks、Projects）。
- 完善设置迁移与兼容性（SettingsMigrationManager、filter-compatibility），降低升级成本。
- 强化国际化与本地化流程（scripts/extract-translations.cjs 与 generate-locale-files.cjs），保持多语言一致性。

### 中长期目标（3-6 个版本）
- 引入更强的任务仓库抽象（Repository 接口化与后端可插拔，例如远端同步策略）。
- 丰富编辑器扩展（选择器、过滤、计时器、状态循环）的可配置度与插件化能力。
- 提供更完善的 API/代码块协议，支持在 Markdown 中更灵活地嵌入 Widget 与交互参数。
- 与外部日历/任务系统的适配增强（TaskCalendarAdapter 扩展），实现更强的跨系统联动。

### 演进路径与版本迭代策略
- 使用 release-it 与版本脚本（version-bump.mjs、smart-beta-release.mjs）进行语义化发布，稳定版与 beta 并行。
- 通过 CHANGELOG 与 CHANGELOG-BETA 记录变更；使用 manifest.json 与 manifest-beta.json 区分。
- 维持向后兼容的设置迁移机制；对重大变更提供迁移提示与脚本支持。

## 核心组件、关键特性与核心功能

### 核心组件
- 索引器与仓库（Dataflow + Repository + Worker）：扫描文件、解析任务、存储与查询。
- 视图/组件与渲染器（Widgets/Pages + Renderers + Shell）：可配置的任务展示（列表、看板、日历、预测）。
- 编辑器扩展（CodeMirror）：任务状态循环、过滤器、选择器、计时器、状态指示器。
- 管理器（Managers）：初始化与迁移、变更日志显示、URI 处理。
- 工具库（Utils）：日期、文件操作、优先级计算、过滤兼容、ID 生成、设置迁移等。

### 关键特性
- 任务状态循环与指示器（status-cycle-resolver、task-status-indicator.scss）。
- 多维过滤与分组（task-filter-utils、grouping/、GlobalFilterContext）。
- 看板/日历/预测等多视图（Kanban、Calendar、Forecast、Projects、Tasks）。
- 自然语言时间解析与重复规则支持（chrono-node + rrule）。
- 代码块驱动的 Widget 注入与渲染（WidgetCodeBlockProcessor）。
- 国际化（translations/locale、scripts 提取与生成）。

### 核心算法与复杂度分析（概念）
- 文件扫描与任务解析：
  - 假设 N 个文件，平均每个文件 T 行；解析成本 O(sum(lines)) ≈ O(N*T)。
  - 增量索引：对变更文件进行差异化处理，降低全量扫描频次。
- 过滤/分组/排序：
  - 过滤策略组合通常为 O(M*N)，M 为过滤器数量；通过短路与索引优化降低常数项。
  - 分组聚合：通常 O(N) 到 O(N log N)，取决于分组键计算与排序。
- 时间/空间：
  - 时间：索引与渲染为主要消耗；采用 Worker 并行与节流/去抖降低 UI 阻塞。
  - 空间：缓存与索引结构（localforage/内存）占用，需设定上限与清理策略。

## 关键用例

- 用户在 Markdown 中编写任务列表（- [ ] 任务条目），插件解析并在 Tasks/Projects 视图中展示。
- 用户在看板视图拖拽任务，状态/列变更触发写回文件并刷新渲染。
- 用户通过代码块插入 Widget（```taskgenius{filters...}```），页面内渲染交互式组件。
- 用户使用自然语言时间（“明天 9 点”），插件解析并赋予任务截止/开始时间。
- 用户使用重复规则（每周一、每月第一天），插件通过 rrule 生成实例并管理完成状态。

---

注：测试策略（jest + jsdom + ts-jest）通过 mocks 隔离 Obsidian/CodeMirror 依赖，确保核心逻辑可测试。