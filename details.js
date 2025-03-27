const publicationDate = document.querySelector("#publication-date");
const author = document.querySelector("#author");
const detailPageTitle = document.querySelector("#detail-page-title");
const description = document.querySelector("#description");
const bookImage = document.querySelector("#book-image");
const buyBtn = document.querySelector("#buyBtn");
const localStorageData = JSON.parse(window.localStorage.getItem("books"));
// console.log(localStorageData);
function getIdParam() {
  address = window.location.search;

  parameterList = new URLSearchParams(address);

  return parameterList.get("id");
}
const id = getIdParam();
const book = localStorageData.find((item) => item.id == id);
function checkId() {
  if (!id || !localStorageData || !book) {
    window.location.href = "./notFound.html";
    return;
  }
}
checkId();
function setDataToElement() {
  console.log(book);

  publicationDate.innerText = book.volumeInfo.publishedDate;
  author.innerText = book.volumeInfo.authors.join(",");
  detailPageTitle.innerText = book.volumeInfo.title;
  description.innerText = book.volumeInfo.description;
  bookImage.src = book.volumeInfo.imageLinks.thumbnail;
  buyBtn.addEventListener("click", () => {
    window.location.href = book.saleInfo.buyLink;
  });
}
setDataToElement();
