const mongoose = require('mongoose');


  const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: [{ name: String, amount: { metric: { value: Number, unit: String } } }],
    steps: [{ step: String }],
  });
  
  const Recipe = mongoose.model('Recipe', recipeSchema);
  
  module.exports = Recipe;