import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { AuthProvider } from './services/context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
