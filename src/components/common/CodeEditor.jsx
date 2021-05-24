import React, { Fragment } from 'react'
import Editor from 'react-simple-code-editor'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/github'
import styled from 'styled-components'

const Line = styled.div`
  position: relative;
  &::before {
    position: absolute;
    right: 100%;
    margin-right: 16px;
    text-align: right;
    opacity: 0.4;
    user-select: none;
    counter-increment: line;
    content: counter(line);
  }
`

function noop() {}

export default function CodeEditor({
  style,
  value = '',
  onChange = noop,
  ...props
}) {
  return (
    <div
      style={{ paddingLeft: '3rem', backgroundColor: '#f4f4f4', ...style }}
      {...props}
    >
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={(code) => (
          <Highlight {...defaultProps} theme={theme} code={code} language="sql">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <Fragment>
                {tokens.map((line, i) => (
                  <Line {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </Line>
                ))}
              </Fragment>
            )}
          </Highlight>
        )}
        padding={10}
        style={{
          minHeight: 'inherit',
          backgroundColor: 'white',
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 16,
          counterReset: 'line',
          overflow: 'visible'
        }}
      />
    </div>
  )
}
