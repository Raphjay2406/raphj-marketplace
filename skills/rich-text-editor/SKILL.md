---
name: rich-text-editor
description: "Rich text editor patterns: TipTap with shadcn styling, toolbar with formatting controls, slash commands, image embeds, markdown preview, collaborative editing, mention autocomplete. Works with Next.js and Astro."
---

Use this skill when the user mentions rich text editor, WYSIWYG, TipTap, text editor, content editor, markdown editor, slash commands editor, mentions, or collaborative editing. Triggers on: rich text, WYSIWYG, TipTap, text editor, content editor, markdown, slash command, editor.

You are an expert at building rich text editors with TipTap and shadcn/ui.

## TipTap Setup

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-image @tiptap/extension-code-block-lowlight @tiptap/extension-underline @tiptap/extension-text-align @tiptap/extension-mention lowlight
```

## Editor Component

```tsx
'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { EditorToolbar } from './editor-toolbar'
import { cn } from '@/lib/utils'

const lowlight = createLowlight(common)

interface RichEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
}

export function RichEditor({ content = '', onChange, placeholder = 'Start writing...', className }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full' } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  })

  if (!editor) return null

  return (
    <div className={cn('rounded-md border bg-background', className)}>
      <EditorToolbar editor={editor} />
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-md">
          <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('link')} onClick={() => {
            const url = window.prompt('URL')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}>
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  )
}
```

## Editor Toolbar

```tsx
import { type Editor } from '@tiptap/react'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Quote, Minus, ImageIcon, Link as LinkIcon, Undo, Redo,
} from 'lucide-react'

export function EditorToolbar({ editor }: { editor: Editor }) {
  const addImage = () => {
    const url = window.prompt('Image URL')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1">
      {/* Heading select */}
      <Select
        value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : 'p'}
        onValueChange={v => {
          if (v === 'p') editor.chain().focus().setParagraph().run()
          else editor.chain().focus().toggleHeading({ level: Number(v) as 1|2|3 }).run()
        }}
      >
        <SelectTrigger className="h-8 w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="p">Paragraph</SelectItem>
          <SelectItem value="1">Heading 1</SelectItem>
          <SelectItem value="2">Heading 2</SelectItem>
          <SelectItem value="3">Heading 3</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Inline formatting */}
      <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('code')} onPressedChange={() => editor.chain().focus().toggleCode().run()}>
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6" />

      {/* Block elements */}
      <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" onPressedChange={addImage}>
        <ImageIcon className="h-4 w-4" />
      </Toggle>

      <div className="ml-auto flex items-center gap-1">
        <Toggle size="sm" onPressedChange={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  )
}
```

## Slash Commands Extension

```tsx
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'

const slashCommands = [
  { title: 'Heading 1', command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { title: 'Heading 2', command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { title: 'Bullet List', command: (editor) => editor.chain().focus().toggleBulletList().run() },
  { title: 'Numbered List', command: (editor) => editor.chain().focus().toggleOrderedList().run() },
  { title: 'Quote', command: (editor) => editor.chain().focus().toggleBlockquote().run() },
  { title: 'Code Block', command: (editor) => editor.chain().focus().toggleCodeBlock().run() },
  { title: 'Image', command: (editor) => {
    const url = window.prompt('Image URL')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }},
  { title: 'Divider', command: (editor) => editor.chain().focus().setHorizontalRule().run() },
]

export const SlashCommand = Extension.create({
  name: 'slashCommand',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command(editor)
          editor.chain().focus().deleteRange(range).run()
        },
      },
    }
  },
  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })]
  },
})
```

## Astro Integration

```astro
---
// Use React island with client:load for editor
---

<div id="editor-mount">
  <RichEditor client:load content={initialContent} onChange={handleChange} />
</div>
```

## Best Practices

1. Use `BubbleMenu` for inline formatting (appears on text selection)
2. Slash commands (`/`) for block-level insertions
3. Style editor output with Tailwind `prose` classes
4. Always include undo/redo in toolbar
5. Debounce `onChange` (300ms) before saving to prevent excessive API calls
6. Use `lowlight` for syntax-highlighted code blocks
7. For Astro: mount TipTap as a React island with `client:load`
8. Keep toolbar organized: text format | lists | alignment | blocks | undo/redo
