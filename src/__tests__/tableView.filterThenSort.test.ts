import { describe, it, expect } from "@jest/globals";
import { filterTasks } from "@/utils/task/task-filter-utils";
import { sortTasks } from "@/commands/sortTaskCommands";
import { DEFAULT_SETTINGS } from "@/common/setting-definition";

// Minimal Task type for test
interface Task {
  id: string;
  status: string;
  completed: boolean;
  content: string;
  filePath: string;
  metadata: {
    dueDate?: number;
    project?: string;
    context?: string;
    tags?: string[];
  };
}

// Mock plugin-like settings object
const plugin: any = {
  settings: DEFAULT_SETTINGS,
};

// Helper to make a timestamp for days from now
function daysFromNow(days: number) {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

describe("TableView: filter first then sort", () => {
  it("applies Completed=false filter before sorting by dueDate asc", () => {
    const now = new Date();

    const tasks: Task[] = [
      { id: "a", status: " ", completed: false, content: "A", filePath: "a.md", metadata: { dueDate: daysFromNow(3) } },
      { id: "b", status: "x", completed: true, content: "B", filePath: "b.md", metadata: { dueDate: daysFromNow(1) } },
      { id: "c", status: " ", completed: false, content: "C", filePath: "c.md", metadata: { dueDate: daysFromNow(2) } },
    ];

    // Simulate view config: hideCompletedAndAbandonedTasks = true for table view
    const viewConfig = {
      id: "table",
      name: "Table",
      icon: "table",
      type: "default",
      visible: true,
      hideCompletedAndAbandonedTasks: true,
      filterBlanks: false,
      filterRules: {},
      sortCriteria: [{ field: "dueDate", order: "asc" }],
      specificConfig: { viewType: "table" } as any,
      region: "top" as any,
    };

    // Provide table view config directly via plugin settings so getViewSettingOrDefault picks it up
    plugin.settings.viewConfiguration = [viewConfig] as any;

    // Run filtering first
    const filtered = filterTasks(tasks as any, "table" as any, plugin, {});
    expect(filtered.every(t => !t.completed)).toBe(true);

    // Then sort by dueDate asc
    const sorted = sortTasks(filtered as any, [{ field: "dueDate", order: "asc" }], plugin.settings);
    const ids = sorted.map(t => t.id);
    expect(ids).toEqual(["c", "a"]); // due in 2 days before 3 days; completed "b" was removed before sort
  });
});
