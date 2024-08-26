import React from 'react';
import {
  BoxModelIcon,
  CropIcon,
  DragHandleDots2Icon,
  PlayIcon,
  StopIcon,
  TextIcon as Text
} from '@radix-ui/react-icons';
import { cn } from '../../../../../../../../../../../../library/utils';
import { IconProps } from '@radix-ui/react-icons/dist/types';

function Sidebar({
  mode,
  setMode,
  addItem
}: {
  mode: 'draggable' | 'resizable' | 'text' | 'preview';
  setMode: (mode: 'draggable' | 'resizable' | 'preview') => void;
  addItem: () => void;
}) {
  return (
    <div
      className={cn('sidebar max-w-[53px] transition-transform duration-500', {
        'translate-y-[-11.75rem]': mode === 'preview'
      })}
    >
      <div className="shadow-lg flex flex-col gap-4 p-2 rounded-md transition-all items-center">
        {mode === 'preview' ? (
          <TextIcon
            icon={<StopIcon className="w-8 h-8 text-[#444444]" />}
            label="Stop"
            onClick={() => setMode('draggable')}
          />
        ) : (
          <>
            <TextIcon
              icon={<CropIcon className="w-8 h-8 text-[#444444]" />}
              label="Resize"
              onClick={() => setMode('resizable')}
              active={mode === 'resizable'}
            />
            <TextIcon
              label="Add"
              icon={<BoxModelIcon className="w-8 h-8 text-[#444444]" />}
              onClick={() => {
                addItem();
                setMode('draggable');
              }}
            />

            <TextIcon
              label="Drag"
              icon={<DragHandleDots2Icon className="w-8 h-8 text-[#444444]" />}
              onClick={() => {
                setMode('draggable');
              }}
              active={mode === 'draggable'}
            />
            <TextIcon
              label="Text"
              icon={<Text className="w-8 h-8 text-[#444444]" />}
              active={mode === 'text'}
            />

            <TextIcon
              label="Preview"
              icon={<PlayIcon className="w-8 h-8 text-[#444444]" />}
              onClick={() => setMode('preview')}
            />
          </>
        )}
      </div>
    </div>
  );
}
const TextIcon = ({
  label,
  icon,
  onClick,
  active
}: {
  label: string;
  icon: IconProps;
  onClick?: () => void;
  active?: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-md gap-2 items-center justify-center cursor-pointer transition-all duration-400',
        {
          'border py-2 ': active
        }
      )}
      onClick={onClick}
    >
      <div className="icon">
        <>{icon}</>
      </div>
      <span className="text-[#212224] text-[10px] font-normal">{label}</span>
    </div>
  );
};

export default Sidebar;
