import React from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-plsql'

export default function CodeEditor({ value = '', onChange }) {
  return (
    <Editor
      value={value}
      onValueChange={onChange}
      highlight={(code) => highlight(code, languages.plsql)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12
      }}
    />
  )
}
