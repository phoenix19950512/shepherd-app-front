import { Tag } from '@chakra-ui/tag';

function Chip({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <span
      role="button"
      onClick={onClick}
      className="py-1 px-2 text-[#6E7682] rounded-full border shadow cursor-pointer hover:shadow-sm transition-all hover:bg-[#EBECF0] max-h-[36px] text-sm"
    >
      {title}
    </span>
  );
}

export default Chip;
