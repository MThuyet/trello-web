// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
// MUI
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/thems.js'
// react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// material-ui-confirm
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <ConfirmProvider
      defaultOptions={{
        dialogProps: { maxWidth: 'xs' },
        cancellationButtonProps: { color: 'inherit' },
        confirmationButtonProps: { variant: 'outlined' },
        allowClose: false
      }}>
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left" theme="colored" />
    </ConfirmProvider>
  </CssVarsProvider>
  // </React.StrictMode>
)
