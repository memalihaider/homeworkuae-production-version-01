'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Palette } from 'lucide-react'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeightClassName?: string
}

const toEditableHtml = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''

  // If HTML is already stored, keep it as-is.
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return value
  }

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write details...',
  className = '',
  minHeightClassName = 'min-h-[130px]',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState('#1f2937')

  const normalizedValue = useMemo(() => toEditableHtml(value || ''), [value])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    if (editor.innerHTML !== normalizedValue) {
      editor.innerHTML = normalizedValue
    }
  }, [normalizedValue])

  const runCommand = (command: string, commandValue?: string) => {
    const editor = editorRef.current
    if (!editor) return

    editor.focus()
    document.execCommand(command, false, commandValue)
    onChange(editor.innerHTML)
  }

  return (
    <div className={`rounded border border-gray-200 bg-gray-50 ${className}`}>
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white p-1.5">
        <button
          type="button"
          onClick={() => runCommand('bold')}
          className="rounded p-1.5 text-gray-700 hover:bg-gray-100"
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => runCommand('italic')}
          className="rounded p-1.5 text-gray-700 hover:bg-gray-100"
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => runCommand('underline')}
          className="rounded p-1.5 text-gray-700 hover:bg-gray-100"
          title="Underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => runCommand('insertUnorderedList')}
          className="rounded p-1.5 text-gray-700 hover:bg-gray-100"
          title="Bulleted List"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => runCommand('insertOrderedList')}
          className="rounded p-1.5 text-gray-700 hover:bg-gray-100"
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <label className="ml-1 inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 text-gray-700 hover:bg-gray-100" title="Text Color">
          <Palette className="h-3.5 w-3.5" />
          <input
            type="color"
            value={color}
            onChange={(event) => {
              const nextColor = event.target.value
              setColor(nextColor)
              runCommand('foreColor', nextColor)
            }}
            className="h-4 w-4 border-0 bg-transparent p-0"
          />
        </label>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange((event.currentTarget as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        className={`w-full px-2.5 py-2 text-xs leading-relaxed text-gray-700 outline-none ${minHeightClassName} [&:empty:before]:pointer-events-none [&:empty:before]:text-gray-400 [&:empty:before]:content-[attr(data-placeholder)]`}
      />
    </div>
  )
}
