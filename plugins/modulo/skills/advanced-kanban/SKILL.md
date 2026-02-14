# Advanced Kanban

Swimlane kanban boards, inline card editing, card templates, WIP limits, drag between lanes and columns, and filtering.

## Kanban Board with Swimlanes

```tsx
"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: { name: string; avatar: string };
  labels: string[];
  columnId: string;
  swimlaneId: string;
}

interface Column {
  id: string;
  title: string;
  wipLimit?: number;
}

interface Swimlane {
  id: string;
  title: string;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

// Sortable card component
function SortableCard({ card }: { card: KanbanCard }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <CardContent card={card} />
    </div>
  );
}

function CardContent({ card }: { card: KanbanCard }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-tight">{card.title}</h4>
        <Badge variant="outline" className={cn("text-[10px] shrink-0", priorityColors[card.priority])}>
          {card.priority}
        </Badge>
      </div>
      {card.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {card.description}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {card.labels.map((label) => (
            <Badge key={label} variant="secondary" className="text-[10px] px-1.5 py-0">
              {label}
            </Badge>
          ))}
        </div>
        {card.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={card.assignee.avatar} />
            <AvatarFallback className="text-[10px]">
              {card.assignee.name[0]}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

// Droppable column cell (intersection of column + swimlane)
function ColumnCell({
  columnId,
  swimlaneId,
  cards,
  wipLimit,
}: {
  columnId: string;
  swimlaneId: string;
  cards: KanbanCard[];
  wipLimit?: number;
}) {
  const droppableId = `${columnId}::${swimlaneId}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });
  const overWip = wipLimit !== undefined && cards.length >= wipLimit;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[120px] rounded-md border border-dashed border-transparent p-2 transition-colors",
        isOver && "border-primary bg-primary/5",
        overWip && "bg-red-50 dark:bg-red-950/20"
      )}
    >
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({
  columns,
  swimlanes,
  initialCards,
}: {
  columns: Column[];
  swimlanes: Swimlane[];
  initialCards: KanbanCard[];
}) {
  const [cards, setCards] = useState(initialCards);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const overId = String(over.id);
    if (overId.includes("::")) {
      // Dropped over a cell
      const [columnId, swimlaneId] = overId.split("::");
      setCards((prev) =>
        prev.map((c) =>
          c.id === active.id ? { ...c, columnId, swimlaneId } : c
        )
      );
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-[150px] p-2 text-left text-sm font-medium text-muted-foreground" />
              {columns.map((col) => (
                <th key={col.id} className="min-w-[250px] p-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{col.title}</span>
                    {col.wipLimit && (
                      <Badge variant="outline" className="text-[10px]">
                        WIP: {col.wipLimit}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-[10px]">
                      {cards.filter((c) => c.columnId === col.id).length}
                    </Badge>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {swimlanes.map((lane) => (
              <tr key={lane.id} className="border-t">
                <td className="p-2 align-top">
                  <span className="text-sm font-medium">{lane.title}</span>
                </td>
                {columns.map((col) => (
                  <td key={col.id} className="p-2 align-top">
                    <ColumnCell
                      columnId={col.id}
                      swimlaneId={lane.id}
                      wipLimit={col.wipLimit}
                      cards={cards.filter(
                        (c) => c.columnId === col.id && c.swimlaneId === lane.id
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="w-[240px] rounded-lg border bg-card p-3 shadow-lg rotate-3">
            <CardContent card={activeCard} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
```

## Inline Card Editor

```tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CardEditorProps {
  card: KanbanCard;
  onSave: (updates: Partial<KanbanCard>) => void;
  onCancel: () => void;
}

export function InlineCardEditor({ card, onSave, onCancel }: CardEditorProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [priority, setPriority] = useState(card.priority);

  return (
    <div className="space-y-3 rounded-lg border bg-card p-3 shadow-lg">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        className="h-8 text-sm font-medium"
        autoFocus
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        rows={3}
        className="text-sm resize-none"
      />
      <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onSave({ title, description, priority })}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
```

## Kanban Filter Bar

```tsx
"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface KanbanFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  priority: string | null;
  onPriorityChange: (value: string | null) => void;
  assignee: string | null;
  onAssigneeChange: (value: string | null) => void;
  assignees: { id: string; name: string }[];
}

export function KanbanFilters({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  assignee,
  onAssigneeChange,
  assignees,
}: KanbanFiltersProps) {
  const hasFilters = search || priority || assignee;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cards..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 w-[200px]"
        />
      </div>

      <Select value={priority ?? "all"} onValueChange={(v) => onPriorityChange(v === "all" ? null : v)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={assignee ?? "all"} onValueChange={(v) => onAssigneeChange(v === "all" ? null : v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {assignees.map((a) => (
            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <button
          onClick={() => {
            onSearchChange("");
            onPriorityChange(null);
            onAssigneeChange(null);
          }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
```

## Key Rules

- Use `@dnd-kit/core` + `@dnd-kit/sortable` for accessible drag-and-drop
- Swimlanes = rows, Columns = statuses — create droppable zones at intersections
- WIP limits: visually highlight columns at capacity (red background)
- `DragOverlay` renders the dragged card with slight rotation for visual feedback
- `PointerSensor` with `distance: 5` prevents accidental drags on click
- Inline editing: double-click a card to enter edit mode
- Filter bar: search + priority + assignee filters, show active filter count
- Cards should show: title, priority badge, labels, assignee avatar
- Always use `closestCorners` collision detection for grid-like layouts
