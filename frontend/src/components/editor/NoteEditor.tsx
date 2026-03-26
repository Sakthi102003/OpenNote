import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/atom-one-dark.css';

import { useRef, useEffect, useCallback, useState } from 'react';
import { 
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, Quote, Link as LinkIcon,  
  Plus, Image as ImageIcon, Youtube as YoutubeIcon, CodeXml, List, ListTodo, X
} from 'lucide-react';

const lowlight = createLowlight(common);

interface NoteEditorProps {
  content: string | null;
  onChange: (content: string) => void;
  editable?: boolean;
}

interface SlashCommand {
  name: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: (editor: any) => void;
}

const slashCommands: SlashCommand[] = [
  {
    name: 'h1',
    label: 'Heading 1',
    description: 'Large heading',
    icon: <Heading1 size={18} />,
    action: (editor) => editor.chain().focus().setHeading({ level: 1 }).run()
  },
  {
    name: 'h2',
    label: 'Heading 2',
    description: 'Medium heading',
    icon: <Heading2 size={18} />,
    action: (editor) => editor.chain().focus().setHeading({ level: 2 }).run()
  },
  {
    name: 'h3',
    label: 'Heading 3',
    description: 'Small heading',
    icon: <Heading3 size={18} />,
    action: (editor) => editor.chain().focus().setHeading({ level: 3 }).run()
  },
  {
    name: 'bullet',
    label: 'Bullet List',
    description: 'Create a bullet list',
    icon: <List size={18} />,
    action: (editor) => editor.chain().focus().toggleBulletList().run()
  },
  {
    name: 'numbered',
    label: 'Numbered List',
    description: 'Create a numbered list',
    icon: <List size={18} />,
    action: (editor) => editor.chain().focus().toggleOrderedList().run()
  },
  {
    name: 'todo',
    label: 'Todo List',
    description: 'Create a todo list',
    icon: <ListTodo size={18} />,
    action: (editor) => editor.chain().focus().toggleTaskList().run()
  },
  {
    name: 'quote',
    label: 'Quote',
    description: 'Create a quote block',
    icon: <Quote size={18} />,
    action: (editor) => editor.chain().focus().toggleBlockquote().run()
  },
  {
    name: 'code',
    label: 'Code Block',
    description: 'Create a code block',
    icon: <CodeXml size={18} />,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run()
  },
];


const NoteEditor = ({ content, onChange, editable = true }: NoteEditorProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commandMenuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
      Youtube.configure({
        controls: false,
      }),
      BubbleMenuExtension,
      FloatingMenuExtension,
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
      handleKeyDown: (view, event) => {
        // Handle slash commands
        if (event.key === '/' && editable) {
          const { from } = view.state.selection;
          const $from = view.state.doc.resolve(from);
          
          // Check if we're at the start of a line
          if ($from.parentOffset === 0 || view.state.doc.textBetween($from.start(), from).endsWith('\n')) {
            event.preventDefault();
            setShowSlashCommands(true);
            setSlashQuery('');
            return true;
          }
        }
        return false;
      }
    },
  });

  useEffect(() => {
    if (editor && content !== null && content !== editor.getHTML()) {
      // Only update if the content is significantly different to avoid cursor jumps
      // A simple check is usually enough for initial load
      // For more robust sync, use a diffing library or just trust the initial load
      if (editor.getText() === '' && content !== '') {
          editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  },[]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('YouTube URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const filteredCommands = slashCommands.filter(cmd =>
    cmd.label.toLowerCase().includes(slashQuery.toLowerCase()) ||
    cmd.name.includes(slashQuery.toLowerCase())
  );

  const executeCommand = useCallback((command: SlashCommand) => {
    if (!editor) return;
    
    // Delete the "/" character
    editor.chain()
      .focus()
      .command(({ commands }) => {
        return commands.deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from });
      })
      .run();
    
    // Execute the command
    command.action(editor);
    setShowSlashCommands(false);
    setSlashQuery('');
  }, [editor]);

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
    <div className="w-full max-w-4xl mx-auto relative">
      {editor && (
        <BubbleMenu 
          editor={editor} 
          shouldShow={({ editor }) => {
            const { selection } = editor.state;
            // @ts-ignore
            if (selection.node && selection.node.type.name === 'image') {
              return false;
            }
            if (editor.isActive('codeBlock')) {
              return false;
            }
            return !selection.empty;
          }}
        >
          <div className="flex items-center gap-1 p-1 bg-white border rounded shadow-lg">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-black' : 'text-gray-500'}`}
              title="Large Heading"
            >
              <Heading1 size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'text-gray-500'}`}
              title="Small Heading"
            >
              <Heading2 size={16} />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200 text-black' : 'text-gray-500'}`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200 text-black' : 'text-gray-500'}`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200 text-black' : 'text-gray-500'}`}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-200 text-black' : 'text-gray-500'}`}
              title="Code"
            >
              <Code size={16} />
            </button>
            <button
              onClick={setLink}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200 text-black' : 'text-gray-500'}`}
              title="Link"
            >
              <LinkIcon size={16} />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200 text-black' : 'text-gray-500'}`}
              title="Quote"
            >
              <Quote size={16} />
            </button>
          </div>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu editor={editor} className="flex items-center gap-1">
          <div className="relative flex items-center">
            <button
              className="p-1 text-gray-400 bg-transparent rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Plus size={20} className={`transform transition-transform ${isMenuOpen ? 'rotate-45' : ''}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute left-8 flex items-center gap-1 p-1 bg-white border rounded shadow-lg animate-in fade-in slide-in-from-left-2 duration-200">
                <button
                  onClick={() => {
                    addImage();
                    setIsMenuOpen(false);
                  }}
                  className="p-1.5 text-gray-500 rounded hover:bg-gray-100 hover:text-black"
                  title="Image"
                >
                  <ImageIcon size={18} />
                </button>
                <button
                  onClick={() => {
                    addYoutube();
                    setIsMenuOpen(false);
                  }}
                  className="p-1.5 text-gray-500 rounded hover:bg-gray-100 hover:text-black"
                  title="Video"
                >
                  <YoutubeIcon size={18} />
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleCodeBlock().run();
                    setIsMenuOpen(false);
                  }}
                  className="p-1.5 text-gray-500 rounded hover:bg-gray-100 hover:text-black"
                  title="Code Block"
                >
                  <CodeXml size={18} />
                </button>
              </div>
            )}
          </div>
        </FloatingMenu>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }}
      />

      {/* Slash Command Menu */}
      {showSlashCommands && (
        <div 
          ref={commandMenuRef}
          className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 max-h-80 overflow-y-auto w-64"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
            <input
              autoFocus
              type="text"
              placeholder="Search commands..."
              value={slashQuery}
              onChange={(e) => setSlashQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowSlashCommands(false);
                  setSlashQuery('');
                  editor?.chain().focus().run();
                }
              }}
              className="flex-1 outline-none text-sm px-2"
            />
            <button
              onClick={() => {
                setShowSlashCommands(false);
                setSlashQuery('');
                editor?.chain().focus().run();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          {filteredCommands.length > 0 ? (
            <div className="space-y-1">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.name}
                  onClick={() => executeCommand(cmd)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-indigo-50 transition-colors text-left text-sm"
                >
                  <div className="text-indigo-600">{cmd.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{cmd.label}</div>
                    <div className="text-xs text-gray-500">{cmd.description}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No commands found
            </div>
          )}
        </div>
      )}

       <EditorContent editor={editor} />
    </div>
  );
};

export default NoteEditor;
