import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

const ItemsDisplay = ({recipe}) => {

    const {id, title, image} = recipe
    
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const API_LINK = `${API_BASE_URL}/${id}/analyzedInstructions?apiKey=${API_KEY}`;

        axios.get(API_LINK)
        .then(response => {
            setLoading(false)
            setSteps(response.data[0]?.steps || [])
        })
        .catch((error) => {
            console.error(error)
            setError(error)
        })
    },[id])

  return (
    <div>
        {loading && <p>loading...</p>}
        {error && <p>Error Occured, Call the Support</p>}
        <h1>{title}</h1>
        {image && <img src={image} alt={title} style={{ width: '300px', height: 'auto'}} />}
        <h2>Instruction: </h2>
            {steps.length > 0 ? (
                <ol>
                    {steps.map((step, index) => (
                        <li key={index}>{step.step}</li>
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