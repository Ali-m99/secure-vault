import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './Components/User/UserAuth';
import { MasterPasswordProvider } from './Components/User/MasterPasswordContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MasterPasswordProvider>
  <AuthProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
  </AuthProvider>
  </MasterPasswordProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
