import React, { Component, createRef, RefObject, MutableRefObject } from 'react';
import { AIStarIcon, ArrowUpBigIcon, CrossIcon } from '@blocksuite/blocks';
import { fetchResponseFromOpenAI } from './openai';

interface AIInputComponentProps {
  setState: (state: string) => void;
  history: any;
  setAIResult: (result: string) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  abortControllerRef: MutableRefObject<AbortController | null>;
}

class AIInputComponent extends Component<AIInputComponentProps> {
  private textareaRef: RefObject<HTMLTextAreaElement>;

  constructor(props: AIInputComponentProps) {
    super(props);
    this.textareaRef = createRef();
  }

  componentDidMount() {
    if (this.textareaRef.current) {
      setTimeout(() => {
        this.textareaRef.current.focus();
        this.textareaRef.current.onkeydown = (e) => {
          if (e.code == 'Escape') {
            this.props.setPrompt('');
            this.props.setState('hidden');
          }
        }
      }, 10);
    }
  }

  handleClick = async () => {
    this.props.abortControllerRef.current = new AbortController();
    this.props.setState('generating');
    this.props.setAIResult('');
    await fetchResponseFromOpenAI(
      this.props.prompt,
      this.props.history,
      this.props.abortControllerRef.current.signal,
      this.props.setAIResult
    );
    this.props.setState('result');
  };

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.props.setPrompt(e.target.value);
  };

  handleCloseClick = () => {
    this.props.setState('hidden');
  };

  handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && !e.altKey && !e.metaKey && e.key === 'Enter') {
      this.handleClick();
      e.preventDefault();
    }
  };

  render() {
    return (
      <div className="ai-panel-container" style={{ flexDirection: 'row' }}>
        <div
          className="icon"
          dangerouslySetInnerHTML={{ __html: AIStarIcon.strings[0] }}
        />
        <div className="textarea-container">
          <textarea
            rows={1}
            className="textarea"
            ref={this.textareaRef}
            onChange={this.handleChange}
            onKeyDown={this.handleKeydown}
            defaultValue={this.props.prompt}
            placeholder="Ask AI to edit or generate..."
          />
          <div
            className="arrow"
            onClick={this.handleClick}
            dangerouslySetInnerHTML={{ __html: ArrowUpBigIcon.strings[0] }}
          />
          <div
            className="close"
            onClick={this.handleCloseClick}
            dangerouslySetInnerHTML={{ __html: CrossIcon.strings[0] }}
          />
        </div>
      </div>
    );
  }
}

export default AIInputComponent;
