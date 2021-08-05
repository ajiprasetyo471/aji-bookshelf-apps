const UNCOMPLETED_LIST_BOOK_ID = "book-list-uncomplete";
const COMPLETED_LIST_BOOK_ID = "book-list-complete";
const BOOK_ITEMID = "itemId";

function addBook() {
	const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const completedBOOKList = document.getElementById(COMPLETED_LIST_BOOK_ID);

	const textTitle = document.getElementById('book-name-input').value;
	const textAuthor = document.getElementById('book-writer-input').value;
	const textYear = document.getElementById('book-year-input').value;
  const bookCheck = document.getElementById('book-check-input').checked;

	const book = makeBook(textTitle, textAuthor, textYear, bookCheck);
  const bookObject = composeBookObject(textTitle, textAuthor, textYear, bookCheck);

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  if (bookCheck) {
    completedBOOKList.append(book);
  } else {
      uncompletedBOOKList.append(book);
  }
  updateDataToStorage()
}

function makeBook(data, author, year, isComplete) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = data;
  const textAuthor = document.createElement("p");
  textAuthor.innerHTML = "Author : " + author;
  const textYear = document.createElement("p");
  textYear.innerHTML = "Year : " + year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book-item")
  textContainer.append(textTitle, textAuthor, textYear);

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('action');

  if(isComplete){
    textContainer.append(
      createUndoButton(), 
      createDeleteButton()
      );
    textContainer.append(btnContainer);
  } else {
      textContainer.append(
        createCompleteButton(), 
        createDeleteButton()
        );
      textContainer.append(btnContainer);
  }
  return textContainer;
}

function createBtn(btnTypeClass , eventListener, txt) {
  const btn = document.createElement("button");
  btn.classList.add("btn", btnTypeClass);
  btn.innerText = txt;
  btn.addEventListener("click", function (event) {
    eventListener(event);
  });
  return btn;
}

function addBookToCompleted(bookElement) {
  const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
  const bookTitle = bookElement.querySelector(".book-item > h3").innerText;
  const bookAuthor = bookElement.querySelectorAll(".book-item > p")[0].innerText.replace('Author : ', '');
  const bookYear = bookElement.querySelectorAll(".book-item > p")[1].innerText.replace('Year : ', '');

  const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isComplete = true;
  newBook[BOOK_ITEMID] = book.id;

  listCompleted.insertBefore(newBook, listCompleted.firstElementChild);
  bookElement.remove();

  updateDataToStorage();
} 

function createCompleteButton() {
  return createBtn("blue", function(event){
    addBookToCompleted(event.target.parentElement);
  }, "Mark finished reading");
}

function removeBookFromCompleted(bookElement) {
  let agree = confirm("Are you agree to delete this book?");
  if (agree) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    bookElement.remove();
    updateDataToStorage();
    alert('Book deleted from the bookshelf!');
  } else {
      return 0;
  }
}

function createDeleteButton() {
  return createBtn("red", function(event){
    removeBookFromCompleted(event.target.parentElement);
  },"Delete book");
}

function undoBookFromCompleted(bookElement){
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const bookTitle = bookElement.querySelector(".book-item > h3").innerText;
  const bookAuthor = bookElement.querySelectorAll(".book-item > p")[0].innerHTML.replace('Author : ', '');
  const bookYear = bookElement.querySelectorAll(".book-item > p")[1].innerHTML.replace('Year : ', '');

  const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isComplete = false;
  newBook[BOOK_ITEMID] = book.id;

  listUncompleted.appendChild(newBook);
  bookElement.remove();

  updateDataToStorage();
}

function createUndoButton() {
  return createBtn("blue", function(event){
    undoBookFromCompleted(event.target.parentElement);
  },"Mark not finished reading");
}

function searchBook() {
  const bookSrcVal = document.getElementById('book-search-input').value;
  const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

  let gets = books.filter((book) => {
    return book.title.includes(bookSrcVal);
  });

  const countCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID).childElementCount;
  const countUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID).childElementCount;

  let i = 0;
  while (i < countCompleted) {
    listCompleted.removeChild(listCompleted.lastElementChild);
    i++;
  }
  i = 0;
  while (i < countUncompleted) {
    listUncompleted.removeChild(listUncompleted.lastElementChild);
    i++;
  }
  for(book of gets) {
    const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
    newBook[BOOK_ITEMID] = book.id;
    if (book.isComplete) {
      listCompleted.append(newBook);
    } else {
      listUncompleted.append(newBook);
    }

  }
}