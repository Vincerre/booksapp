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
      const thisBooksList = this;
      thisBooksList.filters = [];
      thisBooksList.favoriteBooks = [];
      this.initData();
      this.getElements();
      this.render();
      this.initActions();
    }

    render() {
      const thisBooksList = this;

      for (const book of this.data) {
        book.ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;
        const generatedHTML = templates.listBook(book);
        const bookHTML = utils.createDOMFromHTML(generatedHTML);
        const bookContainer = document.querySelector(select.containerOf.books);
        bookContainer.appendChild(bookHTML);
      }
    }

    getElements() {
      const thisBooksList = this;

      thisBooksList.bookContainer = document.querySelector(select.containerOf.books);
      thisBooksList.filter = document.querySelector(select.containerOf.filters);
    }

    initData() {
      this.data = dataSource.books;
    }
    initActions() {
      const thisBooksList = this;

      thisBooksList.bookContainer.addEventListener('dblclick', function (event) {
        event.preventDefault();
        console.log(event.target);
        console.log('parent', event.target.offsetParent);
        if (event.target.offsetParent.classList.contains('book__image')) {
          const bookId = event.target.offsetParent.getAttribute('data-id');
          if (!thisBooksList.favoriteBooks.includes(bookId)) {
            event.target.offsetParent.classList.add('favorite');
            thisBooksList.favoriteBooks.push(bookId);
          } else {
            event.target.offsetParent.classList.remove('favorite');
            thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(bookId), 1);
          }
        }
      });

      thisBooksList.filter.addEventListener('click', function (event) {
        thisBooksList.filters = [];
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
          console.log(event.target.value);
        }
        if (event.target.checked === true) {
          thisBooksList.filters.push(event.target.value);
        } else {
          thisBooksList.filters.splice(thisBooksList.filters.indexOf(event.target.value), 1);
        }
        thisBooksList.filterBooks();
      });
    }

    filterBooks() {
      const thisBooksList = this;

      for (const book of this.data) {
        let shouldBeHidden = false;
        for (let filter of thisBooksList.filters) {
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
  new BooksList();
}
