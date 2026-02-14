# Timeline & Gantt Charts

Project timeline visualization, Gantt charts with dependencies, milestone tracking, and interactive scheduling UI.

## Timeline View

```tsx
"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "milestone" | "task" | "release" | "meeting";
  status: "completed" | "in-progress" | "upcoming";
  assignee?: { name: string; avatar: string };
}

const typeColors = {
  milestone: "bg-purple-500",
  task: "bg-blue-500",
  release: "bg-green-500",
  meeting: "bg-orange-500",
};

const statusStyles = {
  completed: "border-green-500/50 bg-green-500/5",
  "in-progress": "border-blue-500/50 bg-blue-500/5",
  upcoming: "border-border bg-card",
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />

      {events.map((event, i) => (
        <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Dot */}
          <div className="relative z-10 mt-1.5">
            <div className={cn("h-3 w-3 rounded-full ring-4 ring-background", typeColors[event.type])} />
          </div>

          {/* Content */}
          <div className={cn("flex-1 rounded-lg border p-4", statusStyles[event.status])}>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {event.assignee && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={event.assignee.avatar} />
                    <AvatarFallback className="text-[10px]">{event.assignee.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <Badge variant="outline" className="text-xs capitalize">
                  {event.status}
                </Badge>
              </div>
            </div>
            <time className="mt-2 block text-xs text-muted-foreground">
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Gantt Chart

```tsx
"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  color?: string;
  dependencies?: string[];
  group?: string;
}

function getDaysBetween(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function getWeeks(start: Date, end: Date): Date[] {
  const weeks: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }
  return weeks;
}

export function GanttChart({ tasks }: { tasks: GanttTask[] }) {
  const { chartStart, chartEnd, totalDays, weeks } = useMemo(() => {
    const dates = tasks.flatMap((t) => [new Date(t.startDate), new Date(t.endDate)]);
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    // Add padding
    min.setDate(min.getDate() - 7);
    max.setDate(max.getDate() + 7);

    return {
      chartStart: min,
      chartEnd: max,
      totalDays: getDaysBetween(min, max),
      weeks: getWeeks(min, max),
    };
  }, [tasks]);

  function getBarStyle(task: GanttTask) {
    const start = getDaysBetween(chartStart, new Date(task.startDate));
    const duration = getDaysBetween(new Date(task.startDate), new Date(task.endDate));
    return {
      left: `${(start / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  }

  // Group tasks
  const groups = useMemo(() => {
    const grouped = new Map<string, GanttTask[]>();
    for (const task of tasks) {
      const group = task.group ?? "Ungrouped";
      if (!grouped.has(group)) grouped.set(group, []);
      grouped.get(group)!.push(task);
    }
    return grouped;
  }, [tasks]);

  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-lg border">
        <div className="min-w-[800px]">
          {/* Header — weeks */}
          <div className="flex border-b bg-muted/30">
            <div className="w-[200px] shrink-0 border-r p-2 text-sm font-medium">
              Task
            </div>
            <div className="relative flex-1">
              <div className="flex">
                {weeks.map((week, i) => (
                  <div
                    key={i}
                    className="border-r px-2 py-2 text-xs text-muted-foreground"
                    style={{ width: `${(7 / totalDays) * 100}%` }}
                  >
                    {week.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rows */}
          {Array.from(groups).map(([groupName, groupTasks]) => (
            <div key={groupName}>
              {/* Group header */}
              <div className="flex border-b bg-muted/20">
                <div className="w-[200px] shrink-0 border-r p-2 text-xs font-semibold uppercase text-muted-foreground">
                  {groupName}
                </div>
                <div className="flex-1" />
              </div>

              {groupTasks.map((task) => (
                <div key={task.id} className="flex border-b hover:bg-muted/10">
                  <div className="w-[200px] shrink-0 border-r p-2">
                    <span className="text-sm">{task.name}</span>
                  </div>
                  <div className="relative flex-1 py-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-6 rounded-full cursor-pointer"
                          style={getBarStyle(task)}
                        >
                          {/* Background */}
                          <div
                            className="h-full rounded-full opacity-20"
                            style={{ backgroundColor: task.color ?? "#3b82f6" }}
                          />
                          {/* Progress fill */}
                          <div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                              width: `${task.progress}%`,
                              backgroundColor: task.color ?? "#3b82f6",
                            }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">{task.name}</p>
                          <p className="text-xs">
                            {new Date(task.startDate).toLocaleDateString()} —{" "}
                            {new Date(task.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs">{task.progress}% complete</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
```

## Milestone Tracker

```tsx
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  date: string;
  status: "completed" | "current" | "upcoming";
  description: string;
}

export function MilestoneTracker({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-4">
      {milestones.map((milestone, i) => (
        <div key={milestone.id} className="flex items-start">
          {/* Connector line */}
          {i > 0 && (
            <div className={cn(
              "mt-4 h-0.5 w-16 shrink-0",
              milestone.status === "completed" || milestones[i - 1].status === "completed"
                ? "bg-green-500"
                : "bg-border"
            )} />
          )}

          {/* Milestone node */}
          <div className="flex flex-col items-center text-center w-[140px] shrink-0">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              milestone.status === "completed" && "bg-green-500 text-white",
              milestone.status === "current" && "bg-blue-500 text-white ring-4 ring-blue-500/20",
              milestone.status === "upcoming" && "bg-muted text-muted-foreground",
            )}>
              {milestone.status === "completed" ? (
                <CheckCircle className="h-5 w-5" />
              ) : milestone.status === "current" ? (
                <Clock className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </div>
            <h4 className="mt-2 text-sm font-medium">{milestone.title}</h4>
            <time className="text-xs text-muted-foreground">
              {new Date(milestone.date).toLocaleDateString("en-US", {
                month: "short", day: "numeric",
              })}
            </time>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {milestone.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Key Rules

- Timeline: vertical layout with a connecting line and color-coded dots by type
- Gantt chart: calculate bar position/width from dates relative to chart range
- Group tasks in Gantt by category/phase with collapsible group headers
- Show progress as filled portion within each Gantt bar
- Use Tooltip for task details on hover (dates, progress percentage)
- Milestone tracker: horizontal node layout with connector lines
- Color states: green=completed, blue=in-progress, gray=upcoming
- Add 7 days padding before/after earliest/latest dates for visual breathing room
- Responsive: horizontal scroll on mobile for Gantt and milestone views
