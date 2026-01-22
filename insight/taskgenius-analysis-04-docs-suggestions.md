# Task Genius 文档建议

日期：2026-01-22

## Wiki 文档建议

建议在 docs/ 或 GitHub Wiki 中维护以下文档：

1. 入门指南（Getting Started）
   - 安装与启用步骤（Obsidian、pnpm、开发模式）
   - 连接到 Vault 的说明（符号链接/插件目录）
   - 快速示例：在 Markdown 中创建任务与查看视图

2. 架构概览
   - 模块划分（components/pages/widgets/dataflow/managers/utils/types/translations）
   - 索引流程与 Worker
   - 视图与渲染器关系图

3. 任务语法与特性
   - 支持的 Markdown 任务语法
   - 自然语言时间解析（chrono-node）与 rrule 重复规则
   - 任务状态循环与标记、优先级、标签

4. 视图使用指南
   - Tasks/Projects/Kanban/Calendar/Forecast 的配置与交互
   - 代码块注入 Widget 的语法与参数

5. 编辑器扩展
   - 状态循环、过滤器、选择器、计时器、状态指示器
   - 快捷键与配置

6. 国际化
   - 翻译提取与生成（scripts/extract-translations.cjs、generate-locale-files.cjs）
   - 贡献翻译流程与校验

7. 设置与迁移
   - SettingsMigrationManager 工作机制
   - 兼容性注意事项（filter-compatibility、旧版配置）

8. 性能与调试
   - 性能基线与度量点
   - 常见瓶颈与优化策略
   - 调试指南与日志开关

9. 贡献指南（Contributing）
   - 分支策略与提交规范（Conventional Commits）
   - 测试与 lint
   - PR 模板与评审要点

10. 安全与隐私
    - PRIVACY.md 摘要与数据处理
    - 秘钥注入与环境变量（esbuild define）

## 详细设计文档建议

建议每个核心领域建立设计文档，包含以下章节：

- 背景与目标：该模块解决的问题与边界
- 需求与约束：功能需求、性能目标、兼容性与生态约束
- 架构与组件：类图/模块图、主要交互、依赖关系
- 数据模型：类型与接口、存储结构（localforage/内存）
- 算法设计：解析、过滤、分组、排序的策略与复杂度
- API 设计：输入/输出、错误与边界条件、事件与回调
- 可测试性：测试点、Mock 策略、基准测试用例
- 配置与扩展：可配置项、插件化点、版本迁移策略
- 风险与权衡：关键风险、替代方案对比、取舍理由
- 运维与监控：日志、性能指标、崩溃/异常处理

推荐建立的设计文档：
- Task Indexer & Repository 设计
- Task Parser 设计
- Widgets & Renderers 设计
- CodeMirror 扩展设计
- Settings Migration 设计
- Calendar Adapter 设计
