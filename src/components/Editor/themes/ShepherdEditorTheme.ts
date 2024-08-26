/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './ShepherdEditorTheme.css';
import type { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
  blockCursor: 'ShepherdEditorTheme__blockCursor',
  characterLimit: 'ShepherdEditorTheme__characterLimit',
  code: 'ShepherdEditorTheme__code',
  codeHighlight: {
    atrule: 'ShepherdEditorTheme__tokenAttr',
    attr: 'ShepherdEditorTheme__tokenAttr',
    boolean: 'ShepherdEditorTheme__tokenProperty',
    builtin: 'ShepherdEditorTheme__tokenSelector',
    cdata: 'ShepherdEditorTheme__tokenComment',
    char: 'ShepherdEditorTheme__tokenSelector',
    class: 'ShepherdEditorTheme__tokenFunction',
    'class-name': 'ShepherdEditorTheme__tokenFunction',
    comment: 'ShepherdEditorTheme__tokenComment',
    constant: 'ShepherdEditorTheme__tokenProperty',
    deleted: 'ShepherdEditorTheme__tokenProperty',
    doctype: 'ShepherdEditorTheme__tokenComment',
    entity: 'ShepherdEditorTheme__tokenOperator',
    function: 'ShepherdEditorTheme__tokenFunction',
    important: 'ShepherdEditorTheme__tokenVariable',
    inserted: 'ShepherdEditorTheme__tokenSelector',
    keyword: 'ShepherdEditorTheme__tokenAttr',
    namespace: 'ShepherdEditorTheme__tokenVariable',
    number: 'ShepherdEditorTheme__tokenProperty',
    operator: 'ShepherdEditorTheme__tokenOperator',
    prolog: 'ShepherdEditorTheme__tokenComment',
    property: 'ShepherdEditorTheme__tokenProperty',
    punctuation: 'ShepherdEditorTheme__tokenPunctuation',
    regex: 'ShepherdEditorTheme__tokenVariable',
    selector: 'ShepherdEditorTheme__tokenSelector',
    string: 'ShepherdEditorTheme__tokenSelector',
    symbol: 'ShepherdEditorTheme__tokenProperty',
    tag: 'ShepherdEditorTheme__tokenProperty',
    url: 'ShepherdEditorTheme__tokenOperator',
    variable: 'ShepherdEditorTheme__tokenVariable'
  },
  embedBlock: {
    base: 'ShepherdEditorTheme__embedBlock',
    focus: 'ShepherdEditorTheme__embedBlockFocus'
  },
  hashtag: 'ShepherdEditorTheme__hashtag',
  heading: {
    h1: 'ShepherdEditorTheme__h1',
    h2: 'ShepherdEditorTheme__h2',
    h3: 'ShepherdEditorTheme__h3',
    h4: 'ShepherdEditorTheme__h4',
    h5: 'ShepherdEditorTheme__h5',
    h6: 'ShepherdEditorTheme__h6'
  },
  image: 'editor-image',
  indent: 'ShepherdEditorTheme__indent',
  inlineImage: 'inline-editor-image',
  layoutContainer: 'ShepherdEditorTheme__layoutContaner',
  layoutItem: 'ShepherdEditorTheme__layoutItem',
  link: 'ShepherdEditorTheme__link',
  list: {
    listitem: 'ShepherdEditorTheme__listItem',
    listitemChecked: 'ShepherdEditorTheme__listItemChecked',
    listitemUnchecked: 'ShepherdEditorTheme__listItemUnchecked',
    nested: {
      listitem: 'ShepherdEditorTheme__nestedListItem'
    },
    ol: 'ShepherdEditorTheme__ol',
    olDepth: [
      'ShepherdEditorTheme__ol1',
      'ShepherdEditorTheme__ol2',
      'ShepherdEditorTheme__ol3',
      'ShepherdEditorTheme__ol4',
      'ShepherdEditorTheme__ol5'
    ],
    ulDepth: [
      'ShepherdEditorTheme__ul1',
      'ShepherdEditorTheme__ul2',
      'ShepherdEditorTheme__ul3',
      'ShepherdEditorTheme__ul4',
      'ShepherdEditorTheme__ul5'
    ],
    ul: 'ShepherdEditorTheme__ul'
  },
  ltr: 'ShepherdEditorTheme__ltr',
  mark: 'ShepherdEditorTheme__mark',
  markOverlap: 'ShepherdEditorTheme__markOverlap',
  paragraph: 'ShepherdEditorTheme__paragraph',
  quote: 'ShepherdEditorTheme__quote',
  rtl: 'ShepherdEditorTheme__rtl',
  table: 'ShepherdEditorTheme__table',
  tableAddColumns: 'ShepherdEditorTheme__tableAddColumns',
  tableAddRows: 'ShepherdEditorTheme__tableAddRows',
  tableCell: 'ShepherdEditorTheme__tableCell',
  tableCellActionButton: 'ShepherdEditorTheme__tableCellActionButton',
  tableCellActionButtonContainer:
    'ShepherdEditorTheme__tableCellActionButtonContainer',
  tableCellEditing: 'ShepherdEditorTheme__tableCellEditing',
  tableCellHeader: 'ShepherdEditorTheme__tableCellHeader',
  tableCellPrimarySelected: 'ShepherdEditorTheme__tableCellPrimarySelected',
  tableCellResizer: 'ShepherdEditorTheme__tableCellResizer',
  tableCellSelected: 'ShepherdEditorTheme__tableCellSelected',
  tableCellSortedIndicator: 'ShepherdEditorTheme__tableCellSortedIndicator',
  tableResizeRuler: 'ShepherdEditorTheme__tableCellResizeRuler',
  tableSelected: 'ShepherdEditorTheme__tableSelected',
  tableSelection: 'ShepherdEditorTheme__tableSelection',
  text: {
    bold: 'ShepherdEditorTheme__textBold',
    code: 'ShepherdEditorTheme__textCode',
    italic: 'ShepherdEditorTheme__textItalic',
    strikethrough: 'ShepherdEditorTheme__textStrikethrough',
    subscript: 'ShepherdEditorTheme__textSubscript',
    superscript: 'ShepherdEditorTheme__textSuperscript',
    underline: 'ShepherdEditorTheme__textUnderline',
    underlineStrikethrough: 'ShepherdEditorTheme__textUnderlineStrikethrough'
  }
};

export default theme;
