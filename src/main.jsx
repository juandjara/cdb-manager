import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

window.global = { navigator: window.navigator }

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
