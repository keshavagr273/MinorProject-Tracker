import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeacherDetail from './pages/TeacherDetail';
import AddGroup from './pages/AddGroup';
import GroupDetail from './pages/GroupDetail';
import LoadingSpinner from './components/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" /> : <Login />}
                />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="teacher/:teacherName" element={<TeacherDetail />} />
                    <Route path="add-group" element={<AddGroup />} />
                    <Route path="group/:id" element={<GroupDetail />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
