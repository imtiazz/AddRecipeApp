//import { forEach } from 'core-js/core/array';
import { API_URL, KEY, RESULT_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

import resultView from './views/resultView.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    serving: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredient: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
  } catch (err) {
    throw err; // So that error propogate to controller
  }
};

export const recipeSearchResult = async function (query) {
  try {
    state.search.page = 1;
    const data = await AJAX(`${API_URL}?search=${query}`);
    state.search.result = data.data.recipes.map(el => {
      return {
        id: el.id,
        title: el.title,
        publisher: el.publisher,
        image: el.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const searchResultPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.result.slice(start, end);
};

export const modelServing = function (servings) {
  //const multiplier = Math.ceil(servings / state.recipe.serving);
  state.recipe.ingredient.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.serving;
  });
  state.recipe.serving = servings;
};
//storing in local storage
export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

//Note: While adding pass whole data while deleting only id- General standard
export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  //adding bookmark flag
  //Note- state.recipe.id contains the id of the currently loaded recipe- Very important
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();
export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe); //convert object to array
    const ingredients = Object.entries(newRecipe)
      .filter(
        entries => entries[0].startsWith('ingredient') && entries[1] != ''
      )
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error('wrong ingredient format. Please try again!');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
