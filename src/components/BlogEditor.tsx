import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";

type BlogEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const BlogEditor = ({ value, onChange }: BlogEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TextStyle,
      Color,
      Highlight,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "whitespace-pre-wrap",
      },
      transformPastedHTML: (html) => html,
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;

        const reader = new FileReader();
        reader.onload = () => {
          const src = String(reader.result);
          const node = view.state.schema.nodes.image?.create({ src });
          if (!node) return;
          const tr = view.state.tr.replaceSelectionWith(node);
          view.dispatch(tr);
        };
        reader.readAsDataURL(file);
        return true;
      },
    },
    parseOptions: {
      preserveWhitespace: "full",
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border rounded-lg bg-background overflow-hidden">
      <div className="flex flex-wrap gap-2 p-3 border-b border-border bg-muted/30">
        <Button type="button" size="sm" variant="secondary" onClick={() => editor.chain().focus().toggleBold().run()}>
          Negrita
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => editor.chain().focus().toggleItalic().run()}>
          Cursiva
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Subrayado
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Viñetas
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Enumeración
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          Tabla
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="px-4 py-3 min-h-[240px] text-foreground [&_.ProseMirror]:outline-none [&_.ProseMirror]:prose [&_.ProseMirror]:prose-neutral [&_.ProseMirror]:max-w-none [&_.ProseMirror]:whitespace-pre-wrap"
      />
    </div>
  );
};
