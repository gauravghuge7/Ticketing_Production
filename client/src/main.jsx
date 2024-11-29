

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './redux/Store.js';
import { Provider } from 'react-redux';





createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>


      <App />

    </BrowserRouter>
  </Provider>
)
