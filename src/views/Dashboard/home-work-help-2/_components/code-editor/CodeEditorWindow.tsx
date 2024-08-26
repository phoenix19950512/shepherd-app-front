import { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from '../../../../../util';
import Output from './Output';
import { Button } from '../../../../../components/ui/button';
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../library/utils';

const CodeEditorWindow = () => {
  const editorRef: MutableRefObject<any | null> = useRef(null);
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [sidebarClosed, setSidebarClosed] = useState(true);

  const onMount = (editor) => {
    editorRef.current = editor;
    // if (!sidebarClosed) {
    //   editor.focus();
    // }
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };
  console.log(sidebarClosed);

  return (
    <div
      className={cn(
        'h-full max-h-screen flex w-[40%] border-r transition-all transform-gpu  mr-[-1px] relative duration-1000 z-20',
        {
          'w-[0%]': sidebarClosed
        }
      )}
    >
      <Button
        className="absolute top-0 p-2 bg-white rounded-r-md left-[-55px] rounded-tr-none rounded-br-none border-l border-b rounded-tl-none"
        onClick={() => {
          setSidebarClosed((prev) => !prev);
        }}
        variant="ghost"
      >
        IDE
        <CaretRightIcon
          className={cn({
            'transition-all': true,
            'transform rotate-180': sidebarClosed
          })}
        />
      </Button>
      {/* {!sidebarClosed && ( */}
      <Box w="full" overflowY={'hidden'}>
        <VStack spacing={4} p={2}>
          <Box w="full">
            <LanguageSelector language={language} onSelect={onSelect} />{' '}
            <Editor
              options={{
                minimap: {
                  enabled: false
                }
              }}
              height="55vh"
              width={'100%'}
              theme={'vs-dark'}
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
          </Box>

          <Output editorRef={editorRef} language={language} />
        </VStack>
      </Box>
      {/* )} */}
    </div>
  );
};
export default CodeEditorWindow;
