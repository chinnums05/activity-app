import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { ChatProvider } from './contexts/ChatContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Activities from './pages/Activities';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ActivityProvider>
          <Router>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: '#333',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                },
              }}
            />
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="activities"
                  element={
                    <ProtectedRoute>
                      <Activities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="chat"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </ActivityProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;