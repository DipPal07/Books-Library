const cardType = document.querySelector("#toggle-book-card");
const sortByTitle = document.querySelector("#title-sort");
const sortByPublicationDate = document.querySelector("#publication-sort");
const search = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
const next = document.querySelector("#next");
const previous = document.querySelector("#previous");
const currentPage = document.querySelector("#current-page");
let localStorageCardType = localStorage.getItem("cardType");
let libraryData = [];
let totalPages = 0;
let page = 1;
search.addEventListener("input", () => {
  const searchData = search.value;
  const searchFilterData = libraryData.filter((item) => {
    y =
      item.volumeInfo.title.toLowerCase().match(searchData.toLowerCase()) ||
      item.volumeInfo.authors.filter((item) => {
        const x = item
          .trim()
          .toLowerCase()
          .match(searchData.trim().toLowerCase());
        return x;
      }).length;

    return y ? true : false;
  });
  createBookCards(searchFilterData);
});
sortByPublicationDate.addEventListener("change", (e) => {
  if (e.target.value === "a-z") {
    // Sort by date (Descending: Newest to Oldest)
    libraryData.sort(
      (a, b) =>
        new Date(b.volumeInfo.publishedDate) -
        new Date(a.volumeInfo.publishedDate)
    );
    createBookCards(libraryData);
  } else {
    libraryData.sort(
      (a, b) =>
        new Date(a.volumeInfo.publishedDate) -
        new Date(b.volumeInfo.publishedDate)
    );
    createBookCards(libraryData);
  }
});
sortByTitle.addEventListener("change", (e) => {
  console.log(e.target.value);
  if (e.target.value === "a-z") {
    libraryData.sort((a, b) =>
      a.volumeInfo.title.localeCompare(b.volumeInfo.title, undefined, {
        sensitivity: "base",
      })
    );
    createBookCards(libraryData);
  } else {
    // Descending order (Z → A)
    libraryData.sort((a, b) =>
      b.volumeInfo.title.localeCompare(a.volumeInfo.title, undefined, {
        sensitivity: "base",
      })
    );
    createBookCards(libraryData);
  }
});

function setCardToGrid() {
  const bookCard = document.querySelectorAll(".book-card");

  const cardImage = document.querySelectorAll(".book-image");
  bookCard.forEach((item) => {
    item.classList.replace("book-card-list", "book-card-grid");
  });
  cardImage.forEach((item) => {
    item.classList.replace("book-image-list", "book-image-grid");
  });
}
function setCardToList() {
  const bookCard = document.querySelectorAll(".book-card");
  const cardImage = document.querySelectorAll(".book-image");
  bookCard.forEach((item) => {
    item.classList.replace("book-card-grid", "book-card-list");
  });
  cardImage.forEach((item) => {
    item.classList.replace("book-image-grid", "book-image-list");
  });
}
if (localStorageCardType) {
  if (localStorageCardType === "grid") {
    cardType.checked = false;
  } else {
    cardType.checked = true;
  }
}
cardType.addEventListener("input", function (e) {
  if (this.checked) {
    setCardToList();
    window.localStorage.setItem("cardType", "list");
  } else {
    setCardToGrid();
    window.localStorage.setItem("cardType", "grid");
  }
});

function createBookCards(books) {
  let cardType = window.localStorage.getItem("cardType");
  if (!cardType) {
    cardType = "grid";
  } else {
    cardType = cardType === "grid" ? "grid" : "list";
  }
  const container = document.getElementById("book-container");
  container.innerHTML = "";

  books.forEach((book) => {
    const { title, authors, publishedDate, description, imageLinks } =
      book.volumeInfo;

    const bookCard = document.createElement("div");
    bookCard.addEventListener("click", (e) => {
      window.location.href = `./book-details.html?id=${book.id}`;
    });
    bookCard.className = `book-card ${
      cardType === "grid" ? "book-card-grid" : "book-card-list"
    }`;

    bookCard.innerHTML = `
            <div class="book-image-container">
                <img class="book-image ${
                  cardType === "grid" ? "book-image-grid" : "book-image-list"
                }" src="${
      imageLinks?.smallThumbnail || "default-image.jpg"
    }" alt="${title}">
            </div>
            <div class="book-card-body">
                <p class="book-card-published">${
                  publishedDate || "Unknown Date"
                }</p>
                <p class="book-card-author">${
                  authors ? authors.join(", ") : "Unknown Author"
                }</p>
                <p class="book-card-title">${title}</p>
                <p class="book-card-description">${
                  description || "No description available."
                }</p>
            </div>
        `;

    container.appendChild(bookCard);
  });
}
function fetchBooks(page = 1) {
  fetch(`https://api.freeapi.app/api/v1/public/books?page=${page}`)
    .then((data) => data.json())
    .then((data) => {
      libraryData = data.data.data;
      totalPages = parseInt(data.data.totalPages);
      createBookCards(libraryData);
      window.localStorage.setItem("books", JSON.stringify(libraryData));
    })
    .catch((e) => {
      console.log(e);
    });
}

fetchBooks();

next.addEventListener("click", () => {
  if (totalPages < page + 1) {
    return;
  }

  fetchBooks(++page);
  disableNavigation();
  currentPage.innerText = `Current page : ${page}`;
  next.innerText = `next : ${page + 1}`;
  previous.innerText = `previous : ${page - 1}`;
});
function disableNavigation() {
  console.log(page);

  if (page === 1) {
    previous.disabled = true;
    next.disabled = false;
  } else if (page == totalPages) {
    previous.disabled = false;
    next.disabled = true;
  } else {
    previous.disabled = false;
    next.disabled = false;
  }
}
previous.addEventListener("click", () => {
  if (page < 2) {
    return;
  }

  fetchBooks(--page);
  disableNavigation();
  currentPage.innerText = `Current page : ${page}`;
  next.innerText = `next : ${page + 1}`;
  previous.innerText = `previous : ${page - 1}`;
});
