// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext'; // Importing AuthProvider from context
import App from './App'; // Your main App component

// Creating the root element for the app
ReactDOM.createRoot(document.getElementById('root')).render(
  // Wrapping the App with AuthProvider to provide authentication context
  <AuthProvider>
    <App />
  </AuthProvider>
);
