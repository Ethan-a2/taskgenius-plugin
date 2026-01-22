# Task Genius 配置项详解（data.json / settings）

日期：2026-01-22

本文档系统性说明插件的主要配置项、字段含义、取值范围、默认值及常见示例，便于通过 data.json 或 UI 配置达到期望效果（如滴答清单风格）。字段源于 src/common/setting-definition.ts 及相关模块。

## 1. 视图总览（ViewConfiguration）

viewConfiguration: ViewConfig[]
- id: 视图标识（"table" | "kanban" | "calendar" | "gantt" | "quadrant" | 自定义）
- name: 视图显示名称
- icon: 图标名（Lucide 图标）
- type: "default" | "custom"（是否为自定义视图）
- visible: 是否在侧边栏显示该视图
- hideCompletedAndAbandonedTasks: 是否默认隐藏已完成/已放弃任务
- filterBlanks: 是否过滤空白字段的条目
- filterRules: ViewFilterRule（基础过滤规则）
- sortCriteria: SortCriterion[]（该视图的默认排序策略）
- specificConfig: 视图特定配置（见下一节）
- region: "top" | "bottom"（视图在侧边栏的分组位置）

示例（表格按到期日升序、隐藏完成）：
{
  "id": "table",
  "visible": true,
  "hideCompletedAndAbandonedTasks": true,
  "sortCriteria": [{ "field": "dueDate", "order": "asc" }],
  "specificConfig": { "viewType": "table", "defaultSortField": "dueDate", "defaultSortOrder": "asc" }
}

## 2. 基础过滤（ViewFilterRule）

- tagsInclude/tagsExclude: 包含/排除的标签列表
- statusInclude/statusExclude: 包含/排除的状态列表（如 completed、inProgress 等）
- project: 只显示指定项目
- priority: 指定优先级（语义：如 ">=3"，具体实现参照 UI）
- hasDueDate/dueDate: 是否有到期日 / 到期日范围（today、next-week、YYYY-MM-DD 等）
- hasStartDate/startDate: 是否有开始日期 / 开始日期范围
- hasScheduledDate/scheduledDate: 是否有计划日期 / 计划日期范围
- hasCreatedDate/createdDate: 是否有创建日期 / 日期范围
- hasCompletedDate/completedDate: 是否有完成日期 / 日期范围
- hasRecurrence/recurrence: 是否有重复规则 / 规则文本
- textContains: 文本包含匹配
- pathIncludes/pathExcludes: 文件路径包含/排除
- advancedFilter: RootFilterState（高级过滤器结构，来自 UI 组件）

示例：隐藏已完成 + 仅显示未来 7 天到期或开始任务
filterRules: {
  hasDueDate: "hasDate",
  hasStartDate: "hasDate",
  // 建议结合高级过滤器使用：
  advancedFilter: { filterGroups: [...], ... }
}

## 3. 排序规则（SortCriterion[]）

SortCriterion:
- field: "status" | "completed" | "priority" | "dueDate" | "startDate" | "scheduledDate" | "createdDate" | "completedDate" | "content" | "tags" | "project" | "context" | "recurrence" | "filePath" | "lineNumber"
- order: "asc" | "desc"

示例：按到期日升序、优先级降序
sortCriteria: [
  { "field": "dueDate", "order": "asc" },
  { "field": "priority", "order": "desc" }
]

## 4. 视图特定配置（SpecificViewConfig）

### 4.1 表格（TableSpecificConfig）
- viewType: "table"
- enableTreeView: 是否启用树视图（层级展开）
- enableLazyLoading: 是否启用懒加载
- pageSize: 懒加载分页大小
- enableInlineEditing: 是否允许单元格内编辑
- visibleColumns: 显示列ID数组（例如 ["status","content","dueDate","priority","tags","project","filePath"]）
- columnWidths: 列宽设置（Record<string, number>）
- sortableColumns: 是否允许列排序
- resizableColumns: 是否允许列拖拽调整宽度
- showRowNumbers: 是否显示行号
- enableRowSelection/enableMultiSelect: 是否允许选择/多选
- defaultSortField: 默认排序字段（例如 "dueDate"）
- defaultSortOrder: 默认排序顺序（"asc" | "desc"）

建议（滴答清单风）：
- defaultSortField="dueDate"；defaultSortOrder="asc"；hideCompletedAndAbandonedTasks=true；filterBlanks=true；visibleColumns 包含 content、dueDate、priority、tags。

### 4.2 看板（KanbanSpecificConfig）
- viewType: "kanban"
- showCheckbox: 是否显示复选框
- hideEmptyColumns: 是否隐藏空列
- defaultSortField: 列内卡片默认排序字段（"priority"|"dueDate"|...）
- defaultSortOrder: "asc" | "desc"
- groupBy: 列分组依据（"status"|"priority"|"tags"|"project"|"dueDate"|"scheduledDate"|"startDate"|"context"|"filePath"）
- customColumns: 自定义列定义（当不按 status 分组时）
- hiddenColumns: 隐藏列标题列表

建议：groupBy="status"，defaultSortField="priority"，defaultSortOrder="desc"，hideCompletedAndAbandonedTasks=true。

### 4.3 日历（CalendarSpecificConfig）
- viewType: "calendar"
- firstDayOfWeek: 0-6（0=周日）
- hideWeekends: 是否隐藏周末
- showWorkingHoursOnly: 仅显示工作时间（周/日视图）
- workingHoursStart/End: 工作时段开始/结束小时（0-23）

建议：启用 showWorkingHoursOnly，设置 9-18，配合 filterRules 隐藏完成任务。

### 4.4 其他视图
- GanttSpecificConfig: { viewType: "gantt", showTaskLabels, useMarkdownRenderer }
- ForecastSpecificConfig: { viewType: "forecast", firstDayOfWeek?, hideWeekends? }
- TwoColumnSpecificConfig: 双列选择视图（分组键、标题文本等）
- QuadrantSpecificConfig: 四象限视图（默认排序、紧急/重要标签与阈值、颜色等）

## 5. 任务过滤设置（TaskFilterSettings）

taskFilter: {
  enableTaskFilter: boolean,
  presetTaskFilters: PresetTaskFilter[]
}

PresetTaskFilter:
- id/name: 预设名称
- options:
  - includeCompleted/inProgress/abandoned/notStarted/planned: 是否包含各状态
  - includeParentTasks/ChildTasks/SiblingTasks: 是否包含层级关系任务
  - advancedFilterQuery: 字符串形式的高级过滤表达式（UI 中保存生成）
  - filterMode: "INCLUDE" | "EXCLUDE"

示例（常用预设）：
- 今天：advancedFilterQuery="due=today OR start=today"
- 未来7天：advancedFilterQuery="due<=+7d OR start<=+7d"
- 逾期：advancedFilterQuery="due<today"
- 高优先级：advancedFilterQuery="priority>=3"

## 6. 状态循环与映射（TaskStatus / StatusCycle）

- TaskStatusConfig（marks）: 不同状态映射到复选标记字符（如 completed:"x"）
- StatusCycle: 自定义状态循环（id/name/priority/cycle/marks/enabled）
- 设置位置：settings.statusCycle / settings.statusConfig（具体以 UI 为准）

用途：控制编辑器中复选框切换顺序与标记方式，配合状态指示器显示。

## 7. 完成任务移动（CompletedTaskMoverSettings）

- enableCompletedTaskMover: 启用完成任务移动功能
- taskMarkerType: "version" | "date" | "custom"（完成标记策略）
- defaultTargetFile/defaultInsertionMode/defaultHeadingName: 移动目标与插入模式
- enableAutoMove: 自动移动完成任务
- treatAbandonedAsCompleted/completeAllMovedTasks/withCurrentFileLink: 其他策略
- Incompleted* 系列：对未完成任务的移动与自动移动配置

建议：如需自动归档完成任务，设置 enableAutoMove=true 并指定默认目标文件与插入位置。

## 8. 快速捕获（QuickCaptureSettings）

- enableQuickCapture: 启用
- targetFile/targetType: 固定文件、日记、或自定义文件
- appendToFile: "append"|"prepend"|"replace"
- dailyNoteSettings: { format, folder, template }
- autoAddTaskPrefix: 自动加 "- [ ]" 前缀
- minimalModeSettings/keepOpenAfterCapture/rememberLastMode 等增强交互选项

## 9. 时间解析与自动日期（EnhancedTimeParsing / AutoDateManager）

- EnhancedTimeParsingConfig: 自然语言时间解析相关开关/格式
- AutoDateManagerSettings: 自动写入完成/开始/取消时间与标记（格式、marker）

建议：结合自然语言解析与自动日期，增强任务时间管理体验。

## 10. 文件过滤（FileFilterSettings）

- enabled: 启用文件/文件夹/模式级过滤，提高索引性能
- mode: WHITELIST/BLACKLIST
- rules: { type:"file"|"folder"|"pattern", path, enabled, scope }
- scopeControls: { inlineTasksEnabled, fileTasksEnabled }

## 11. 通知（NotificationSettings）

- enabled: 是否启用通知（如每日摘要 time="HH:mm"）
- 细粒度通知可配置（任务提醒时机）

## 12. 时间线侧边栏（TimelineSidebarSettings）

- enableTimelineSidebar/autoOpenOnStartup
- showCompletedTasks/focusModeByDefault
- maxEventsToShow 等界面行为

## 13. 其他常用设置

- FluentViewSettings: 工作区与界面风格（modern/classic）、工作区侧叶等
- McpServerConfig: MCP 服务器启用与端口、鉴权等
- RewardSettings: 激励机制（奖励项、概率、展示形式）
- HabitSettings: 习惯追踪（基础数据）
- ProjectConfiguration: 项目路径映射、元数据检测、命名策略、增强项目等
- FileParsingConfiguration: 从文件元数据/标签解析任务的策略
- TaskTimerSettings: 计时器相关（元数据检测、时间格式、块引用前缀）
- OnCompletionSettings: 完成后动作的默认档案位置与显示方式

---

## 常见场景示例（滴答清单风）

1) 表格视图按到期日升序、默认隐藏完成任务：
- viewConfiguration.table: defaultSortField="dueDate"，defaultSortOrder="asc"，hideCompletedAndAbandonedTasks=true；
- sortCriteria: [{field:"dueDate",order:"asc"}]

2) 看板视图按状态分组、卡片按优先级降序：
- specificConfig.groupBy="status"，defaultSortField="priority"，defaultSortOrder="desc"

3) 日历视图仅工作时段显示：
- showWorkingHoursOnly=true，workingHoursStart=9，workingHoursEnd=18

4) 预设筛选：
- 今天/未来7天/逾期/高优先级等，通过 taskFilter.presetTaskFilters 的 advancedFilterQuery 定义

---

注意
- data.json 为插件持久化配置文件，手动编辑请先备份；UI 更改会覆盖对应字段。
- 复杂筛选建议在 UI 中使用高级过滤器保存，以确保结构正确（RootFilterState）。
- 构建部署需保持 manifest.json 的 id 与插件目录一致（obsidian-task-progress-bar）。
