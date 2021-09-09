import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerPagination(handler) {
    document
      .querySelector('.pagination')
      .addEventListener('click', function (e) {
        e.preventDefault();
        const btn = e.target.closest('.btn--inline');
        if (!btn) return;
        handler(+btn.dataset.goto); // In HTML name is data-goto but its extracted using goto only
      });
  }
  _generateMarkUP() {
    const curr_Page = this._data.page;
    const numberOfPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );
    //console.log(this._data.page, numberOfPages);
    if (curr_Page === 1 && numberOfPages > 1) {
      // console.log('first page');
      return `<button class="btn--inline pagination__btn--next" data-goto="${
        curr_Page + 1
      }">
      <span>Page ${curr_Page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    //Last Page
    if (curr_Page === numberOfPages && numberOfPages > 1) {
      return `<button class="btn--inline pagination__btn--prev" data-goto="${
        curr_Page - 1
      }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curr_Page - 1}</span>
    </button>`;
    }
    //other page
    if (curr_Page < numberOfPages) {
      console.log('other page');
      return `<button class="btn--inline pagination__btn--prev" data-goto="${
        curr_Page - 1
      }">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curr_Page - 1}</span>
  </button>
  <button class="btn--inline pagination__btn--next" data-goto="${
    curr_Page + 1
  }">
    <span>Page ${curr_Page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
    }
    return '';
  }
}

export default new PaginationView();
