import { useEffect, useRef } from 'react';
import { useEditor } from '../editor/context';
import { AIStarIcon, AffineSlashMenuWidget } from '@blocksuite/blocks';

const EditorContainer = ({ setState, state, askAI, setPosition, setModel }) => {
  const { editor } = useEditor()!;

  const widget = new AffineSlashMenuWidget();

  if (widget.options.menus[0].name != 'AI') {
    widget.options.menus = [
      {
        name: 'AI',
        items: [
          {
            name: 'Ask AI',
            icon: AIStarIcon,
            action: ({ rootElement, model }) => {
              setModel({
                id: model.id,
                doc: model.doc
              });
              setPosition(askAI(rootElement));
              setState('input');
            }
          }
        ]
      },
      ...widget.options.menus
    ];
  }

  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorContainerRef.current && editor && state == 'init') {
      editorContainerRef.current.innerHTML = '';
      editorContainerRef.current.appendChild(editor);
    }
  }, [editor]);

  return <div className="editor-container" ref={editorContainerRef}></div>;
};

export default EditorContainer;
