import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { PrivateRoute } from './components/admin/PrivateRoute';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <Admin />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
