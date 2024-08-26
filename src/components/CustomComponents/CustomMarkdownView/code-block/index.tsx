import { FC, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useCopyToClipboard } from '../../../../hooks';
import { CheckIcon, CopyIcon, DownloadIcon } from '@chakra-ui/icons';

interface Props {
  language: string;
  value: string;
}

interface languageMap {
  [key: string]: string | undefined;
}

export const programmingLanguages: languageMap = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css',
  markdown: 'plaintext'

  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
};

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXY3456789'; // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return lowercase ? result.toLowerCase() : result;
};

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const downloadAsFile = () => {
    if (typeof window === 'undefined') {
      return;
    }
    const fileExtension = programmingLanguages[language] || '.file';
    const suggestedFileName = `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`;
    const fileName = window.prompt('Enter file name' || '', suggestedFileName);

    if (!fileName) {
      // User pressed cancel on prompt.
      return;
    }

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(value);
  };

  return (
    <div className="relative w-full font-sans codeblock bg-[#344D6D] rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between w-full px-6 py-2 pr-4 bg-white text-[#cdd1d5]">
        <span className="text-xs lowercase text-[#cdd1d5] font-extrabold">
          {language}
        </span>
        <div className="flex items-center space-x-1 gap-2 justify-center">
          <button
            className="hover:bg-[#344D6D] focus-visible:ring-1 focus-visible:ring-[#344D6D] focus-visible:ring-offset-0 flex justify-center items-center"
            onClick={downloadAsFile}
            type="button"
          >
            <DownloadIcon
              style={{
                width: '1rem',
                height: '1rem'
              }}
            />
          </button>
          <button
            className="text-xs hover:bg-[#344D6D] focus-visible:ring-1 focus-visible:ring-[#344D6D] focus-visible:ring-offset-0"
            onClick={onCopy}
            type="button"
          >
            {isCopied ? (
              <CheckIcon
                style={{
                  width: '1rem',
                  height: '1rem'
                }}
              />
            ) : (
              <CopyIcon
                style={{
                  width: '1rem',
                  height: '1rem'
                }}
              />
            )}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={coldarkDark}
        PreTag="div"
        showLineNumbers
        customStyle={{
          margin: 0,
          width: '100%',
          background: 'transparent',
          padding: '1.5rem 1rem'
        }}
        lineNumberStyle={{
          userSelect: 'none'
        }}
        codeTagProps={{
          style: {
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)'
          }
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});
CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
