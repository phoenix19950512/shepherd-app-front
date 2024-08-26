import { useState } from 'react';
import Sidebar from '../sidebar';
import OcclusionWorkSpace from '../occlusion-workspace';
import { cn } from '../../../../../../../../../../../../library/utils';

function InteractionWindow({
  imageURI,
  elements,
  setElements,
  removeElement
}: {
  imageURI: string;
  elements: any[];
  setElements: (elements: any[]) => void;
  removeElement: (index: number) => void;
}) {
  const [mode, setMode] = useState<'draggable' | 'resizable' | 'preview'>(
    'draggable'
  );

  const addItem = () => {
    setElements([
      ...elements,
      {
        order: elements.length,
        label: 'Label Placeholder',
        isRevealed: false,
        position: { x: 0, y: 42, width: 40, height: 40 }
      }
    ]);
  };

  return (
    <div className="w-full flex-1 relative flex justify-center items-center shrink-0 overflow-hidden">
      <div className={cn('sidebar absolute left-0 h-full flex items-center')}>
        <Sidebar mode={mode} setMode={setMode} addItem={addItem} />
      </div>
      <OcclusionWorkSpace
        imageURI={imageURI}
        items={elements}
        mode={mode}
        setItems={setElements}
        removeItem={removeElement}
        setMode={setMode}
      />
    </div>
  );
}

export default InteractionWindow;
