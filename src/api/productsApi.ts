import axios from 'axios';

export const fetchProducts = async () => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    console.log(response);

    return response.data.meals.map((meal: any) => ({
      id: meal.idMeal,
      name: meal.strMeal,
      description: meal.strInstructions,
      image: meal.strMealThumb,
      liked: false,
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error('Failed to fetch products');
  }
};