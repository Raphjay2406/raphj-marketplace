---
name: drag-and-drop
description: "Drag-and-drop patterns with dnd-kit: sortable lists, kanban boards, file tree reordering, multi-container drag, accessible drag. Works with Next.js and Astro."
---

Use this skill when the user mentions drag and drop, sortable list, kanban board, reorderable, dnd-kit, drag handles, or any reordering interaction. Triggers on: drag, drop, sortable, kanban, reorder, dnd-kit, drag handle, draggable.

You are an expert at building accessible, performant drag-and-drop interfaces with @dnd-kit.

## Setup

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Sortable List

```tsx
'use client'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

interface Item { id: string; title: string }

function SortableItem({ item }: { item: Item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-background p-3 transition-shadow",
        isDragging && "shadow-lg ring-2 ring-primary/20 opacity-90 z-50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-sm">{item.title}</span>
    </div>
  )
}

export function SortableList({ items, onReorder }: { items: Item[]; onReorder: (items: Item[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id)
      const newIndex = items.findIndex(i => i.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map(item => <SortableItem key={item.id} item={item} />)}
        </div>
      </SortableContext>
    </DndContext>
  )
}
```

## Kanban Board

```tsx
'use client'
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, type DragStartEvent, type DragEndEvent, type DragOverEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

interface Task { id: string; title: string; columnId: string }
interface Column { id: string; title: string }

function KanbanColumn({ column, tasks }: { column: Column; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-muted/30">
      <div className="flex items-center justify-between px-3 py-2.5">
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <Badge variant="secondary" className="text-xs">{tasks.length}</Badge>
      </div>
      <div ref={setNodeRef} className="flex-1 space-y-2 px-2 pb-2 min-h-[100px]">
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <KanbanCard key={task.id} task={task} />)}
        </SortableContext>
      </div>
      <Button variant="ghost" size="sm" className="mx-2 mb-2 justify-start text-muted-foreground">
        <Plus className="h-4 w-4 mr-1" /> Add task
      </Button>
    </div>
  )
}

function KanbanCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg border bg-background p-3 text-sm cursor-grab active:cursor-grabbing shadow-sm",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary/20"
      )}
    >
      {task.title}
    </div>
  )
}

export function KanbanBoard({ columns, tasks, onTaskMove }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find(t => t.id === event.active.id) ?? null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    // Move task between columns
    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) return
    const overColumn = columns.find(c => c.id === over.id)
    if (overColumn && activeTask.columnId !== overColumn.id) {
      onTaskMove(activeTask.id, overColumn.id)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    // Handle reordering within same column
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => (
          <KanbanColumn key={col.id} column={col} tasks={tasks.filter(t => t.columnId === col.id)} />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="rounded-lg border bg-background p-3 text-sm shadow-xl ring-2 ring-primary/20 rotate-2">
            {activeTask.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
```

## Sortable Grid (Image Reorder)

```tsx
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'

function SortableGrid({ images, onReorder }: { images: ImageItem[]; onReorder: (items: ImageItem[]) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map(img => (
            <SortableImage key={img.id} image={img} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableImage({ image }: { image: ImageItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "aspect-square rounded-xl overflow-hidden cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
      {...attributes}
      {...listeners}
    >
      <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
    </div>
  )
}
```

## Accessible Drag-and-Drop

```tsx
// dnd-kit has built-in keyboard support via KeyboardSensor
// Always include both PointerSensor and KeyboardSensor
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
)

// Custom screen reader announcements
const announcements = {
  onDragStart({ active }) {
    return `Picked up sortable item ${active.id}. Use arrow keys to move, space to drop.`
  },
  onDragOver({ active, over }) {
    return over ? `Sortable item ${active.id} is over ${over.id}.` : `Sortable item ${active.id} is no longer over a droppable area.`
  },
  onDragEnd({ active, over }) {
    return over ? `Sortable item ${active.id} was dropped on ${over.id}.` : `Sortable item ${active.id} was dropped.`
  },
  onDragCancel({ active }) {
    return `Dragging was cancelled. Sortable item ${active.id} was dropped.`
  },
}

<DndContext sensors={sensors} accessibility={{ announcements }}>
  {/* ... */}
</DndContext>
```

## Astro Integration

```astro
---
import { KanbanBoard } from '../components/KanbanBoard'
import { SortableList } from '../components/SortableList'
---

<Layout>
  <!-- Drag-and-drop requires client-side JS — use client:load -->
  <SortableList client:load items={items} />
  <KanbanBoard client:load columns={columns} tasks={tasks} />
</Layout>
```

## Best Practices

1. **Always include KeyboardSensor**: Accessibility is non-negotiable for drag-and-drop
2. **Use drag handles**: Don't make the entire item draggable — use a grip icon handle
3. **Activation constraint**: Set `distance: 5-8` to distinguish clicks from drags
4. **DragOverlay**: Show a floating preview of the dragged item for visual clarity
5. **Visual feedback**: Ring/shadow on drag, opacity change on source position
6. **Restrict axes**: Use `restrictToVerticalAxis` for lists, no restriction for grids/kanban
7. **Optimistic updates**: Reorder state immediately, sync with server in background
8. **Touch support**: dnd-kit handles touch natively — no extra configuration needed
