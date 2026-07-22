"use client";

import {
  useEffect,
  useRef,
  type ChangeEvent,
  type ReactNode,
} from "react";

import {
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Palette,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Undo2,
  X,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

interface EstadoEditor {
  negrita: boolean;
  cursiva: boolean;
  tachado: boolean;
  parrafo: boolean;
  encabezado2: boolean;
  encabezado3: boolean;
  listaViñetas: boolean;
  listaNumerada: boolean;
  cita: boolean;
  bloqueCodigo: boolean;
  alinearIzquierda: boolean;
  alinearCentro: boolean;
  alinearDerecha: boolean;
  justificar: boolean;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  color: string;
  caracteres: number;
  palabras: number;
}

const ESTADO_INICIAL: EstadoEditor = {
  negrita: false,
  cursiva: false,
  tachado: false,
  parrafo: true,
  encabezado2: false,
  encabezado3: false,
  listaViñetas: false,
  listaNumerada: false,
  cita: false,
  bloqueCodigo: false,
  alinearIzquierda: true,
  alinearCentro: false,
  alinearDerecha: false,
  justificar: false,
  puedeDeshacer: false,
  puedeRehacer: false,
  color: "#1F2937",
  caracteres: 0,
  palabras: 0,
};

const COLORES_PREDEFINIDOS = [
  {
    nombre: "Texto",
    valor: "#1F2937",
  },
  {
    nombre: "Azul institucional",
    valor: "#0A3D62",
  },
  {
    nombre: "Azul oscuro",
    valor: "#061C2E",
  },
  {
    nombre: "Amarillo institucional",
    valor: "#B88600",
  },
  {
    nombre: "Verde",
    valor: "#047857",
  },
  {
    nombre: "Rojo",
    valor: "#B91C1C",
  },
];

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-1",
        active
          ? "border-[#0A3D62] bg-[#0A3D62] text-white shadow-sm"
          : "border-transparent text-gray-600 hover:border-gray-200 hover:bg-white hover:text-[#0A3D62]",
        disabled &&
          "cursor-not-allowed border-transparent bg-transparent text-gray-300 shadow-none hover:border-transparent hover:bg-transparent hover:text-gray-300",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return (
    <span
      className="mx-1 hidden h-6 w-px shrink-0 bg-gray-200 sm:block"
      aria-hidden="true"
    />
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe el contenido aquí...",
  disabled = false,
}: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      TextStyle,

      Color.configure({
        types: ["textStyle"],
      }),

      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
        ],
        alignments: [
          "left",
          "center",
          "right",
          "justify",
        ],
        defaultAlignment: "left",
      }),

      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "is-editor-empty",
      }),
    ],

    content: value || "",

    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[320px] px-4 py-4 text-[15px] leading-7 text-gray-800 focus:outline-none sm:px-5",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label":
          "Editor de contenido enriquecido",
      },
    },

    onUpdate: ({ editor: editorActual }) => {
      const html = editorActual.isEmpty
        ? ""
        : editorActual.getHTML();

      onChangeRef.current(html);
    },
  });

  const estadoEditor =
    useEditorState({
      editor,

      selector: ({
        editor: editorActual,
      }): EstadoEditor => {
        if (!editorActual) {
          return ESTADO_INICIAL;
        }

        const texto =
          editorActual.getText();

        const textoSinEspacios =
          texto.trim();

        const palabras =
          textoSinEspacios.length > 0
            ? textoSinEspacios
                .split(/\s+/)
                .filter(Boolean).length
            : 0;

        const atributosTexto =
          editorActual.getAttributes(
            "textStyle",
          ) as {
            color?: unknown;
          };

        const color =
          typeof atributosTexto.color ===
            "string" &&
          atributosTexto.color
            ? atributosTexto.color
            : "#1F2937";

        return {
          negrita:
            editorActual.isActive(
              "bold",
            ),

          cursiva:
            editorActual.isActive(
              "italic",
            ),

          tachado:
            editorActual.isActive(
              "strike",
            ),

          parrafo:
            editorActual.isActive(
              "paragraph",
            ),

          encabezado2:
            editorActual.isActive(
              "heading",
              {
                level: 2,
              },
            ),

          encabezado3:
            editorActual.isActive(
              "heading",
              {
                level: 3,
              },
            ),

          listaViñetas:
            editorActual.isActive(
              "bulletList",
            ),

          listaNumerada:
            editorActual.isActive(
              "orderedList",
            ),

          cita:
            editorActual.isActive(
              "blockquote",
            ),

          bloqueCodigo:
            editorActual.isActive(
              "codeBlock",
            ),

          alinearIzquierda:
            editorActual.isActive({
              textAlign: "left",
            }),

          alinearCentro:
            editorActual.isActive({
              textAlign: "center",
            }),

          alinearDerecha:
            editorActual.isActive({
              textAlign: "right",
            }),

          justificar:
            editorActual.isActive({
              textAlign: "justify",
            }),

          puedeDeshacer:
            editorActual
              .can()
              .chain()
              .undo()
              .run(),

          puedeRehacer:
            editorActual
              .can()
              .chain()
              .redo()
              .run(),

          color,
          caracteres: texto.length,
          palabras,
        };
      },
    }) ?? ESTADO_INICIAL;

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const valorExterno =
      value || "";

    const contenidoActual =
      editor.isEmpty
        ? ""
        : editor.getHTML();

    if (
      contenidoActual === valorExterno
    ) {
      return;
    }

    editor.commands.setContent(
      valorExterno,
      {
        emitUpdate: false,
      },
    );
  }, [editor, value]);

  const cambiarColor = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!editor || disabled) {
      return;
    }

    editor
      .chain()
      .focus()
      .setColor(event.target.value)
      .run();
  };

  const quitarFormato = () => {
    if (!editor || disabled) {
      return;
    }

    editor
      .chain()
      .focus()
      .unsetAllMarks()
      .clearNodes()
      .setTextAlign("left")
      .run();
  };

  if (!editor) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex min-h-12 items-center gap-2 border-b border-gray-200 bg-[#F8FAFC] px-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
            <Loader2
              size={22}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Cargando editor
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Preparando las herramientas de
              redacción.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const controlesDeshabilitados =
    disabled || !editor.isEditable;

  return (
    <div
      className={cn(
        "cmp-rich-text-editor overflow-hidden rounded-2xl border bg-white transition-shadow",
        disabled
          ? "border-gray-200 bg-gray-50"
          : "border-gray-200 focus-within:border-[#FFC300] focus-within:ring-4 focus-within:ring-[#FFC300]/15",
      )}
      aria-disabled={disabled}
    >
      <div className="border-b border-gray-200 bg-[#F8FAFC]">
        <div className="flex flex-wrap items-center gap-1 px-2 py-2 sm:px-3">
          <ToolbarButton
            label="Texto normal"
            active={
              estadoEditor.parrafo
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .setParagraph()
                .run();
            }}
          >
            <Pilcrow
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Encabezado nivel 2"
            active={
              estadoEditor.encabezado2
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 2,
                })
                .run();
            }}
          >
            <Heading2
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Encabezado nivel 3"
            active={
              estadoEditor.encabezado3
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: 3,
                })
                .run();
            }}
          >
            <Heading3
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            label="Negrita"
            active={
              estadoEditor.negrita
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleBold()
                .run();
            }}
          >
            <Bold
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Cursiva"
            active={
              estadoEditor.cursiva
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleItalic()
                .run();
            }}
          >
            <Italic
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Tachado"
            active={
              estadoEditor.tachado
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleStrike()
                .run();
            }}
          >
            <Strikethrough
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            label="Lista con viñetas"
            active={
              estadoEditor.listaViñetas
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run();
            }}
          >
            <List
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Lista numerada"
            active={
              estadoEditor.listaNumerada
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run();
            }}
          >
            <ListOrdered
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Cita"
            active={estadoEditor.cita}
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleBlockquote()
                .run();
            }}
          >
            <Quote
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Bloque de código"
            active={
              estadoEditor.bloqueCodigo
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleCodeBlock()
                .run();
            }}
          >
            <Code2
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            label="Alinear a la izquierda"
            active={
              estadoEditor.alinearIzquierda
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .setTextAlign("left")
                .run();
            }}
          >
            <AlignLeft
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Centrar"
            active={
              estadoEditor.alinearCentro
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .setTextAlign("center")
                .run();
            }}
          >
            <AlignCenter
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Alinear a la derecha"
            active={
              estadoEditor.alinearDerecha
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .setTextAlign("right")
                .run();
            }}
          >
            <AlignRight
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Justificar"
            active={
              estadoEditor.justificar
            }
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .setTextAlign("justify")
                .run();
            }}
          >
            <AlignJustify
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarSeparator />

          <div className="relative flex h-9 items-center gap-2 rounded-lg border border-transparent px-2 text-gray-600 hover:border-gray-200 hover:bg-white">
            <Palette
              size={17}
              className="shrink-0"
              aria-hidden="true"
            />

            <input
              type="color"
              value={
                /^#[0-9a-fA-F]{6}$/.test(
                  estadoEditor.color,
                )
                  ? estadoEditor.color
                  : "#1F2937"
              }
              onChange={cambiarColor}
              disabled={
                controlesDeshabilitados
              }
              aria-label="Seleccionar color del texto"
              title="Color del texto"
              className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-1">
            {COLORES_PREDEFINIDOS.map(
              (color) => (
                <button
                  key={color.valor}
                  type="button"
                  disabled={
                    controlesDeshabilitados
                  }
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setColor(
                        color.valor,
                      )
                      .run();
                  }}
                  aria-label={`Aplicar color ${color.nombre}`}
                  title={color.nombre}
                  className={cn(
                    "h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] disabled:cursor-not-allowed disabled:opacity-40",
                    estadoEditor.color.toLowerCase() ===
                      color.valor.toLowerCase()
                      ? "border-[#FFC300] shadow-sm"
                      : "border-white shadow",
                  )}
                  style={{
                    backgroundColor:
                      color.valor,
                  }}
                />
              ),
            )}
          </div>

          <ToolbarButton
            label="Quitar color"
            disabled={
              controlesDeshabilitados
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .unsetColor()
                .run();
            }}
          >
            <X
              size={16}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            label="Quitar formato"
            disabled={
              controlesDeshabilitados
            }
            onClick={quitarFormato}
          >
            <RemoveFormatting
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Deshacer"
            disabled={
              controlesDeshabilitados ||
              !estadoEditor.puedeDeshacer
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .undo()
                .run();
            }}
          >
            <Undo2
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>

          <ToolbarButton
            label="Rehacer"
            disabled={
              controlesDeshabilitados ||
              !estadoEditor.puedeRehacer
            }
            onClick={() => {
              editor
                .chain()
                .focus()
                .redo()
                .run();
            }}
          >
            <Redo2
              size={17}
              aria-hidden="true"
            />
          </ToolbarButton>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className={cn(
          "bg-white",
          disabled &&
            "cursor-not-allowed bg-gray-50 opacity-75",
        )}
      />

      <footer className="flex flex-col gap-2 border-t border-gray-100 bg-[#F8FAFC] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-5 text-gray-400">
          Utiliza la barra superior para dar
          estructura y formato al contenido.
        </p>

        <div
          className="flex items-center gap-3 text-[10px] font-bold text-gray-500"
          aria-live="polite"
        >
          <span>
            {estadoEditor.palabras.toLocaleString(
              "es-MX",
            )}{" "}
            {estadoEditor.palabras === 1
              ? "palabra"
              : "palabras"}
          </span>

          <span
            className="h-1 w-1 rounded-full bg-gray-300"
            aria-hidden="true"
          />

          <span>
            {estadoEditor.caracteres.toLocaleString(
              "es-MX",
            )}{" "}
            {estadoEditor.caracteres === 1
              ? "carácter"
              : "caracteres"}
          </span>
        </div>
      </footer>

      <style jsx global>{`
        .cmp-rich-text-editor .tiptap {
          color: #1f2937;
          overflow-wrap: anywhere;
          white-space: normal;
        }

        .cmp-rich-text-editor
          .tiptap
          > *:first-child {
          margin-top: 0;
        }

        .cmp-rich-text-editor
          .tiptap
          > *:last-child {
          margin-bottom: 0;
        }

        .cmp-rich-text-editor .tiptap p {
          margin: 0 0 0.9rem;
          color: #374151;
          line-height: 1.75;
        }

        .cmp-rich-text-editor .tiptap h1,
        .cmp-rich-text-editor .tiptap h2,
        .cmp-rich-text-editor .tiptap h3 {
          color: #0a3d62;
          line-height: 1.25;
          overflow-wrap: anywhere;
        }

        .cmp-rich-text-editor .tiptap h1 {
          margin: 1.5rem 0 0.85rem;
          font-size: 1.75rem;
          font-weight: 800;
        }

        .cmp-rich-text-editor .tiptap h2 {
          margin: 1.35rem 0 0.75rem;
          font-size: 1.45rem;
          font-weight: 800;
        }

        .cmp-rich-text-editor .tiptap h3 {
          margin: 1.2rem 0 0.65rem;
          font-size: 1.2rem;
          font-weight: 750;
        }

        .cmp-rich-text-editor .tiptap strong {
          font-weight: 800;
        }

        .cmp-rich-text-editor .tiptap ul {
          margin: 0.75rem 0 1rem;
          list-style-type: disc;
          padding-left: 1.6rem;
        }

        .cmp-rich-text-editor .tiptap ol {
          margin: 0.75rem 0 1rem;
          list-style-type: decimal;
          padding-left: 1.6rem;
        }

        .cmp-rich-text-editor .tiptap li {
          margin: 0.3rem 0;
          padding-left: 0.2rem;
          color: #374151;
        }

        .cmp-rich-text-editor .tiptap li p {
          margin-bottom: 0.25rem;
        }

        .cmp-rich-text-editor
          .tiptap
          blockquote {
          margin: 1.1rem 0;
          border-left: 4px solid #ffc300;
          border-radius: 0 0.75rem 0.75rem 0;
          background: #fff9e6;
          padding: 0.85rem 1rem;
          color: #4b5563;
          font-style: italic;
        }

        .cmp-rich-text-editor
          .tiptap
          blockquote
          p {
          margin: 0;
        }

        .cmp-rich-text-editor .tiptap code {
          border: 1px solid #e5e7eb;
          border-radius: 0.35rem;
          background: #f3f4f6;
          padding: 0.12rem 0.35rem;
          color: #9f1239;
          font-family:
            ui-monospace, SFMono-Regular, Menlo,
            Monaco, Consolas, monospace;
          font-size: 0.88em;
        }

        .cmp-rich-text-editor .tiptap pre {
          margin: 1rem 0;
          overflow-x: auto;
          border-radius: 0.85rem;
          background: #061c2e;
          padding: 1rem;
          color: #f8fafc;
        }

        .cmp-rich-text-editor
          .tiptap
          pre
          code {
          border: 0;
          background: transparent;
          padding: 0;
          color: inherit;
          font-size: 0.875rem;
        }

        .cmp-rich-text-editor .tiptap hr {
          margin: 1.5rem 0;
          border: 0;
          border-top: 1px solid #d1d5db;
        }

        .cmp-rich-text-editor
          .tiptap
          p.is-editor-empty:first-child::before {
          float: left;
          height: 0;
          color: #9ca3af;
          content: attr(data-placeholder);
          pointer-events: none;
        }

        .cmp-rich-text-editor
          .tiptap[contenteditable="false"] {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}