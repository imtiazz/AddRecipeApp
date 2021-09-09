import View from './view.js';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _openRecipe = document.querySelector('.nav__btn--add-recipe');
  _closeRecipe = document.querySelector('.btn--close-modal');
  _message = 'Recipe successfully added.';
  //_uploadRecipe = document.querySelector('upload__btn');

  constructor() {
    super();
    this._addHandlerShowRecipe();
    this._addHandlerHideRecipe();
  }
  _btnToggle() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowRecipe() {
    this._openRecipe.addEventListener('click', this._btnToggle.bind(this));
  }

  _addHandlerHideRecipe() {
    this._closeRecipe.addEventListener('click', this._btnToggle.bind(this));
    this._overlay.addEventListener('click', this._btnToggle.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
      // this._parentElement.innerHTML = '';
    });
  }
  _generateMarkup() {}
}
export default new AddRecipeView();

//Notes:
//The Object.fromEntries() method transforms a list of key-value pairs into an object.

// const entries = new Map([
//   ['foo', 'bar'],
//   ['baz', 42]
// ]);

// const obj = Object.fromEntries(entries);

// console.log(obj);
// expected output: Object { foo: "bar", baz: 42 }
