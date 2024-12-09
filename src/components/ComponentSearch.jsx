import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ComponentList from './ComponentList'

const ComponentSearch = () => {
    const API_LINK = import.meta.env.VITE_API_LINK;
    const API_KEY = import.meta.env.VITE_API_KEY;

    console.log(import.meta.env.VITE_API_LINK);
    console.log(import.meta.env.VITE_API_BASE_URL);
    console.log(import.meta.env.VITE_API_KEY);


    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [recipes, setRecipes] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        if (searchTerm) {  // Fetch recipes only if there is a searchTerm
            setLoading(true); // Show loading indicator while fetching
            const timer = setTimeout(() => {
                axios
                  .get(`${API_LINK}query=${searchTerm}&apiKey=${API_KEY}`)
                  .then(response => {
                    setRecipes(response.data.results);
                    setLoading(false); // Hide loading after fetching
                  })
                  .catch((error) => {
                    console.error(error);
                    setError(error);
                    setLoading(false);
                  });
              }, 500); // Adding a delay of 500ms to show the loading spinner more visibly
        
              return () => clearTimeout(timer); // Clean up the timeout on component unmount
            }
          }, [searchTerm, API_LINK, API_KEY]);

    const handleSearch = (e) => {
       const query = e.target.value
       setSearchTerm(query)
    }
  return (
    <div className='search'>

        <h2>Find recipe</h2>
        <input type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Type a recipe name (e.g., chicken)"
        />
        

      {error && <p>Error occurred, try again later.</p>}
          
        <ComponentList recipes={recipes} loading={loading}/>
    </div>
  )
}

export default ComponentSearch