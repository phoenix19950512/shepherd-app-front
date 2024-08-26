/* eslint-disable react/style-prop-object */

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// import { useInView } from 'react-intersection-observer';
import useDebounce from '../../../../hooks/useDebounce';
import useModal from '../../hooks/useModal';
import catTypingGif from '../../images/cat-typing.gif';
import { $createStickyNode } from '../../nodes/StickyNode';
import DropDown, { DropDownItem } from '../../ui/DropDown';
import DropdownColorPicker from '../../ui/DropdownColorPicker';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { sanitizeUrl } from '../../utils/url';
import { EmbedConfigs } from '../AutoEmbedPlugin';
import { INSERT_COLLAPSIBLE_COMMAND } from '../CollapsiblePlugin';
import { InsertEquationDialog } from '../EquationsPlugin';
import { INSERT_EXCALIDRAW_COMMAND } from '../ExcalidrawPlugin';
import {
  INSERT_IMAGE_COMMAND,
  InsertImageDialog,
  InsertImagePayload
} from '../ImagesPlugin';
import { InsertInlineImageDialog } from '../InlineImagePlugin';
import InsertLayoutDialog from '../LayoutPlugin/InsertLayoutDialog';
import { INSERT_PAGE_BREAK } from '../PageBreakPlugin';
import { InsertPollDialog } from '../PollPlugin';
import { InsertNewTableDialog, InsertTableDialog } from '../TablePlugin';
import { IS_APPLE } from '../shared/src/environment';
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName
} from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  insertList,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND
} from '@lexical/list';
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType
} from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType
} from '@lexical/selection';
import { $isTableNode } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister
} from '@lexical/utils';
import clsx from 'clsx';

// import {
//   $createParagraphNode,
//   $getNodeByKey,
//   $getRoot,
//   $getSelection,
//   $isElementNode,
//   $isRangeSelection,
//   $isRootOrShadowRoot,
//   $isTextNode,
//   CAN_REDO_COMMAND,
//   CAN_UNDO_COMMAND,
//   COMMAND_PRIORITY_CRITICAL,
//   COMMAND_PRIORITY_NORMAL,
//   COMMAND_PRIORITY_LOW,
//   DEPRECATED_$isGridSelection,
//   FORMAT_ELEMENT_COMMAND,
//   FORMAT_TEXT_COMMAND,
//   INDENT_CONTENT_COMMAND,
//   KEY_MODIFIER_COMMAND,
//   OUTDENT_CONTENT_COMMAND,
//   REDO_COMMAND,
//   SELECTION_CHANGE_COMMAND,
//   UNDO_COMMAND
// } from 'lexical';

import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $INTERNAL_isPointSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from 'lexical';

import React, { useCallback, useEffect, useState, forwardRef } from 'react';

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

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote'
};

const blockTypeToBlockNameIcon = (className?: string) => ({
  bullet: <ListUl className={className} />,
  check: <SquareCheck className={className} />,
  code: <Code className={className} />,
  h1: <H1 className={className} />,
  h2: <H2 className={className} />,
  h3: <H3 className={className} />,
  h4: <H4 className={className} />,
  h5: <H5 className={className} />,
  h6: <H6 className={className} />,
  number: <ListOl className={className} />,
  paragraph: <Paragraph className={className} />,
  quote: <ChatSquareQuote className={className} />
});

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table'
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Montserrat', 'Montserrat'],
  ['Open Sans', 'Open Sans'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana']
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
  ['24px', '24px'],
  ['32px', '32px']
];

const ELEMENT_FORMAT_OPTIONS: {
  [key: string]: {
    icon?: React.ReactNode | JSX.Element;
    name: string;
    iconName: string;
  };
} = {
  start: {
    iconName: 'left-align',
    name: 'Left Align',
    icon: <LeftAlign className="icon left-align" />
  },
  center: {
    iconName: 'center-align',
    name: 'Center Align',
    icon: <CenterAlign className="icon center-align" />
  },
  justify: {
    iconName: 'justify-align',
    name: 'Justify Align',
    icon: <JusitfyAlign className="icon jusity-align" />
  },
  left: {
    iconName: 'left-align',
    name: 'Left Align',
    icon: <LeftAlign className="icon left-align" />
  },
  right: {
    iconName: 'right-align',
    name: 'Right Align',
    icon: <RightAlign className="icon right-align" />
  }
};

function dropDownActiveClass(active: boolean) {
  if (active) return 'active dropdown-item-active';
  else return '';
}

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($INTERNAL_isPointSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($INTERNAL_isPointSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($INTERNAL_isPointSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if ($INTERNAL_isPointSelection(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={'icon block-type ' + blockType}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
      buttonIcon={
        blockTypeToBlockNameIcon('icon block-type ' + blockType)[
          blockType
        ] as JSX.Element
      }
    >
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
        onClick={formatParagraph}
      >
        {/* <i className="icon paragraph" /> */}
        <Paragraph className="icon" />
        <span className="text">Normal</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'h1')}
        onClick={() => formatHeading('h1')}
      >
        {/* <i className="icon h1" /> */}
        <H1 className="icon" />
        <span className="text">Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'h2')}
        onClick={() => formatHeading('h2')}
      >
        {/* <i className="icon h2" /> */}
        <H2 className="icon" />
        <span className="text">Heading 2</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'h3')}
        onClick={() => formatHeading('h3')}
      >
        {/* <i className="icon h3" /> */}
        <H3 className="icon" />
        <span className="text">Heading 3</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'bullet')}
        onClick={formatBulletList}
      >
        {/* <i className="icon bullet-list" /> */}
        <ListUl className="icon" />
        <span className="text">Bullet List</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'number')}
        onClick={formatNumberedList}
      >
        {/* <i className="icon numbered-list" /> */}
        <ListOl className="icon" />
        <span className="text">Numbered List</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'check')}
        onClick={formatCheckList}
      >
        {/* <i className="icon check-list" /> */}
        <SquareCheck className="icon" />
        <span className="text">Check List</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'quote')}
        onClick={formatQuote}
      >
        {/* <i className="icon quote" /> */}
        <ChatSquareQuote className="icon" />
        <span className="text">Quote</span>
      </DropDownItem>
      <DropDownItem
        className={'item ' + dropDownActiveClass(blockType === 'code')}
        onClick={formatCode}
      >
        {/* <i className="icon code" /> */}
        <Code className="icon" />
        <span className="text">Code Block</span>
      </DropDownItem>
    </DropDown>
  );
}

function Divider(): JSX.Element {
  return <div className="divider" />;
}

function FontDropDown({
  editor,
  value,
  style,
  disabled = false
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option
          });
        }
      });
    },
    [editor, style]
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';

  return (
    <DropDown
      disabled={disabled}
      buttonClassName={'toolbar-item ' + style}
      buttonLabel={value}
      buttonIconClassName={
        style === 'font-family' ? 'icon block-type font-family' : ''
      }
      buttonAriaLabel={buttonAriaLabel}
      buttonIcon={
        style === 'font-family' ? (
          <FontFamily className={'icon block-type font-family'} />
        ) : (
          ''
        )
      }
    >
      {(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
        ([option, text]) => (
          <DropDownItem
            className={`item ${dropDownActiveClass(value === option)} ${
              style === 'font-size' ? 'fontsize-item' : ''
            }`}
            onClick={() => handleClick(option)}
            key={option}
          >
            <span className="text">{text}</span>
          </DropDownItem>
        )
      )}
    </DropDown>
  );
}

function ElementFormatDropdown({
  editor,
  value,
  isRTL,
  disabled = false
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled: boolean;
}) {
  return (
    <DropDown
      disabled={disabled}
      buttonLabel={ELEMENT_FORMAT_OPTIONS[value].name}
      buttonIconClassName={`icon ${ELEMENT_FORMAT_OPTIONS[value].iconName}`}
      buttonIcon={ELEMENT_FORMAT_OPTIONS[value].icon}
      buttonClassName="toolbar-item spaced alignment"
      buttonAriaLabel="Formatting options for text alignment"
    >
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="item"
      >
        {/* <i className="icon left-align" /> */}

        <LeftAlign className="icon left-align" />
        <span className="text">Left Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="item"
      >
        {/* <i className="icon center-align" /> */}

        <CenterAlign className="icon center-align" />
        <span className="text">Center Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="item"
      >
        {/* <i className="icon right-align" /> */}
        <RightAlign className="icon right-align" />
        <span className="text">Right Align</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="item"
      >
        {/* <i className="icon justify-align" /> */}
        <JusitfyAlign className="icon justify-align" />
        <span className="text">Justify Align</span>
      </DropDownItem>
      <Divider />
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
        className="item"
      >
        {/* <i className={'icon ' + (isRTL ? 'indent' : 'outdent')} /> */}
        {!isRTL ? (
          <OutdentIcon className="icon" />
        ) : (
          <IndentIcon className="icon" />
        )}
        <span className="text">Outdent</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
        className="item"
      >
        {/* <i className={'icon ' + (isRTL ? 'outdent' : 'indent')} /> */}
        {isRTL ? (
          <OutdentIcon className="icon" />
        ) : (
          <IndentIcon className="icon" />
        )}
        <span className="text">Indent</span>
      </DropDownItem>
    </DropDown>
  );
}

export default forwardRef<any, any>(function ToolbarPlugin(
  { inView, parentInView, setIsLinkEditMode },
  ref
): JSX.Element {
  // const ref = useRef<HTMLDivElement>();
  // const { ref: inViewRef, inView } = useInView();

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [positonToolbar, setPositionToolbar] = useState(false);
  const debounce = useDebounce(100);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ''
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px')
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000')
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff'
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
      );
      setElementFormat(
        ($isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType()) || 'left'
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    editor.registerCommand(
      INSERT_UNORDERED_LIST_COMMAND,
      () => {
        insertList(editor, 'bullet');
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    editor.registerCommand(
      INSERT_CHECK_LIST_COMMAND,
      () => {
        insertList(editor, 'check');
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    editor.registerCommand(
      INSERT_ORDERED_LIST_COMMAND,
      () => {
        insertList(editor, 'number');
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        // if (code === 'KeyK' && (ctrlKey || metaKey)) {
        //   event.preventDefault();
        //   return activeEditor.dispatchCommand(
        //     TOGGLE_LINK_COMMAND,
        //     sanitizeUrl('https://')
        //   );
        // }

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl('https://');
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor]
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }, [activeEditor]);

  // const clearFormatting = useCallback(() => {
  //   activeEditor.update(() => {
  //     const selection = $getSelection();
  //     if ($isRangeSelection(selection)) {
  //       const anchor = selection.anchor;
  //       const focus = selection.focus;
  //       const nodes = selection.getNodes();

  //       if (anchor.key === focus.key && anchor.offset === focus.offset) {
  //         return;
  //       }

  //       nodes.forEach((node, idx) => {
  //         // We split the first and last node by the selection
  //         // So that we don't format unselected text inside those nodes
  //         if ($isTextNode(node)) {
  //           if (idx === 0 && anchor.offset !== 0) {
  //             node = node.splitText(anchor.offset)[1] || node;
  //           }
  //           if (idx === nodes.length - 1) {
  //             node = node.splitText(focus.offset)[0] || node;
  //           }

  //           if (node.__style !== '') {
  //             node.setStyle('');
  //           }
  //           if (node.__format !== 0) {
  //             node.setFormat(0);
  //             $getNearestBlockElementAncestorOrThrow(node).setFormat('');
  //           }
  //         } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
  //           node.replace($createParagraphNode(), true);
  //         } else if ($isDecoratorBlockNode(node)) {
  //           node.setFormat('');
  //         }
  //       });
  //     }
  //   });
  // }, [activeEditor]);

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ 'background-color': value });
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );
  const insertGifOnClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  useEffect(() => {
    debounce(
      () => {
        if (!inView && !parentInView) {
          setPositionToolbar(true);
        } else if (inView && !parentInView) {
          setPositionToolbar(true);
        } else {
          setPositionToolbar(false);
        }
      },
      () => true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, parentInView]);

  return (
    <div
      ref={ref}
      className={clsx(
        'toolbar',
        //  positonToolbar && 'out-view',
        positonToolbar && 'out-view-bottom'
      )}
    >
      <button
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
        type="button"
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        {/* <i className="format undo" /> */}
        <Undo className="format" />
      </button>
      <button
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
        type="button"
        className="toolbar-item"
        aria-label="Redo"
      >
        {/* <i className="format redo" /> */}
        <Redo className="format" />
      </button>
      <Divider />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            rootType={rootType}
            editor={editor}
          />
          <Divider />
        </>
      )}
      {blockType === 'code' ? (
        <DropDown
          disabled={!isEditable}
          buttonClassName="toolbar-item code-language"
          buttonLabel={getLanguageFriendlyName(codeLanguage)}
          buttonAriaLabel="Select language"
        >
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
            return (
              <DropDownItem
                className={`item ${dropDownActiveClass(
                  value === codeLanguage
                )}`}
                onClick={() => onCodeLanguageSelect(value)}
                key={value}
              >
                <span className="text">{name}</span>
              </DropDownItem>
            );
          })}
        </DropDown>
      ) : (
        <>
          <FontDropDown
            disabled={!isEditable}
            style={'font-family'}
            value={fontFamily}
            editor={editor}
          />
          <FontDropDown
            disabled={!isEditable}
            style={'font-size'}
            value={fontSize}
            editor={editor}
          />
          <Divider />
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
            title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
            type="button"
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? '⌘B' : 'Ctrl+B'
            }`}
          >
            {/* <i className="format bold" /> */}
            <Bold className="format bold" />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
            title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
            type="button"
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? '⌘I' : 'Ctrl+I'
            }`}
          >
            {/* <i className="italic format" /> */}
            <Italic className="format italic" />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
            title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
            type="button"
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? '⌘U' : 'Ctrl+U'
            }`}
          >
            {/* <i className="underline format" /> */}
            <Underline className="underline format" />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
            className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
            title="Insert code block"
            type="button"
            aria-label="Insert code block"
          >
            {/* <i className="format code" /> */}
            <Code className="format code" />
          </button>
          <button
            disabled={!isEditable}
            onClick={insertLink}
            className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
            aria-label="Insert link"
            title="Insert link"
            type="button"
          >
            {/* <i className="format link" /> */}
            <HyLink className="format link" />
          </button>
          <DropdownColorPicker
            disabled={!isEditable}
            buttonClassName="toolbar-item color-picker"
            buttonAriaLabel="Formatting text color"
            buttonIconClassName="icon font-color"
            buttonIcon={<FontColor className="icon font-color" />}
            color={fontColor}
            onChange={onFontColorSelect}
            title="text color"
          />
          <DropdownColorPicker
            disabled={!isEditable}
            buttonClassName="toolbar-item color-picker"
            buttonAriaLabel="Formatting background color"
            buttonIconClassName="icon bg-color"
            buttonIcon={<BgColor className="icon bg-color" />}
            color={bgColor}
            onChange={onBgColorSelect}
            title="bg color"
          />
          <DropDown
            disabled={!isEditable}
            buttonClassName="toolbar-item spaced"
            buttonLabel=""
            buttonAriaLabel="Formatting options for additional text styles"
            buttonIconClassName="icon dropdown-more"
            buttonIcon={<DropdownMore className="icon dropdown-more" />}
          >
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'strikethrough'
                );
              }}
              className={'item ' + dropDownActiveClass(isStrikethrough)}
              title="Strikethrough"
              aria-label="Format text with a strikethrough"
            >
              {/* <i className="icon strikethrough" /> */}

              <StrikeThrough className="icon strikethrough" />

              <span className="text">Strikethrough</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
              }}
              className={'item ' + dropDownActiveClass(isSubscript)}
              title="Subscript"
              aria-label="Format text with a subscript"
            >
              {/* <i className="icon subscript" /> */}

              <Subscript className="icon subscript" />
              <span className="text">Subscript</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'superscript'
                );
              }}
              className={'item ' + dropDownActiveClass(isSuperscript)}
              title="Superscript"
              aria-label="Format text with a superscript"
            >
              {/* <i className="icon superscript" /> */}
              <Superscript className="icon superscript" />
              <span className="text">Superscript</span>
            </DropDownItem>
            <DropDownItem
              onClick={clearFormatting}
              className="item"
              title="Clear text formatting"
              aria-label="Clear all text formatting"
            >
              {/* <i className="icon clear" /> */}
              <Clear className="icon clear" />
              <span className="text">Clear Formatting</span>
            </DropDownItem>
          </DropDown>
          <Divider />
          {rootType === 'table' && (
            <>
              <DropDown
                disabled={!isEditable}
                buttonClassName="toolbar-item spaced"
                buttonLabel="Table"
                buttonAriaLabel="Open table toolkit"
                buttonIconClassName="icon table secondary"
                buttonIcon={<TableIcon className="icon mr-2 secondary" />}
              >
                <DropDownItem
                  onClick={() => {
                    /**/
                  }}
                  className="item"
                >
                  <span className="text">TODO</span>
                </DropDownItem>
              </DropDown>
              <Divider />
            </>
          )}
          <DropDown
            disabled={!isEditable}
            buttonClassName="toolbar-item spaced"
            buttonLabel="Insert"
            buttonAriaLabel="Insert specialized editor node"
            buttonIconClassName="icon plus"
            buttonIcon={<PlusIcon className="icon plus" />}
          >
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined
                );
              }}
              className="item"
            >
              {/* <i className="icon horizontal-rule" /> */}
              <HorizontalRule className="icon horizontal-rule" />
              <span className="text">Horizontal Rule</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
              }}
              className="item"
            >
              {/* <i className="icon page-break" /> */}

              <Scissors className="icon page-break" />
              <span className="text">Page Break</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                showModal('Insert Image', (onClose) => (
                  <InsertImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
            >
              {/* <i className="icon image" /> */}

              <FileImage className="icon image" />
              <span className="text">Image</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                showModal('Insert Inline Image', (onClose) => (
                  <InsertInlineImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
            >
              {/* <i className="icon image" /> */}
              <FileImage className="icon image" />
              <span className="text">Inline Image</span>
            </DropDownItem>
            {false && (
              <DropDownItem
                onClick={() =>
                  insertGifOnClick({
                    altText: 'Cat typing on a laptop',
                    src: catTypingGif
                  })
                }
                className="item"
              >
                <i className="icon gif" />
                <span className="text">GIF</span>
              </DropDownItem>
            )}
            <DropDownItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_EXCALIDRAW_COMMAND,
                  undefined
                );
              }}
              className="item"
            >
              {/* <i className="icon diagram-2" /> */}
              <Diagram2 className="icon diagram-2" />
              <span className="text">Excalidraw</span>
            </DropDownItem>
            {false && (
              <DropDownItem
                onClick={() => {
                  showModal('Insert Table', (onClose) => (
                    <InsertTableDialog
                      activeEditor={activeEditor}
                      onClose={onClose}
                    />
                  ));
                }}
                className="item"
              >
                <i className="table icon" />
                <span className="text">Table</span>
              </DropDownItem>
            )}
            <DropDownItem
              onClick={() => {
                showModal('Insert Table', (onClose) => (
                  <InsertNewTableDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
            >
              {/* <i className="table icon" /> */}
              <TableIcon className="icon mr-2" />
              <span className="text">Table (Experimental)</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                showModal('Insert Poll', (onClose) => (
                  <InsertPollDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
            >
              {/* <i className="icon poll" /> */}
              <PollIcon className="icon poll" />
              <span className="text">Poll</span>
            </DropDownItem>
            <DropDownItem
              onClick={() => {
                showModal('Insert Columns Layout', (onClose) => (
                  <InsertLayoutDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
            >
              {/* <i className="icon columns" /> */}
              <ColumnsIcon className="icon columns" />
              <span className="text">Columns Layout</span>
            </DropDownItem>

            <DropDownItem
              onClick={() => {
                showModal('Insert Equation', (onClose) => (
                  <InsertEquationDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
              className="item"
            >
              {/* <i className="icon equation" /> */}
              <PlusSlashMinus className="icon equation" />
              <span className="text">Equation</span>
            </DropDownItem>
            {false && (
              <>
                <DropDownItem
                  onClick={() => {
                    editor.update(() => {
                      const root = $getRoot();
                      const stickyNode = $createStickyNode(0, 0);
                      root.append(stickyNode);
                    });
                  }}
                  className="item"
                >
                  <i className="sticky icon" />
                  <span className="text">Sticky Note</span>
                </DropDownItem>
                <DropDownItem
                  onClick={() => {
                    editor.dispatchCommand(
                      INSERT_COLLAPSIBLE_COMMAND,
                      undefined
                    );
                  }}
                  className="item"
                >
                  <i className="icon caret-right" />
                  <span className="text">Collapsible container</span>
                </DropDownItem>
              </>
            )}
            {false &&
              EmbedConfigs.map((embedConfig) => (
                <DropDownItem
                  key={embedConfig.type}
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      INSERT_EMBED_COMMAND,
                      embedConfig.type
                    );
                  }}
                  className="item"
                >
                  {embedConfig.icon}
                  <span className="text">{embedConfig.contentName}</span>
                </DropDownItem>
              ))}
          </DropDown>
        </>
      )}
      <Divider />
      <ElementFormatDropdown
        disabled={!isEditable}
        value={elementFormat}
        editor={editor}
        isRTL={isRTL}
      />
      {modal}
    </div>
  );
});
