import { Button } from '../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent
} from '../../../../../../../../components/ui/dialog';

function CardSavedDialog({
  open,
  cancel,
  startStudySession
}: {
  open: boolean;
  cancel: () => void;
  startStudySession: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="bg-white w-[400px] h-[257px] p-0 flex flex-col items-stretch gap-0">
        <header className="flex justify-end w-full py-4 px-4 pb-0">
          <button className="w-[60px] h-[22px] flex items-center justify-center gap-1 rounded-full bg-[#F3F5F6] text-[#969CA6] text-xs">
            <span className="text-[#969CA6] text-xs">Close</span>
            <span className="text-[#969CA6] text-xs"> &times;</span>
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-start h-full">
          <div className="w-[287px] h-[101px] flex flex-col justify-between items-center">
            <div className="logo w-[40px] h-[40px] rounded-full shadow-lg bg-white flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0002 19.1666C4.93755 19.1666 0.833496 15.0625 0.833496 9.99998C0.833496 4.93737 4.93755 0.833313 10.0002 0.833313C15.0627 0.833313 19.1668 4.93737 19.1668 9.99998C19.1668 15.0625 15.0627 19.1666 10.0002 19.1666ZM9.08588 13.6666L15.5677 7.18483L14.2714 5.88847L9.08588 11.0739L6.49319 8.48115L5.19682 9.7776L9.08588 13.6666Z"
                  fill="#4CAF50"
                />
              </svg>
            </div>
            <h4 className="text-[#212224] text-lg font-medium">
              Your flashcard has been saved
            </h4>
            <h5 className="text-[#6E7682] font-normal text-sm">
              Would you like to study now?
            </h5>
          </div>
        </div>
        <footer className="w-full h-[72px] bg-[#F7F7F8] flex justify-end items-center gap-4 px-4">
          <div className="w-[218px] flex justify-between">
            <Button
              className="w-[99px] h-[40px] bg-white text-[#5C5F64] font-medium text-sm"
              onClick={cancel}
            >
              Later
            </Button>
            <Button
              className="w-[99px] h-[40px] font-medium text-sm"
              onClick={startStudySession}
            >
              Study
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

export default CardSavedDialog;
