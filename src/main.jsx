import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MaterialTailwindControllerProvider } from "@/context";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import 'react-loading-skeleton/dist/skeleton.css'

//was
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
    
      <MaterialTailwindControllerProvider>
      <App />
      </MaterialTailwindControllerProvider>
      </ThemeProvider>
   </Provider>
  </StrictMode>,
)
