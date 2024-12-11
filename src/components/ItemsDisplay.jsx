import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

const ItemsDisplay = ({recipe}) => {

    const {id, title, image} = recipe
    
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [iconColors, setIconColors] = useState([])

    useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const API_LINK = `${API_BASE_URL}/${id}/analyzedInstructions?apiKey=${API_KEY}`;
    const INGREDIENTS_LINK = `${API_BASE_URL}/${id}/ingredientWidget.json?apiKey=${API_KEY}`;

        axios.get(API_LINK)
        .then(response => {
            setLoading(false)
            setSteps(response.data[0]?.steps || [])
        })
        .catch((error) => {
            console.error(error)
            setError(error)
        });

        axios.get(INGREDIENTS_LINK)
        .then(response => {
          setIngredients(response.data?.ingredients || []);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
    },[id])
    const handleIconClick = (index) => {
        setIconColors((prevColors) => {
            // Step 1: Make a copy of the previous colors array
            const newColors = [...prevColors]
            // Step 2: Toggle the color for the clicked index (true to false or false to true)
            newColors[index] = !newColors[index]
            // Step 3: Return the updated array with the new color state
            return newColors
        });
    };

  return (
    <div>
        {loading && (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> {/* Font Awesome spinner */}
        </div>
      )}
        {error && <p>Error Occured, Call the Support</p>}
        <h1>{title}</h1>
        {image && <img src={image} alt={title} style={{ width: '300px', height: 'auto'}} />}
        <h2>Ingredients:</h2>
        {ingredients.length > 0 ? (
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
                <i className="fa fa-check-circle ingredient-icon"
                style={{
                    color: iconColors[index] ? 'green' : 'orange', // Toggle color based on state
                    fontSize: '20px',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                  onClick={() => handleIconClick(index)}
                ></i>
    
            {ingredient.name} - {ingredient.amount.metric.value} {ingredient.amount.metric.unit}</li>
          ))}
        </ul>
      ) : (
        <p>No ingredients available</p>
      )}
        <h2>Instruction: </h2>
            {steps.length > 0 ? (
                <ol>
                    {steps.map((step, index) => (
                     <li key={index}>{index + 1}. {step.step}</li>
                    ))}
                </ol>
            ) : (
                <p>No steps available</p>
            )}

    </div>
  )
}
ItemsDisplay.propTypes = {
    recipe: PropTypes.shape({
        id: PropTypes.number.isRequired,   
        title: PropTypes.string.isRequired,
        image: PropTypes.string,  
    }).isRequired, 
};
export default ItemsDisplay