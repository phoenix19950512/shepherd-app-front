import React, { useState } from 'react';
import Chip from '../chip';
import Button from './_components/button';
import { PencilIcon } from '../../../../../../../../../../components/icons';
import useResourceStore from '../../../../../../../../../../state/resourceStore';
import { languages } from '../../../../../../../../../../helpers';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadSelect
} from '../../../../../../../../../../components/ui/select';
import { Button as ShadCnButton } from '../../../../../../../../../../components/ui/button';
import { cn } from '../../../../../../../../../../library/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../../../../../../../components/ui/popover';
import { Input as ShadCnInput } from '../../../../../../../../../../components/ui/input';
import { ChevronDown } from 'lucide-react';

const mathTopics = [
  { id: 'algebra', label: 'Algebra' },
  { id: 'arithmetic', label: 'Arithmetic' },
  { id: 'calculus', label: 'Calculus' },
  { id: 'complex_numbers', label: 'Complex Numbers' },
  { id: 'derivatives', label: 'Derivatives' },
  { id: 'differential_equations', label: 'Differential Equations' },
  { id: 'fourier_transforms', label: 'Fourier Transforms' },
  { id: 'function_optimization', label: 'Function Optimization' },
  { id: 'integrals', label: 'Integrals' },
  { id: 'laplace_transforms', label: 'Laplace Transforms' },
  { id: 'limits', label: 'Limits' },
  { id: 'linear_algebra', label: 'Linear Algebra' },
  { id: 'matrices', label: 'Matrices' },
  { id: 'number_theory', label: 'Number Theory' },
  { id: 'partial_fractions', label: 'Partial Fractions' },
  { id: 'series', label: 'Series' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'trigonometry', label: 'Trigonometry' },
  { id: 'vector_calculus', label: 'Vector Calculus' }
];

const inputTypes = ['subject', 'topic', 'level', 'language'] as const;
type InputType = (typeof inputTypes)[number];
type Language = (typeof languages)[number];

function Input({
  actions: {
    handleSubjectChange,
    handleTopicChange,
    handleLanguageChange,
    handleLevelChange,
    onSubmit,
    handleTopicSecondaryChange
  },
  state: { chatContext }
}: {
  actions: {
    handleSubjectChange: (subject: string) => void;
    handleTopicChange: (topic: string) => void;
    handleLanguageChange: (language: any) => void;
    handleLevelChange: (level: string) => void;
    onSubmit: () => void;
    handleTopicSecondaryChange: (topicSecondary: string) => void;
  };
  state: {
    chatContext: {
      subject: string;
      topic: string;
      level: string;
      language: string;
      topicSecondary?: string;
    };
  };
}) {
  const { courses: courseList, levels } = useResourceStore();
  const [currentInputType, setCurrentInputType] = useState<
    'subject' | 'topic' | 'level' | 'language'
  >('subject');
  const [isSelectingLanguage, setIsSelectingLanguage] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState({
    keyword: '',
    active: false
  });
  const [selectedMathsTopic, setSelectedMathsTopic] = useState('');
  const [wordProblemValue, setWordProblemValue] = useState('');
  const [explainConceptValue, setExplainConceptValue] = useState('');

  const isSubjectMath = chatContext.subject === 'Math';

  function handleInputTypeChange(type: InputType) {
    setFilterKeyword({
      keyword: '',
      active: type === 'level' || type === 'language'
    });
    setCurrentInputType(type);
  }

  const handleSubmit = () => {
    if (chatContext.subject?.trim()) {
      setFilterKeyword({
        keyword: '',
        active: false
      });
      onSubmit();
    }
  };

  const handleButtonClick = () => {
    if (currentInputType === 'subject') {
      if (chatContext.subject === '') return;
      setFilterKeyword({
        active: true,
        keyword: ''
      });
      handleInputTypeChange('level');
    } else if (currentInputType === 'level') {
      if (chatContext.level === '') return;
      handleInputTypeChange('topic');
    } else if (currentInputType === 'topic') {
      if (chatContext.subject !== 'Math') {
        if (chatContext.topic === '') return;
      }

      handleInputTypeChange('language');
    } else {
      if (chatContext.language === '' || chatContext.subject === '') return;
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <React.Fragment>
      <div
        className={`w-full h-[50px] text-black rounded-lg  flex gap-2 items-center pr-3 relative bg-white shadow-md
        `}
      >
        {chatContext.subject === 'Math' && (
          <span className="block absolute uppercase text-[0.87rem] font-semibold text-[#6E7682] top-[-1.5rem]">
            SOLVE
          </span>
        )}
        <div
          className={cn(
            'flex flex-col md:flex-row md:gap-1 absolute top-[-4.5rem] md:top-[-3.0rem] ml-[1rem]',
            {
              'md:top-[-1.5rem]': chatContext.subject !== 'Math'
            }
          )}
        >
          {chatContext.subject?.trim() !== '' &&
          (currentInputType === 'level' ||
            currentInputType === 'topic' ||
            currentInputType === 'language') ? (
            <span className="text-xs flex ">
              Subject -
              <span
                className="ml-1 inline-flex text-[#207DF7] gap-1 items-center cursor-pointer"
                onClick={() => {
                  setCurrentInputType('subject');
                  setIsSelectingLanguage(false);
                }}
              >
                {' '}
                {chatContext.subject}{' '}
                {<PencilIcon className="w-4 h-4" onClick={''} />}
              </span>
            </span>
          ) : null}
          {chatContext.subject?.trim() !== '' && chatContext.level !== '' ? (
            <span className="text-xs flex ">
              Level -
              <span
                className="ml-1 inline-flex text-[#207DF7] gap-1 items-center cursor-pointer"
                onClick={() => {
                  setCurrentInputType('level');
                  setIsSelectingLanguage(false);
                }}
              >
                {' '}
                {chatContext.level}{' '}
                {<PencilIcon className="w-4 h-4" onClick={''} />}
              </span>
            </span>
          ) : null}
          {chatContext.subject?.trim() !== '' &&
            chatContext.level?.trim() !== '' &&
            currentInputType === 'language' && (
              <span className="text-xs flex ">
                Topic -
                <span
                  className="ml-1 inline-flex text-[#207DF7] gap-1 items-center cursor-pointer"
                  onClick={() => {
                    setCurrentInputType('topic');
                    setIsSelectingLanguage(false);
                  }}
                >
                  {chatContext.subject === 'Math'
                    ? chatContext.topic?.trim() === ''
                      ? chatContext.topicSecondary
                      : chatContext.topic
                    : chatContext.topic}{' '}
                  {<PencilIcon className="w-4 h-4" onClick={''} />}
                </span>
              </span>
            )}
        </div>
        <>
          {currentInputType === 'topic' && chatContext.subject === 'Math' && (
            <AutoCompleteDropdown
              chatContext={chatContext}
              currentInputType={currentInputType}
              handleTopicChange={handleTopicChange}
              selectedMathsTopic={selectedMathsTopic}
              setSelectedMathsTopic={setSelectedMathsTopic}
              wordProblemValue={wordProblemValue}
              explainConceptValue={explainConceptValue}
            />
          )}
          <input
            value={(() => {
              if (currentInputType === 'subject') {
                return chatContext.subject;
              } else if (currentInputType === 'level') {
                return chatContext.level;
              } else if (currentInputType === 'language') {
                return chatContext.language;
              } else if (currentInputType === 'topic') {
                console.log('topic', chatContext.topic);
                return chatContext.topic;
              }
            })()}
            onChange={(e) => {
              if (currentInputType === 'subject') {
                handleSubjectChange(e.target.value);
                setFilterKeyword((p) => ({ ...p, keyword: e.target.value }));
                if (chatContext.subject !== e.target.value) {
                  if (chatContext.subject === 'Math') {
                    setSelectedMathsTopic('');
                  }
                  handleTopicChange('');
                }
              } else if (currentInputType === 'level') {
                handleLevelChange(e.target.value);
                setFilterKeyword((p) => ({
                  ...p,
                  keyword: e.target.value
                }));
              } else if (currentInputType === 'language') {
                handleLanguageChange(e.target.value);
                setFilterKeyword((p) => ({ ...p, keyword: e.target.value }));
              } else if (currentInputType === 'topic') {
                console.log('prefix', e.target.value);
                if (
                  chatContext.subject === 'Math' &&
                  selectedMathsTopic !== ''
                ) {
                  const prefix = `${selectedMathsTopic} `;
                  if (!e.target.value.startsWith(prefix)) {
                    console.log('e.target.value', e.target.value);
                    // Remove the prefix if it exists
                    if (e.target.value.startsWith(prefix)) {
                      handleTopicChange(e.target.value.slice(prefix.length));
                    }
                  } else {
                    handleTopicChange(e.target.value);
                  }
                } else {
                  handleTopicChange(e.target.value);
                  setFilterKeyword((p) => ({ active: true, keyword: '' }));
                }
              }
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              'input flex-1 border-none bg-transparent outline-none active:outline-none active:ring-0 border-transparent focus:border-transparent focus:ring-0 placeholder:text-[#CDD1D5] placeholder:text-sm placeholder:font-normal text-[#6E7682] font-normal text-sm min-w-0 transition-opacity',
              {
                'pointer-events-none':
                  currentInputType === 'topic' &&
                  chatContext.subject === 'Math' &&
                  (selectedMathsTopic === '' ||
                    wordProblemValue?.trim().length > 0 ||
                    explainConceptValue?.trim().length > 0)
              },
              {
                'pointer-events-none opacity-50':
                  (wordProblemValue?.trim() || explainConceptValue?.trim()) &&
                  chatContext.subject === 'Math' &&
                  currentInputType === 'topic'
              },
              {
                'pointer-events-none capitalize':
                  currentInputType === 'topic' &&
                  chatContext.subject === 'Math' &&
                  chatContext.topic?.trim() !== ''
              }
            )}
            placeholder={
              currentInputType === 'subject'
                ? 'What subject would you like to start with?'
                : currentInputType === 'level'
                ? 'Level'
                : currentInputType === 'topic'
                ? chatContext.subject === 'Math'
                  ? '<- Select a topic from drop down'
                  : 'What topic would you like to learn about?'
                : 'Select Language'
            }
          />
          <Button
            disabled={
              (currentInputType === 'subject' &&
                (chatContext.subject?.trim() === '' ||
                  !courseList.some(
                    (list) => list.label === chatContext.subject?.trim()
                  ))) ||
              (currentInputType === 'level' &&
                (chatContext.level?.trim() === '' ||
                  !levels.some(
                    (list) => list.label === chatContext.level?.trim()
                  ))) ||
              (currentInputType === 'language' &&
                chatContext.language.length === 0) ||
              (currentInputType === 'topic' &&
                chatContext.topic?.trim() === '' &&
                chatContext.topicSecondary?.trim() === '')
            }
            onClick={() => {
              handleButtonClick();
              setTimeout(() => {
                if (
                  currentInputType === 'subject' ||
                  currentInputType === 'level' ||
                  currentInputType === 'topic'
                ) {
                  setFilterKeyword({
                    keyword: '',
                    active: true
                  });
                } else {
                  setFilterKeyword({
                    keyword: '',
                    active: false
                  });
                }
              }, 200);
            }}
            title={
              currentInputType === 'subject'
                ? 'Select Level'
                : currentInputType === 'level'
                ? 'Enter Topic'
                : currentInputType === 'topic'
                ? 'Select Language'
                : 'Submit'
            }
          />
          {/* {console.log('courseList', courseList)} */}
          <AutocompleteWindow
            setActive={() => {
              setFilterKeyword({
                keyword: '',
                active: false
              });
            }}
            currentInputType={currentInputType}
            active={
              filterKeyword.keyword?.trim() !== '' || filterKeyword.active
            }
            filterKeyword={filterKeyword}
            onClick={(value) => {
              if (currentInputType === 'subject') {
                handleSubjectChange(value);
                handleTopicChange('');
              } else if (currentInputType === 'level') handleLevelChange(value);
              else if (currentInputType === 'topic') handleTopicChange(value);
              else if (currentInputType === 'language')
                handleLanguageChange(value);
            }}
            courseList={courseList}
            levels={levels}
            languages={languages}
          />
        </>

        {/* <div className="flex-1 mt-20">
            
            <button
              className={`bg-[#207DF7] text-white rounded-md w-full p-2  ${
                currentInputType === 'subject' &&
                chatContext.subject?.trim() === ''
                  ? 'cursor-not-allowed grayscale'
                  : 'cursor-pointer'
              }`}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div> */}
      </div>

      <div
        className={`flex gap-1 md:gap-4 mt-4 flex-wrap ${
          currentInputType !== 'subject' && chatContext.subject?.trim() !== ''
            ? ' transition-opacity opacity-0 pointer-events-none'
            : ''
        }`}
      >
        {['Math', 'Physics', 'Chemistry', 'Computer Science'].map((subject) => (
          <Chip
            key={subject}
            title={subject}
            onClick={() => handleSubjectChange(subject)}
          />
        ))}
      </div>
      {chatContext.subject === 'Math' && currentInputType === 'topic' && (
        <div className="w-full absolute bg-[#F9F9FB] h-56 z-10 rounded flex flex-col gap-[2.25rem]">
          <SecondaryInput
            label="Word problem"
            value={wordProblemValue}
            onChange={(value) => {
              handleTopicSecondaryChange(value);
              setWordProblemValue(value);
              handleTopicChange('');
              setSelectedMathsTopic('');
            }}
            active={explainConceptValue?.trim().length === 0}
          />
          <SecondaryInput
            label="Explain a concept"
            value={explainConceptValue}
            onChange={(value) => {
              handleTopicSecondaryChange(value);
              setExplainConceptValue(value);
              handleTopicChange('');
              setSelectedMathsTopic('');
            }}
            active={wordProblemValue?.trim().length === 0}
          />
        </div>
      )}
    </React.Fragment>
  );
}

const SecondaryInput = ({
  label,
  value,
  onChange,
  active
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  active: boolean;
}) => {
  console.log('SecondaryInput', label, active);
  return (
    <div
      className={cn(
        'w-full h-[4.8rem] flex flex-col justify-between transition-opacity',
        {
          'opacity-50 pointer-events-none': !active
        }
      )}
    >
      <span className="block uppercase text-[0.87rem] font-semibold text-[#6E7682]">
        {label}
      </span>
      <input
        disabled={!active}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        className="h-[3.12rem] w-full border-none outline-none rounded-lg pr-3 relative bg-white shadow-md text-[#6E7682] font-normal text-sm"
      />
    </div>
  );
};

const AutocompleteWindow = ({
  active,
  filterKeyword = {
    keyword: '',
    active: false
  },
  currentInputType,
  onClick,
  courseList,
  levels,
  languages,
  setActive
}: any) => {
  if (!active || currentInputType === 'topic') return null;

  return (
    <div className="w-full p-2 absolute top-[90%] bg-white rounded-lg rounded-t-none shadow-md z-10 max-h-[20rem] overflow-y-scroll py-2 no-scrollbar">
      {currentInputType === 'subject' &&
        courseList
          ?.filter(
            (item, index, self) =>
              self.findIndex(
                (t) => t.label.toLowerCase() === item.label.toLowerCase()
              ) === index &&
              item.label
                .toLowerCase()
                .includes(filterKeyword.keyword.toLowerCase())
          )
          .map((item) => (
            <AutocompleteItem
              key={item.label} // Assuming item.label is unique, otherwise provide a unique key
              title={item.label}
              onClick={() => {
                onClick(item.label);
                setActive(false);
              }}
            />
          ))}

      {currentInputType === 'level'
        ? levels
            ?.filter(
              (item) =>
                item.label
                  .toLowerCase()
                  .includes(filterKeyword.keyword.toLowerCase()) &&
                item.label !== 'all'
            )
            .sort((a, b) => a.level - b.level) // Sort by item.level in ascending order
            .map((item) => (
              <AutocompleteItem
                title={item.label}
                onClick={() => {
                  onClick(item.label);
                  setActive(false);
                }}
              />
            ))
        : null}
      {currentInputType === 'language'
        ? languages
            ?.filter((item) =>
              item.toLowerCase().includes(filterKeyword.keyword.toLowerCase())
            )
            .map((lang: Language) => (
              <AutocompleteItem
                key={lang}
                title={lang}
                onClick={() => {
                  onClick(lang);
                  setActive(false);
                }}
              />
            ))
        : null}
    </div>
  );
};

const AutocompleteItem = ({
  title,
  onClick
}: {
  title: string;
  onClick: () => void;
}) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className="p-2 hover:bg-[#F9F9FB] border-l-4 border-transparent hover:border-l-4 hover:border-l-[#207DF7] cursor-pointer"
    >
      <p className="text-[#6E7682] text-sm font-medium">{title}</p>
    </div>
  );
};

const AutoCompleteDropdown = ({
  selectedMathsTopic,
  setSelectedMathsTopic,
  handleTopicChange,
  currentInputType,
  chatContext,
  wordProblemValue,
  explainConceptValue
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const getMathTopicLabel = (topicId, mathTopics) => {
    const topic = mathTopics.find((t) => {
      const stringId = String(t.id).trim();
      const stringTopicId = String(topicId).trim();
      return stringId === stringTopicId;
    });
    return topic ? topic.label : '';
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        disabled={wordProblemValue?.trim() || explainConceptValue?.trim()}
      >
        <ShadCnButton
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="'w-fit h-full max-w-[8rem] md:max-w-none bg-[#F9F9F9] text-[0.87rem] text-[#6E7682] px-[1.25rem] [&_svg]:ml-2 rounded-tr-none rounded-br-none transition-opacity',"
        >
          {chatContext.topic
            ? getMathTopicLabel(chatContext.topic, mathTopics)
            : 'Topic'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </ShadCnButton>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white">
        <div className="w-full h-full p-1 flex flex-col gap-1">
          <ShadCnInput
            placeholder="Search topics"
            className="active:ring-0"
            defaultValue={value}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <div className="w-full mt-1 max-h-60 overflow-scroll">
            {mathTopics
              .filter((topic) =>
                topic.label.toLowerCase().includes(value.toLowerCase())
              )
              .map((topic) => {
                return (
                  <div
                    role="button"
                    key={topic.id}
                    className="px-2 py-1 hover:bg-gray-200 flex justify-start items-center cursor-pointer rounded"
                    onClick={() => {
                      setSelectedMathsTopic(topic.id);
                      handleTopicChange(`${topic.id} `);
                      setOpen(false);
                      setValue('');
                    }}
                  >
                    <span className="text-xs ">{topic.label}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
  // return (
  //   <ShadSelect
  //     value={selectedMathsTopic}
  //     onValueChange={(value) => {
  //       if (currentInputType === 'topic' && chatContext.subject === 'Math') {
  //         if (value !== null) {
  //           handleTopicChange(`${value} `);
  //         } else {
  //           handleTopicChange('');
  //         }
  //       }
  //       setSelectedMathsTopic(value);
  //     }}
  //   >
  //     <SelectTrigger
  //       className={cn(
  //         'w-fit h-full max-w-[8rem] md:max-w-none bg-[#F9F9F9] text-[0.87rem] text-[#6E7682] px-[1.25rem] [&_svg]:ml-2 rounded-tr-none rounded-br-none transition-opacity',
  //         {
  //           'pointer-events-none opacity-50':
  //             wordProblemValue?.trim() || explainConceptValue?.trim()
  //         }
  //       )}
  //     >
  //       <SelectValue placeholder="Topic" className="mr-2" />
  //     </SelectTrigger>
  //     <SelectContent className="bg-white">
  //       {/* <SelectItem value={null}>None</SelectItem> */}
  //       {mathTopics.map((topic) => {
  //         return (
  //           <SelectItem key={topic.id} value={topic.id}>
  //             {topic.label}
  //           </SelectItem>
  //         );
  //       })}
  //     </SelectContent>
  //   </ShadSelect>
  // );
};

export default Input;
