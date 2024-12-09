import React, { useState } from 'react';
import ItemsDisplay from './ItemsDisplay';
import PropTypes from 'prop-types';

const ComponentList = ({recipes}) => {
    const [showDetails, setShowDetails] = useState(false);  // Controls whether the details are shown
    const [selectedRecipe, setSelectedRecipe] = useState(null);  // Stores the selected recipe

    const handleShowDetails = (recipe) => {
        setSelectedRecipe(recipe);
        setShowDetails(true);  // Show recipe details
    }

    const handleGoBack = () => {
        setShowDetails(false);  // Hide recipe details and show the list again
    }

  return (
    <div className='component-list'>
        {!showDetails ? (  // If showDetails is false, show the recipe list
            <div>
                <h2>Recipes found: </h2>
                <ul>
                    {recipes.map((recipe, index) => 
                    <li key={index}>
                        {recipe.title}
                        <button className='btn open-btn' onClick={() => handleShowDetails(recipe)}>Open</button>
                    </li>)}
                </ul>
            </div>
        ) : (
            <div className="transition-container show">
            <button className="back-btn" onClick={handleGoBack}>
              Back to list
            </button>
            {selectedRecipe && <ItemsDisplay recipe={selectedRecipe} />}
          </div>
        )}
    </div>
  )
}

ComponentList.propTypes = {
    recipes: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired, 
        })
    ).isRequired, // Recipes must be an array and cannot be null or undefined
};

export default ComponentList;
