/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import useModal from '../../hooks/useModal';
import catTypingGif from '../../images/cat-typing.gif';
import { EmbedConfigs } from '../AutoEmbedPlugin';
import { INSERT_COLLAPSIBLE_COMMAND } from '../CollapsiblePlugin';
import { InsertEquationDialog } from '../EquationsPlugin';
import { INSERT_EXCALIDRAW_COMMAND } from '../ExcalidrawPlugin';
import { INSERT_IMAGE_COMMAND, InsertImageDialog } from '../ImagesPlugin';
import { INSERT_PAGE_BREAK } from '../PageBreakPlugin';
import { InsertPollDialog } from '../PollPlugin';
import { InsertNewTableDialog, InsertTableDialog } from '../TablePlugin';
import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from '@lexical/list';
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  TextNode
} from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// icon asssts
import Paragraph from '../../images/icons/text-paragraph.svg?react';
import H1 from '../../images/icons/type-h1.svg?react';
import H2 from '../../images/icons/type-h2.svg?react';
import H3 from '../../images/icons/type-h3.svg?react';
import H4 from '../../images/icons/type-h4.svg?react';
import H5 from '../../images/icons/type-h5.svg?react';
import H6 from '../../images/icons/type-h6.svg?react';
import ListOl from '../../images/icons/list-ol.svg?react';
import ListUl from '../../images/icons/list-ul.svg?react';
import SquareCheck from '../../images/icons/square-check.svg?react';
import ChatSquareQuote from '../../images/icons/chat-square-quote.svg?react';
import Code from '../../images/icons/code.svg?react';
import Undo from '../../images/icons/arrow-counterclockwise.svg?react';
import Redo from '../../images/icons/arrow-clockwise.svg?react';
import FontFamily from '../../images/icons/font-family.svg?react';
import Bold from '../../images/icons/type-bold.svg?react';
import Italic from '../../images/icons/type-italic.svg?react';
import Underline from '../../images/icons/type-underline.svg?react';
import HyLink from '../../images/icons/link.svg?react';
import FontColor from '../../images/icons/font-color.svg?react';
import BgColor from '../../images/icons/bg-color.svg?react';
import DropdownMore from '../../images/icons/dropdown-more.svg?react';
import StrikeThrough from '../../images/icons/type-strikethrough.svg?react';
import Subscript from '../../images/icons/type-subscript.svg?react';
import Superscript from '../../images/icons/type-superscript.svg?react';
import Clear from '../../images/icons/trash.svg?react';
import TableIcon from '../../images/icons/table.svg?react';
import PlusIcon from '../../images/icons/plus.svg?react';
import HorizontalRule from '../../images/icons/horizontal-rule.svg?react';
import Scissors from '../../images/icons/scissors.svg?react';
import FileImage from '../../images/icons/file-image.svg?react';
import Diagram2 from '../../images/icons/diagram-2.svg?react';
import PollIcon from '../../images/icons/card-checklist.svg?react';
import ColumnsIcon from '../../images/icons/3-columns.svg?react';
import PlusSlashMinus from '../../images/icons/plus-slash-minus.svg?react';
import LeftAlign from '../../images/icons/text-left.svg?react';
import RightAlign from '../../images/icons/text-left.svg?react';
import CenterAlign from '../../images/icons/text-center.svg?react';
import JusitfyAlign from '../../images/icons/justify.svg?react';
import IndentIcon from '../../images/icons/indent.svg?react';
import OutdentIcon from '../../images/icons/outdent.svg?react';
// import second from '../../images/icons/plus-slash-minus.svg?react'

class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    }
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function ComponentPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: ComponentPickerOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.icon}
      <span className="text">{option.title}</span>
    </li>
  );
}

export default function ComponentPickerMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useModal();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0
  });

  const getDynamicOptions = useCallback(() => {
    const options: Array<ComponentPickerOption> = [];

    if (queryString == null) {
      return options;
    }

    const fullTableRegex = new RegExp(/^([1-9]|10)x([1-9]|10)$/);
    const partialTableRegex = new RegExp(/^([1-9]|10)x?$/);

    const fullTableMatch = fullTableRegex.exec(queryString);
    const partialTableMatch = partialTableRegex.exec(queryString);

    if (fullTableMatch) {
      const [rows, columns] = fullTableMatch[0]
        .split('x')
        .map((n: string) => parseInt(n, 10));

      options.push(
        new ComponentPickerOption(`${rows}x${columns} Table`, {
          icon: <TableIcon className="text-black" />,
          keywords: ['table'],
          onSelect: () =>
            // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
            editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows })
        })
      );
    } else if (partialTableMatch) {
      const rows = parseInt(partialTableMatch[0], 10);

      options.push(
        ...Array.from({ length: 5 }, (_, i) => i + 1).map(
          (columns) =>
            new ComponentPickerOption(`${rows}x${columns} Table`, {
              icon: <TableIcon className="" />,
              keywords: ['table'],
              onSelect: () =>
                // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows })
            })
        )
      );
    }

    return options;
  }, [editor, queryString]);

  const options = useMemo(() => {
    const baseOptions = [
      new ComponentPickerOption('Paragraph', {
        icon: <Paragraph className="icon paragraph" />,
        keywords: ['normal', 'paragraph', 'p', 'text'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          })
      }),
      ...Array.from({ length: 3 }, (_, i) => i + 1).map((n, idx) => {
        const iconArr = [
          <H1 className={`icon h${n}`} />,
          <H2 className={`icon h${n}`} />,
          <H3 className={`icon h${n}`} />
        ];
        return new ComponentPickerOption(`Heading ${n}`, {
          icon: iconArr[idx],
          keywords: ['heading', 'header', `h${n}`],
          onSelect: () =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () =>
                  // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                  $createHeadingNode(`h${n}`)
                );
              }
            })
        });
      }),
      // new ComponentPickerOption('Table', {
      //   icon: <i className="table icon" />,
      //   keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
      //   onSelect: () =>
      //     showModal('Insert Table', (onClose) => (
      //       <InsertTableDialog activeEditor={editor} onClose={onClose} />
      //     ))
      // }),
      new ComponentPickerOption('Table (Experimental)', {
        icon: <TableIcon className="mr-2" />,
        keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
        onSelect: () =>
          showModal('Insert Table', (onClose) => (
            <InsertNewTableDialog activeEditor={editor} onClose={onClose} />
          ))
      }),
      new ComponentPickerOption('Numbered List', {
        icon: <ListOl className="icon number" />,
        keywords: ['numbered list', 'ordered list', 'ol'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      }),
      new ComponentPickerOption('Bulleted List', {
        icon: <ListUl className="icon bullet" />,
        keywords: ['bulleted list', 'unordered list', 'ul'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
      }),
      new ComponentPickerOption('Check List', {
        icon: <SquareCheck className="icon check" />,
        keywords: ['check list', 'todo list'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
      }),
      new ComponentPickerOption('Quote', {
        icon: <ChatSquareQuote className="icon quote" />,
        keywords: ['block quote'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          })
      }),
      new ComponentPickerOption('Code', {
        icon: <Code className="icon code" />,
        keywords: ['javascript', 'python', 'js', 'codeblock'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              if (selection.isCollapsed()) {
                $setBlocksType(selection, () => $createCodeNode());
              } else {
                // Will this ever happen?
                const textContent = selection.getTextContent();
                const codeNode = $createCodeNode();
                selection.insertNodes([codeNode]);
                selection.insertRawText(textContent);
              }
            }
          })
      }),
      new ComponentPickerOption('Divider', {
        icon: <HorizontalRule className="icon horizontal-rule" />,
        keywords: ['horizontal rule', 'divider', 'hr'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
      }),
      new ComponentPickerOption('Page Break', {
        icon: <Scissors className="icon page-break" />,
        keywords: ['page break', 'divider'],
        onSelect: () => editor.dispatchCommand(INSERT_PAGE_BREAK, undefined)
      }),
      new ComponentPickerOption('Excalidraw', {
        icon: <Diagram2 className="icon diagram-2" />,
        keywords: ['excalidraw', 'diagram', 'drawing'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
      }),
      new ComponentPickerOption('Poll', {
        icon: <PollIcon className="icon poll" />,
        keywords: ['poll', 'vote'],
        onSelect: () =>
          showModal('Insert Poll', (onClose) => (
            <InsertPollDialog activeEditor={editor} onClose={onClose} />
          ))
      }),
      // ...EmbedConfigs.map(
      //   (embedConfig) =>
      //     new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
      //       icon: embedConfig.icon,
      //       keywords: [...embedConfig.keywords, 'embed'],
      //       onSelect: () =>
      //         editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type)
      //     })
      // ),
      new ComponentPickerOption('Equation', {
        icon: <PlusSlashMinus className="icon equation" />,
        keywords: ['equation', 'latex', 'math'],
        onSelect: () =>
          showModal('Insert Equation', (onClose) => (
            <InsertEquationDialog activeEditor={editor} onClose={onClose} />
          ))
      }),
      // new ComponentPickerOption('GIF', {
      //   icon: <i className="icon gif" />,
      //   keywords: ['gif', 'animate', 'image', 'file'],
      //   onSelect: () =>
      //     editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      //       altText: 'Cat typing on a laptop',
      //       src: catTypingGif
      //     })
      // }),
      new ComponentPickerOption('Image', {
        icon: <FileImage className="icon image" />,
        keywords: ['image', 'photo', 'picture', 'file'],
        onSelect: () =>
          showModal('Insert Image', (onClose) => (
            <InsertImageDialog activeEditor={editor} onClose={onClose} />
          ))
      }),
      // new ComponentPickerOption('Collapsible', {
      //   icon: <i className="icon caret-right" />,
      //   keywords: ['collapse', 'collapsible', 'toggle'],
      //   onSelect: () =>
      //     editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
      // }),
      ...[
        ['left', <LeftAlign className="mr-2" />],
        ['center', <CenterAlign className="mr-2" />],
        ['right', <RightAlign className="mr-2" />],
        ['justify', <JusitfyAlign className="mr-2" />]
      ].map(
        (alignment) =>
          new ComponentPickerOption(`Align ${alignment[0]}`, {
            icon: alignment[1] as any,
            keywords: ['align', 'justify', alignment[0] as string],
            onSelect: () =>
              // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment[0])
          })
      )
    ];

    const dynamicOptions = getDynamicOptions();

    return queryString
      ? [
          ...dynamicOptions,
          ...baseOptions.filter((option) => {
            return new RegExp(queryString, 'gi').exec(option.title) ||
              option.keywords != null
              ? option.keywords.some((keyword) =>
                  new RegExp(queryString, 'gi').exec(keyword)
                )
              : false;
          })
        ]
      : baseOptions;
  }, [editor, getDynamicOptions, queryString, showModal]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <>
      {modal}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) =>
          anchorElementRef.current && options.length
            ? ReactDOM.createPortal(
                <div className="typeahead-popover component-picker-menu">
                  <ul>
                    {options.map((option, i: number) => (
                      <ComponentPickerMenuItem
                        index={i}
                        isSelected={selectedIndex === i}
                        onClick={() => {
                          setHighlightedIndex(i);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(i);
                        }}
                        key={option.key}
                        option={option}
                      />
                    ))}
                  </ul>
                </div>,
                anchorElementRef.current
              )
            : null
        }
      />
    </>
  );
}
