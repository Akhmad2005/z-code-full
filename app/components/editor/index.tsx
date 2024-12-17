'use client'

import React, { useState } from 'react';
import ControlledEditor from '@uiw/react-codemirror';
import { useTheme } from "next-themes";

interface CodeEditorProps {
  code?: string;
  onChange?: (value: string) => void;
  language?: string,
  slug: string
}

import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  slug,
  code = "", 
  onChange, 
  language,
}) => {
	const {theme} = useTheme();

  const handleChange = (value: string) => {
    localStorage.setItem(`${slug}_${language}`, value);
    if (onChange) onChange(value);
  };

	const languageOptions: Record<string, any> = {
    javascript,
    python
  };

  return (
    <ControlledEditor
      value={code}
      onChange={handleChange}
      extensions={language ? [languageOptions[language]()] : []}
      style={{
				height: '100%'
			}}
			height='100%'
      theme={theme == 'dark' ? 'dark' : 'light'}
    />
  );
};

export default CodeEditor;