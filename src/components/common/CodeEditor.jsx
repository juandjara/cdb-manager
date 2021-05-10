import React from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-sql'
import 'prismjs/themes/prism.css'

function noop() {}

export default function CodeEditor({ value = '', onChange = noop }) {
  return (
    <Editor
      value={value}
      onValueChange={onChange}
      highlight={(code) => highlight(code, languages.sql, 'sql')}
      padding={10}
      className="max-w-screen-lg mx-auto my-8 rounded-lg"
      style={{
        backgroundColor: '#f5f2f0',
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 16
      }}
    />
  )
}
