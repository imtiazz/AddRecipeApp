//Notes
// Always try to start with data , so model should be the starting point for programing
// Controller can import from model and view but not vice versa. Control always lies with controller.

//For Build-
//- delete  parcel cache file
//-Replace main with default in package.json
// "build": "parcel build --no-minify index.html --dist-dir ./dist"

//Git
//-Use Git init
//git config --global user.name imtiazz
//git config --global user.email md.imtiazz@gmail.com
//git status --> untracked files
//git log--> to check log
// git add -A -> Add file to the statging area
//untracked files(U)->staging arae(A)-> if modified before commit(m)-> commit
//git commit -m 'second commit' - After adding commit file with comment
//git reset --hard 39c18ee2624be64644c66992c t- to reset to previous commit. It should be avoided
//as it removes the work done after the commit(to which its restored), instead branch should be created
//with new feature
//git branch {branch name}- to create new branch

import * as model from './model.js';
import recipe from './views/recipeView.js';
import searchResult from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

//Below code is polyfilling
//First npm i core-js regenerator-runtime
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipe.spinner();
    //Loading recipe
    resultView.update(model.searchResultPerPage());
    //debugger;
    bookmarkView.update(model.state.bookmark);
    await model.loadRecipe(id);
    recipe.render(model.state.recipe);
    //console.log(model.state.recipe);
  } catch (err) {
    recipe.renderError(err);
    console.log(err);
  }
};

const searchRecipe = async function () {
  try {
    //resultView.spinner();
    const query = searchResult.getQuery();
    if (!query) return;
    resultView.spinner();
    await model.recipeSearchResult(query);
    resultView.render(model.searchResultPerPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const pagination = function (pageNo) {
  //console.log('success');
  resultView.render(model.searchResultPerPage(pageNo));
  paginationView.render(model.state.search);
};

const controlServing = function (serving) {
  model.modelServing(serving);
  //recipe.render(model.state.recipe);
  recipe.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //model.persistBookmarks();
  recipe.update(model.state.recipe);
  bookmarkView.render(model.state.bookmark);
};

const controlPreLoadBookmark = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.spinner();
    await model.uploadRecipe(newRecipe);
    //render recipe
    recipe.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarkView.render(model.state.bookmark);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView._btnToggle();
    }, 2500);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
const init = function () {
  bookmarkView.addHandlerLoadBookmark(controlPreLoadBookmark);
  recipe.addHandlerRender(showRecipe);
  recipe.addHandlerRenderServing(controlServing);
  searchResult.addHandlerSearch(searchRecipe);
  paginationView.addHandlerPagination(pagination);
  recipe.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('learing git');
  console.log('master brach final');
};
init();
