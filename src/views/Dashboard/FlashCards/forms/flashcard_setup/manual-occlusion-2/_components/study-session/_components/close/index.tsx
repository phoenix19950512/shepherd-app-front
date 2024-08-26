import { DotsHorizontal } from '../../../../../../../../../../components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../../../../../../../components/ui/dropdown-menu';

const CloseButton = ({ setOpenResults, setQuizOver, resetForm, close }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer py-2">
            <DotsHorizontal />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-stone-200"
              onClick={() => {
                close();
                setOpenResults(false);
                resetForm && resetForm();
                setTimeout(() => {
                  setQuizOver(false);
                }, 100);
              }}
            >
              Close
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CloseButton;
