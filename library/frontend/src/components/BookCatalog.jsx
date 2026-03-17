// components/BookCatalog.jsx
import { useState, useEffect } from 'react';
import api from '../services/api'; // Axios instance

export default function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Fetch books, backend should order by title ASC
    api.get('/books').then(res => {
      setBooks(res.data);
      setLoading(false);
    });
  }, []);

  const handleFavorite = async (bookId) => {
    try {
      await api.post('/favorites', { bookId });
      setNotification("Book added to favorites!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      setNotification("Failed to add favorite.");
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) || 
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading catalog...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Library Catalog</h1>
      
      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {notification}
        </div>
      )}

      <input 
        type="text" 
        placeholder="Search by title or author..." 
        className="w-full p-3 mb-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-4">
                {book.genre.name}
              </span>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => handleFavorite(book.id)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded transition-colors"
              >
                Favorite
              </button>
              <button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
              >
                Pickup
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
