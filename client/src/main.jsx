

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './Redux/Store.js';
import { Provider } from 'react-redux';
import axios from 'axios';

// axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = "http://localhost:4000";
// axios.defaults.baseURL = "https://ticketing-production-9166.up.railway.app";
axios.defaults.withCredentials = true;
axios.defaults.proxy = true;





createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>


      <App />

    </BrowserRouter>
  </Provider>
)
