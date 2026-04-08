// src/components/admin/saber-pediatrico/shared/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Escribe el contenido aquí...' }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-gray-900',
      },
    },
  });

  if (!mounted) {
    return (
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 min-h-[350px] flex items-center justify-center">
        <div className="text-gray-400">Cargando editor...</div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#FFC300] focus-within:ring-4 focus-within:ring-[#FFC300]/20 transition-all duration-300">
      {/* Barra de herramientas */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-200 text-[#FFC300]' : 'text-gray-600'
          }`}
          title="Negrita"
        >
          <Bold size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-200 text-[#FFC300]' : 'text-gray-600'
          }`}
          title="Cursiva"
        >
          <Italic size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-gray-200 text-[#FFC300]' : 'text-gray-600'
          }`}
          title="Lista con viñetas"
        >
          <List size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-gray-200 text-[#FFC300]' : 'text-gray-600'
          }`}
          title="Lista numerada"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-[#FFC300]' : 'text-gray-600'
          }`}
          title="Alinear izquierda"
        >
          <AlignLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-[#FFC300]' : 'text-gray-600'
          }`}
          title="Centrar"
        >
          <AlignCenter size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-[#FFC300]' : 'text-gray-600'
          }`}
          title="Alinear derecha"
        >
          <AlignRight size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Deshacer"
        >
          <Undo size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Rehacer"
        >
          <Redo size={18} />
        </button>
      </div>

      {/* Editor con estilos para texto visible */}
      <style jsx global>{`
        .ProseMirror {
          color: #1a1a1a !important;
          font-size: 1rem !important;
          line-height: 1.6 !important;
          min-height: 300px;
          padding: 1rem;
        }
        .ProseMirror p {
          color: #1a1a1a !important;
          margin-bottom: 1rem !important;
        }
        .ProseMirror strong {
          color: #0A3D62 !important;
          font-weight: 700 !important;
        }
        .ProseMirror h1 {
          color: #0A3D62 !important;
          font-size: 1.8rem !important;
          font-weight: 700 !important;
          margin-top: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        .ProseMirror h2 {
          color: #0A3D62 !important;
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin-top: 1.2rem !important;
          margin-bottom: 0.8rem !important;
        }
        .ProseMirror h3 {
          color: #0A3D62 !important;
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin-top: 1rem !important;
          margin-bottom: 0.6rem !important;
        }
        .ProseMirror ul, .ProseMirror ol {
          color: #1a1a1a !important;
          padding-left: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        .ProseMirror li {
          color: #1a1a1a !important;
          margin-bottom: 0.25rem !important;
        }
        .ProseMirror a {
          color: #FFC300 !important;
          text-decoration: underline !important;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #FFC300 !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          color: #4a4a4a !important;
          font-style: italic !important;
        }
        .ProseMirror code {
          background-color: #f5f5f5 !important;
          padding: 0.2rem 0.4rem !important;
          border-radius: 4px !important;
          font-family: monospace !important;
          color: #d63384 !important;
        }
        .ProseMirror pre {
          background-color: #1e1e1e !important;
          color: #d4d4d4 !important;
          padding: 1rem !important;
          border-radius: 8px !important;
          overflow-x: auto !important;
          margin-bottom: 1rem !important;
        }
        .ProseMirror pre code {
          background: none !important;
          color: inherit !important;
          padding: 0 !important;
        }
        .ProseMirror-placeholder {
          color: #adb5bd !important;
        }
      `}</style>
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}