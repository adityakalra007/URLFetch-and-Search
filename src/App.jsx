import React, { useEffect, useState } from 'react'

const App = () => {

  const[users,setUser] = useState([]);
  const[loading,setLoading] = useState(true);
  const[searchTerm,setSearchTerm] = useState('');

  useEffect(()=>{
        const fetchUsers = async () =>{
          try{
            const res = await fetch("https://jsonplaceholder.typicode.com/users");
            const data = await res.json();
            setUser(data);
          }
          catch(error){
            console.log("Error in Fetching ", error); 
          }
          finally{
            setLoading(false);
          }
        };
        fetchUsers();
  },[]);

  const filterList = users.filter((user) =>{
    return user.name.toLowerCase().includes(searchTerm.toLowerCase())
  } );



  return (
    <>
        <div className='p-10 m-10 shadow-xl'>
          <h1 className='text-extrabold text-2xl mb-4 '>User List</h1>
     <input
        type="text" id="searchBox"
        placeholder="Search users..."
        className="px-4 py-2 border border-gray-300 rounded w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

          {loading ? <p className='text-bold text-gray-500'>Loading Users...</p>:
          (
          <ul className='space-y-2'>
            {
              filterList.length>0 ? (
                filterList.map((user)=>{
                  return (
                  <li key={user.id} className='font-semibold p-2 bg-blue-400 text-black'>{user.name}</li>
                  )
                }) 

              ):
              <p>NO Users Found!</p>
            }
          </ul>
          )

          }
        </div>
    </>
  )
}

export default App
