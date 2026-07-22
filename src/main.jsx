import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LocationProvider } from './Context/LocationContext.jsx'
import './index.css'
import App from './App.jsx'
{
  /* The following line can be included in your src/index.js or App.js file */
}
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocationProvider>
    <App />
    </LocationProvider>
  </StrictMode>,
)
