import React, { useEffect, useState } from 'react';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;

  const fetchUsers = async () => {
    setError(false);
    setLoading(true);
    try {
      console.log("Fetching users...");
      const res = await fetch("https://jsonplaceholder.typicode.com/users");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (err) {
      console.error("Error in Fetching:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sorting and filtering
  const SortedUsers = [...users].sort((a, b) =>
    sortOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const filteredUsers = SortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  return (
    <div className="p-10 m-10 shadow-xl max-w-4xl mx-auto">
      <h1 className="font-extrabold text-3xl mb-4">User List</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 rounded border"
          value={sortOrder}
        >
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="ml-4 text-gray-600 font-semibold">Loading Users...</p>
        </div>
      )}

      {error && (
        <div className="text-red-600 font-bold space-y-2">
          <p>⚠️ Failed to load users.</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={fetchUsers}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <ul className="space-y-2 mb-6">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <li
                  key={user.id}
                  className="text-xl p-4 bg-blue-500 text-white rounded flex justify-between"
                >
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                  <p>{user.company?.name}</p>
                </li>
              ))
            ) : (
              <p>No users found!</p>
            )}
          </ul>

          {filteredUsers.length > usersPerPage && (
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <p>
                Page {currentPage} of {totalPages}
              </p>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
