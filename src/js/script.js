/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  ('use strict');

  const select = {
    templateOf: {
      booksList: '#template-book',
    },
    containerOf: {
      books: '.books-list',
      filters: '.filters',
    },
    image: {
      bookCover: '.book_image',
    },
  };

  const templates = {
    listBook: Handlebars.compile(document.querySelector(select.templateOf.booksList).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBookslist = this;
      thisBookslist.filters = [];
      this.initData();
      this.getElements();
      this.render();
      this.initActions();
    }

    render() {
      const thisBookslist = this;

      for (const book of this.data) {
        book.ratingBgc = thisBookslist.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;
        const generatedHTML = templates.listBook(book);
        const bookHTML = utils.createDOMFromHTML(generatedHTML);
        const bookContainer = document.querySelector(select.containerOf.books);
        bookContainer.appendChild(bookHTML);
      }
    }

    getElements() {
      const thisBookslist = this;

      thisBookslist.bookContainer = document.querySelector(select.containerOf.books);
      thisBookslist.filter = document.querySelector(select.containerOf.filters);
      thisBookslist.filters = [];
      thisBookslist.favoriteBooks = [];
    }

    initData() {
      this.data = dataSource.books;
    }
    initActions() {
      const thisBookslist = this;

      const favoriteBooks = [];
      thisBookslist.bookContainer.addEventListener('dblclick', function (event) {
        event.preventDefault();
        console.log(event.target);
        console.log('parent', event.target.offsetParent);
        if (event.target.offsetParent.classList.contains('book__image')) {
          const bookId = event.target.offsetParent.getAttribute('data-id');
          if (!favoriteBooks.includes(bookId)) {
            event.target.offsetParent.classList.add('favorite');
            favoriteBooks.push(bookId);
          } else {
            event.target.offsetParent.classList.remove('favorite');
            favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1);
          }
        }
      });

      thisBookslist.filter.addEventListener('click', function (event) {
        thisBookslist.filters = [];
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
          console.log(event.target.value);
        }
        if (event.target.checked === true) {
          thisBookslist.filters.push(event.target.value);
        } else {
          thisBookslist.filters.splice(thisBookslist.filters.indexOf(event.target.value), 1);
        }
        thisBookslist.filterBooks();
      });
    }

    filterBooks() {
      const thisBookslist = this;

      for (const book of this.data) {
        let shouldBeHidden = false;
        for (let filter of thisBookslist.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        const bookImage = document.querySelector('.book__image[data-id="' + book.id + '"]');
        if (shouldBeHidden === true) {
          bookImage.classList.add('hidden');
        } else {
          bookImage.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {
      let ratingBgc = '';
      if (rating < 6) {
        ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return ratingBgc;
    }
  }
  const app = new BooksList();
}
