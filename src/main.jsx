import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx' // Make sure the case matches! (app.jsx vs App.jsx)
import './index.css' // Global styles, if you have any

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)