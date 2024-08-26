import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { ConversationHistory } from '../../../../../../types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../../../components/ui/select';

function SearchBar({
  conversations,
  handleSubjectFilter,
  handleKeywordFilter
}: {
  conversations: ConversationHistory[];
  handleSubjectFilter: (e: string) => void;
  handleKeywordFilter: (e: string) => void;
}) {
  const uniqueSubjects = [
    ...new Set(
      conversations
        ?.filter((item) => Boolean(item.subject))
        .map((item) => item.subject || null)
    )
  ];
  return (
    <div className="w-full h-[30px] flex gap-2 my-4 items-center">
      <div>
        <InputGroup className="max-h-[30px] overflow-hidden flex items-center">
          <InputLeftElement pointerEvents="none" className="max-h-[30px] ">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            rounded="full"
            className="max-h-[30px]"
            onChange={(e) => handleKeywordFilter(e.target.value)}
          />
        </InputGroup>
      </div>
      <div>
        <Select
          // className="p-0 max-w-20 max-h-[30px]"
          // size={'sm'}
          // rounded={'full'}
          onValueChange={(value) => {
            if (value === 'all') {
              handleSubjectFilter('');
            } else {
              handleSubjectFilter(value);
            }
          }}
          defaultValue="all"
        >
          <SelectTrigger className="w-20 max-h-[30px] rounded-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              {uniqueSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
          {/* <option value="">All</option>
          {uniqueSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))} */}
        </Select>
      </div>
    </div>
  );
}

export default SearchBar;
