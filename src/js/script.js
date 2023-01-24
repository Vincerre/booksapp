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
      this.favoriteBooks = [];
      this.filters = [];
      this.initData();
      this.determineRatingBgc();
      this.getElements();
      this.render();
      this.initActions();
    }

    render() {
      for (const book of this.data) {
        const ratingBgc = this.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        book.ratingBgc = ratingBgc;
        book.ratingWidth = ratingWidth;
        const generatedHTML = templates.listBook(book);
        const bookHTML = utils.createDOMFromHTML(generatedHTML);
        const bookContainer = document.querySelector(select.containerOf.books);
        bookContainer.appendChild(bookHTML);
      }
    }

    getElements() {
      this.bookContainer = document.querySelector(select.containerOf.books);
      this.filter = document.querySelector(select.containerOf.filters);
    }

    initData() {
      this.data = dataSource.books;
    }
    initActions() {
      this.bookContainer.addEventListener('dblclick', function (event) {
        event.preventDefault();
        console.log(event.target);
        console.log('parent', event.target.offsetParent);
        if (event.target.offsetParent.classList.contains('book__image')) {
          const bookId = event.target.offsetParent.getAttribute('data-id');
          if (!this.favoriteBooks.includes(bookId)) {
            event.target.offsetParent.classList.add('favorite');
            this.favoriteBooks.push(bookId);
          } else {
            event.target.offsetParent.classList.remove('favorite');
            this.favoriteBooks.splice(this.favoriteBooks.indexOf(bookId), 1);
            console.log(this.favoriteBooks);
          }
        }
      });

      this.filter.addEventListener('click', function (event) {
        if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
          console.log(event.target.value);
        }
        if (event.target.checked === true) {
          this.filters.push(event.target.value);
        } else {
          this.filters.splice(this.filters.indexOf(event.target.value), 1);
        }
        this.filterBooks();
      });
    }

    filterBooks() {
      for (const book of this.data) {
        let shouldBeHidden = false;
        for (let filter of this.filters) {
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
