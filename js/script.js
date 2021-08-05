document.addEventListener('DOMContentLoaded', function() {
	const submitForm = document.getElementById('book-form-input');
	submitForm.addEventListener('submit', function() {
		event.preventDefault();
		addBook();
	});

	if (isStorageExist()) {
		loadDataFromStorage();
	}
});

document.addEventListener('ondatasaved', () => {
	console.log('Data berhasil disimpan.');
});

document.addEventListener('ondataloaded', () => {
	refreshDataFromBooks();
});

const bookSearch = document.getElementById('book-search');
bookSearch.addEventListener('submit', function(event) {
	event.preventDefault();
	searchBook();
})