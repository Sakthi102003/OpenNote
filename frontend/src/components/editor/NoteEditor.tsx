import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface NoteEditorProps {
  content: string | null;
  onChange: (content: string) => void;
  editable?: boolean;
}

const NoteEditor = ({ content, onChange, editable = true }: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] px-4 py-8',
      },
    },
  });

  // Update content if it changes externally (e.g. loading)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // editor.commands.setContent(content || ''); // This resets cursor, be careful.
      // Ideally only set content on initial load.
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
       <EditorContent editor={editor} />
    </div>
  );
};

export default NoteEditor;
