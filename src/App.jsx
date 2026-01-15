import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import PrivateRoutes from './components/PrivateRoutes';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TasksProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </TasksProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
