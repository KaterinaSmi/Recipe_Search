const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe'); // Import the Recipe model
const path = require('path'); // Required for serving frontend assets

const app = express();
const PORT = process.env.PORT || 3009;

// Load environment variables
require('dotenv').config();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully' + process.env.MONGODB_URI);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Routes

// GET route to fetch all saved recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// POST route to save a recipe (user selects recipe to save)
app.post('/api/recipes/add', async (req, res) => {
  try {
    // Destructure the necessary recipe data from req.body
    const { title, image, ingredients, steps} = req.body;
    console.log(req.body)

    // Create a new recipe object using the passed data
    const newRecipe = new Recipe({
      title: title,
      image: image,
      ingredients: ingredients, 
      steps: steps
    });

    // Save the new recipe to MongoDB
    await newRecipe.save();

    // Send the newly added recipe back as the response
    res.status(201).json(newRecipe); // Return the newly added recipe
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ error: 'Failed to add recipe' });
  }
});


// PUT route for updating a saved recipe
app.put('/api/recipes/update/:id', async (req, res) => {
  console.log('Request Body:', req.body);  
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// DELETE route for deleting a saved recipe
app.delete('/api/recipes/delete/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).send('Recipe deleted');
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// Middleware to serve frontend assets (for production builds)
app.use(express.static('dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
