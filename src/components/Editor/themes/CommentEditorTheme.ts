/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './CommentEditorTheme.css';
import baseTheme from './ShepherdEditorTheme';
import type { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
  ...baseTheme,
  paragraph: 'CommentEditorTheme__paragraph'
};

export default theme;
