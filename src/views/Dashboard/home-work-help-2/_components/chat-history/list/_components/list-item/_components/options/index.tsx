import { DotsHorizontal } from '../../../../../../../../../../components/icons';
import {
  Root,
  Trigger,
  Portal,
  Content,
  Item
} from '@radix-ui/react-dropdown-menu';

function Options({
  id,
  actions: { handleRename, handleDelete }
}: {
  id: string;
  actions: {
    handleRename: () => void; // For renaming the conversation
    handleDelete: (id: string) => void; // For deleting the conversation
  };
}) {
  return (
    <Root>
      <Trigger asChild>
        <button
          role="button"
          className=" w-[5%] h-full flex items-center justify-center"
        >
          <DotsHorizontal className="font-bold" />
        </button>
      </Trigger>
      <Portal>
        <Content side="bottom" align="end" className="z-30">
          <div className="min-w-[150px] bg-white rounded-md p-[10px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
            <OptionItem>
              <button
                onClick={() => handleRename()}
                className="font-medium w-full h-full text-start"
              >
                Rename
              </button>
            </OptionItem>
            <OptionItem>
              <button
                // onClick={}
                className="font-medium w-full h-full text-start"
              >
                Share
              </button>
            </OptionItem>
            <OptionItem>
              <button
                onClick={() => handleDelete(id)}
                className="font-medium text-red-500 w-full h-full text-start"
              >
                Delete
              </button>
            </OptionItem>
          </div>
        </Content>
      </Portal>
    </Root>
  );
}

const OptionItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <Item className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[30px] px-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 hover:bg-gray-100 cursor-pointer">
      {children}
    </Item>
  );
};

export default Options;
