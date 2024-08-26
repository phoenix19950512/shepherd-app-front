import {
  AIDoneIcon,
  CopyIcon,
  DiscardIcon,
  InsertBelowIcon,
  RefreshIcon,
  WarningIcon
} from '@blocksuite/blocks';
import React, { useState } from 'react';
import { fetchResponseFromOpenAI } from './openai';
import * as Y from 'yjs';
import MathMarkdown from './mathmarkdown';

const AIAnswerComponent = ({
  history,
  setHistory,
  aiResult,
  setState,
  prompt,
  setPrompt,
  setAIResult,
  abortControllerRef,
  model
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(aiResult);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleInsertClick = () => {
    const newHistory = [
      {
        role: 'user',
        content: prompt
      },
      {
        role: 'assistant',
        content: aiResult
      }
    ];
    setHistory([...history, ...newHistory]);
    setPrompt('');
    setState('hidden');
    const yText = new Y.Text(aiResult);
    model.doc.deleteBlock(model.doc.getBlock(model.id));
    model.doc.addBlock(
      'affine:paragraph',
      { text: yText },
      model.doc.getBlocksByFlavour('affine:note')[0].id
    );
  };

  const handleRegenClick = async () => {
    abortControllerRef.current = new AbortController();
    setState('generating');
    setAIResult('');
    await fetchResponseFromOpenAI(
      prompt,
      history,
      abortControllerRef.current.signal,
      setAIResult
    );
    setState('result');
    setTimeout(() => {
      const answerPanel = document.querySelector('.react-markdown-test');
      answerPanel.scrollTop = answerPanel.scrollHeight;
    }, 100);
  };

  const handleDiscardClick = () => {
    setAIResult('');
    setPrompt('');
    setState('hidden');
  };

  return (
    <div className="ai-panel-container">
      <div className="answer">
        <MathMarkdown content={aiResult} />
      </div>
      <div className="finish-tip">
        <span dangerouslySetInnerHTML={{ __html: WarningIcon.strings[0] }} />
        <div className="text">AI outputs can be misleading or wrong</div>
        <div className="right">
          {!copied && (
            <div
              className="copy"
              onClick={handleCopyClick}
              dangerouslySetInnerHTML={{ __html: CopyIcon.strings[0] }}
            />
          )}
          {copied && (
            <div
              className="copied"
              dangerouslySetInnerHTML={{ __html: AIDoneIcon.strings[0] }}
            />
          )}
        </div>
      </div>
      <div className="divider" />
      <div className="response-list-container">
        <div className="group-name">RESPONSE</div>
        <div className="menu-item insert-below" onClick={handleInsertClick}>
          <span
            className="item-icon"
            dangerouslySetInnerHTML={{ __html: InsertBelowIcon.strings[0] }}
          />
          <div className="item-name">Insert below</div>
        </div>
      </div>
      <div className="divider" />
      <div className="response-list-container">
        <div className="menu-item regenerate" onClick={handleRegenClick}>
          <span
            className="item-icon"
            dangerouslySetInnerHTML={{ __html: RefreshIcon.strings[0] }}
          />
          <div className="item-name">Regenerate</div>
        </div>
        <div className="menu-item discard" onClick={handleDiscardClick}>
          <span
            className="item-icon"
            dangerouslySetInnerHTML={{ __html: DiscardIcon.strings[0] }}
          />
          <div className="item-name">Discard</div>
        </div>
      </div>
    </div>
  );
};

export default AIAnswerComponent;
