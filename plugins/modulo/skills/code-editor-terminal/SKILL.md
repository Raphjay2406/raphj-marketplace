# Code Editor & Terminal UI

Monaco editor integration, diff viewer, JSON tree viewer, syntax highlighting, and terminal/log viewer patterns.

## Monaco Editor Integration

```tsx
"use client";

import { useRef, useCallback } from "react";
import Editor, { type OnMount, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = "typescript",
  height = "400px",
  readOnly = false,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Configure editor settings
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: "on",
      renderLineHighlight: "gutter",
      bracketPairColorization: { enabled: true },
      padding: { top: 16, bottom: 16 },
      tabSize: 2,
      wordWrap: "on",
    });

    // Add keyboard shortcut for save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // trigger save callback
    });
  }, []);

  return (
    <div className="overflow-hidden rounded-lg border">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(val) => onChange(val ?? "")}
        onMount={handleMount}
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        options={{ readOnly }}
        loading={
          <div className="flex h-full items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        }
      />
    </div>
  );
}
```

## Diff Viewer

```tsx
"use client";

import { DiffEditor } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
  height?: string;
}

export function DiffViewer({
  original,
  modified,
  language = "typescript",
  height = "500px",
}: DiffViewerProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <span className="text-sm font-medium text-red-600">Original</span>
        <span className="text-sm font-medium text-green-600">Modified</span>
      </div>
      <DiffEditor
        height={height}
        language={language}
        original={original}
        modified={modified}
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        options={{
          readOnly: true,
          renderSideBySide: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
        }}
      />
    </div>
  );
}
```

## JSON Tree Viewer

```tsx
"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonNodeProps {
  name: string;
  value: unknown;
  depth?: number;
  defaultExpanded?: boolean;
}

function JsonNode({ name, value, depth = 0, defaultExpanded = true }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded && depth < 2);

  if (value === null) {
    return (
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 20 }}>
        <span className="text-purple-600 dark:text-purple-400">{name}</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-gray-500 italic">null</span>
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    const isArray = Array.isArray(value);
    const entries = Object.entries(value);
    const bracket = isArray ? ["[", "]"] : ["{", "}"];

    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 hover:bg-muted/50 rounded px-1 -ml-1"
          style={{ paddingLeft: depth * 20 }}
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-purple-600 dark:text-purple-400">{name}</span>
          <span className="text-muted-foreground">: {bracket[0]}</span>
          {!expanded && (
            <span className="text-muted-foreground">
              {entries.length} {isArray ? "items" : "keys"} {bracket[1]}
            </span>
          )}
        </button>
        {expanded && (
          <>
            {entries.map(([key, val]) => (
              <JsonNode
                key={key}
                name={isArray ? key : `"${key}"`}
                value={val}
                depth={depth + 1}
                defaultExpanded={depth < 1}
              />
            ))}
            <div style={{ paddingLeft: depth * 20 }} className="text-muted-foreground">
              {bracket[1]}
            </div>
          </>
        )}
      </div>
    );
  }

  const colorClass =
    typeof value === "string"
      ? "text-green-600 dark:text-green-400"
      : typeof value === "number"
        ? "text-blue-600 dark:text-blue-400"
        : typeof value === "boolean"
          ? "text-orange-600 dark:text-orange-400"
          : "text-foreground";

  const displayValue =
    typeof value === "string" ? `"${value}"` : String(value);

  return (
    <div className="flex items-center gap-1" style={{ paddingLeft: depth * 20 }}>
      <span className="h-3 w-3" />
      <span className="text-purple-600 dark:text-purple-400">{name}</span>
      <span className="text-muted-foreground">:</span>
      <span className={colorClass}>{displayValue}</span>
    </div>
  );
}

export function JsonViewer({ data, name = "root" }: { data: unknown; name?: string }) {
  return (
    <div className="overflow-auto rounded-lg border bg-background p-4 font-mono text-sm">
      <JsonNode name={name} value={data} />
    </div>
  );
}
```

## Log Viewer / Terminal Output

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowDown, Pause, Play, Trash2 } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
}

const levelStyles = {
  info: "text-blue-500",
  warn: "text-yellow-500",
  error: "text-red-500",
  debug: "text-gray-400",
};

export function LogViewer({ logs }: { logs: LogEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filtered = filter
    ? logs.filter((l) => l.level === filter)
    : logs;

  return (
    <div className="flex flex-col rounded-lg border bg-black">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-gray-800 px-3 py-2">
        <div className="flex gap-1">
          {(["info", "warn", "error", "debug"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(filter === level ? null : level)}
              className={cn(
                "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                filter === level
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-gray-400 hover:text-white"
          onClick={() => setAutoScroll(!autoScroll)}
        >
          {autoScroll ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-gray-400 hover:text-white"
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
          }}
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Log output */}
      <div
        ref={containerRef}
        className="h-[400px] overflow-auto p-3 font-mono text-xs leading-relaxed"
      >
        {filtered.map((entry) => (
          <div key={entry.id} className="flex gap-3 hover:bg-gray-900/50">
            <span className="text-gray-600 shrink-0">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <span className={cn("shrink-0 w-12 uppercase font-semibold", levelStyles[entry.level])}>
              {entry.level}
            </span>
            <span className="text-gray-300 break-all">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Multi-Tab Code Editor

```tsx
"use client";

import { useState } from "react";
import { CodeEditor } from "./code-editor";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface EditorTab {
  id: string;
  name: string;
  language: string;
  content: string;
}

export function MultiTabEditor({
  tabs: initialTabs,
  onSave,
}: {
  tabs: EditorTab[];
  onSave?: (tab: EditorTab) => void;
}) {
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTabId, setActiveTabId] = useState(initialTabs[0]?.id);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  function updateContent(id: string, content: string) {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content } : t))
    );
  }

  function closeTab(id: string) {
    setTabs((prev) => prev.filter((t) => t.id !== id));
    if (activeTabId === id) {
      setActiveTabId(tabs[0]?.id);
    }
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b bg-muted/30 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex items-center gap-2 border-r px-4 py-2 text-sm shrink-0",
              activeTabId === tab.id
                ? "bg-background font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.name}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") closeTab(tab.id);
              }}
              className="rounded-sm p-0.5 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>

      {/* Editor */}
      {activeTab && (
        <CodeEditor
          value={activeTab.content}
          onChange={(val) => updateContent(activeTab.id, val)}
          language={activeTab.language}
          height="500px"
        />
      )}
    </div>
  );
}
```

## Language Selector

```tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "python", label: "Python" },
  { value: "sql", label: "SQL" },
  { value: "yaml", label: "YAML" },
];

export function LanguageSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (language: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

## Key Rules

- Use `@monaco-editor/react` for Monaco integration — lazy-loads the editor bundle
- Always set `scrollBeyondLastLine: false` and `minimap: { enabled: false }` for embedded editors
- Match editor theme to app theme: `vs-dark` for dark mode, `light` for light mode
- Use `DiffEditor` for side-by-side comparison, set `readOnly: true` for view-only diffs
- JSON viewer: auto-collapse nested levels beyond depth 2
- Log viewer: auto-scroll to bottom, allow pause, color-code by log level
- Multi-tab editor: support Ctrl+S save shortcut, tab close buttons
- Wrap Monaco in `"use client"` — it requires browser APIs
