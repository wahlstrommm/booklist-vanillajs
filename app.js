class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  addBookToLIst(book) {
    const list = document.getElementById('book-list');
    //create element
    const row = document.createElement('tr');
    //inser cols
    row.innerHTML = `<td>${book.title}</td> <td>${book.author}</td><td>${book.isbn}</td><td><a href=# class=delete>X</a></td>`;
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

//localstorage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => {
      const uI = new UI();
      uI.addBookToLIst(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}
//dom load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);
//event listeners
document.getElementById('book-form').addEventListener('submit', function (e) {
  //get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  const book = new Book(title, author, isbn);

  const uI = new UI();

  //validate
  if (title === '' || author === '' || isbn === '') {
    //error
    uI.showAlert('Fyll i alla fälten ', 'error');
  } else {
    uI.addBookToLIst(book);
    //add to LS
    Store.addBook(book);

    uI.showAlert('Boken har lagts till i listan', 'success');
    //clear fields
    uI.clearFields();
  }
  e.preventDefault();
});

//event lister for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  const uI = new UI();
  uI.deleteBook(e.target);
  //remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  uI.showAlert('Bok raderad', 'success');
  e.preventDefault();
});
