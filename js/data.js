const STORAGE_KEY = 'BOOKSHELF_APPS';

let books = [];

function isStorageExist() {
	if (typeof(Storage) === undefined) {
		alert('Your browser not support web storage');
		return false;
	}
	return true;
}

function saveData() {
	const parsed = JSON.stringify(books);
	localStorage.setItem(STORAGE_KEY, parsed);
	document.dispatchEvent(new Event('ondatasaved'));
}

function loadDataFromStorage() {
	const serializeData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializeData);
	if (data !== null) {
		books = data;
	}

	document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
	if (isStorageExist()) {
		saveData();
	}
}

function composeBookObject(title, author, year, isComplete){
	return {
		id: +new Date(),
		title,
		author,
		year,
		isComplete
	};
}

function findBook(bookId) {
	for (book of books) {
		if (book.id === bookId) {
			return book;
		}
	}
	return null;
}

function findBookIndex(bookId) {
	let index = 0;
	for (book of books) {
		if(book.id === bookId) {
			return index
		}

		index++;
	}
	return -1;
}

function refreshDataFromBooks() {
	const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
	const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
	
	for (book of books) {
		const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
		newBook[BOOK_ITEMID] = book.id;

		if (book.isComplete) {
			listCompleted.append(newBook);
		} else {
			listUncompleted.append(newBook);
		}
	}
}