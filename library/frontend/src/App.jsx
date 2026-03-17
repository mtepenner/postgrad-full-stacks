// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Checks JWT token

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Visitor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['VISITOR', 'ADMIN']} />}>
          <Route path="/catalog" element={<BookCatalog />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/books/new" element={<AddBookForm />} />
          <Route path="/admin/genres/new" element={<AddGenreForm />} />
        </Route>
      </Routes>
    </Router>
  );
}
