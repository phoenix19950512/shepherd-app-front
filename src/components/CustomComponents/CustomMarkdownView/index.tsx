import React, { useEffect, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import './index.css';
import 'katex/dist/katex.min.css';
import { MemoizedReactMarkdown } from './memoized-react-markdown';
import { CodeBlock } from './code-block';

interface CustomComponents {
  button: any;
  p?: any;
  code?: any;
  ul?: any;
  ol?: any;
  math?: any;
  inlineMath?: any;
  blockMath?: any;
}

interface ICustomMarkdownView {
  source: string;
  showDot?: boolean;
  keywords?: string[];
  handleSendKeyword?: any;
  handleSendMessage?: any;
  className?: string;
}

const CustomMarkdownView = ({
  source,
  keywords = [],
  showDot,
  handleSendKeyword,
  className
}: ICustomMarkdownView) => {
  const [renderedSource, setRenderedSource] = useState<string>('');

  useEffect(() => {
    setRenderedSource(replaceKeywordsWithButtons(source, keywords));
  }, [source, keywords]);

  const onKeywordClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    keyword: string
  ) => {
    if (handleSendKeyword) {
      handleSendKeyword(event, keyword);
    }
  };

  return (
    <MemoizedReactMarkdown
      className={`memoized-react-markdown prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 rounded-xl px-3 py-2 transition-all max-w-[75ch] place-self-start shadow-sm ${className} relative overflow-wrap: break-word align-middle`}
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeMathjax]}
      components={getComponents(onKeywordClick)}
    >
      {replaceLatexDelimiters(source, showDot)}
    </MemoizedReactMarkdown>
  );
};

function replaceKeywordsWithButtons(
  source: string,
  keywords: string[]
): string {
  return keywords.reduce((modifiedSource, keyword, index) => {
    const keywordButton = `<button class="clickable-keyword" data-keyword="${keyword}" data-index="${index}">${keyword}</button>`;
    return modifiedSource.replace(new RegExp(keyword, 'g'), keywordButton);
  }, source);
}

function replaceLatexDelimiters(source: string, showDot = false): string {
  const latexRemoved = source
    .replaceAll('\\[', '$')
    .replaceAll('\\]', '$')
    .replaceAll('\\(', '$')
    .replaceAll('\\)', '$');

  return showDot ? `${latexRemoved} ⚫` : latexRemoved;
}

function getComponents(onKeywordClick: any): CustomComponents {
  return {
    button: (props: any) => (
      <button {...props} onClick={(e) => onKeywordClick(e, props.children)} />
    ),
    code: CodeBlockComponent,
    ul: ListComponent,
    ol: OrderedListComponent,
    p: ParagraphComponent,
    math: MathComponent,
    inlineMath: InlineMathComponent,
    blockMath: BlockMathComponent
  };
}

const CodeBlockComponent = ({
  node,
  inline,
  className,
  children,
  ...props
}) => {
  if (children?.length && children[0] == '▍') {
    return <span className="mt-1 cursor-default animate-pulse">▍</span>;
  }

  const match = /language-(\w+)/.exec(className || '');

  return inline ? (
    <code className={className} {...props}>
      {children}
    </code>
  ) : (
    <CodeBlock
      key={Math.random()}
      language={(match && match[1]) || ''}
      value={String(children).replace(/\n$/, '')}
      {...props}
    />
  );
};

const ListComponent = ({ children }) => (
  <ul className="list-disc my-6 ml-6 [&>li]:mt-2 list-outside [&_svg]:inline-block">
    {children}
  </ul>
);

const OrderedListComponent = ({ children }) => (
  <ol className="list-decimal my-6 ml-6 [&>li]:mt-2 list-outside [&_svg]:inline-block">
    {children}
  </ol>
);

const ParagraphComponent = ({ children }) => (
  <p className="leading-7 [&:not(:first-child)]:mt-6 whitespace-pre-wrap overflow-wrap: break-word [&_svg]:inline-block">
    {children}
  </p>
);

const MathComponent = ({ value }: any) => <InlineMath math={value} />;

const InlineMathComponent = ({ value }: any) => <InlineMath math={value} />;

const BlockMathComponent = ({ value }: any) => <BlockMath math={value} />;

export default CustomMarkdownView;
