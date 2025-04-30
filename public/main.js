/// --- shared data ---
const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", image: "https://covers.openlibrary.org/b/id/8231856-M.jpg", price: 10.99 },
    { title: "1984", author: "George Orwell", image: "https://covers.openlibrary.org/b/id/8091016-M.jpg", price: 9.99 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", image: "https://covers.openlibrary.org/b/id/8319251-M.jpg", price: 10.99 },
    { title: "Pride and Prejudice", author: "Jane Austen", image: "https://covers.openlibrary.org/b/id/8226191-M.jpg", price: 15.99 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", image: "https://covers.openlibrary.org/b/id/8081460-M.jpg", price: 12.99 }
  ];
  
  // --- function for searchBook ---
  function searchBook() {
    const input = document.getElementById("searchInput").value.trim().toLowerCase();
    const match = books.find(book => book.title.toLowerCase() === input);
    
    if (match) {
      localStorage.setItem("selectedBook", JSON.stringify(match));
      window.location.href = "book-details.html";  // Redirect to book details page
    } else {
      alert("Book not found!");
    }
  }
  
  // --- Display books on homepage ---
  window.onload = function() {
    const bookList = document.getElementById("bookList");
  
    books.forEach(book => {
      const bookCard = document.createElement("div");
      bookCard.classList.add("card", "mb-3");
      bookCard.style = "width: 18rem;";
      bookCard.innerHTML = `
        <img src="${book.image}" class="card-img-top" alt="${book.title}">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Author: ${book.author}</p>
          <p class="card-text">Price: $${book.price}</p>
          <a href="#" class="btn btn-primary" onclick="viewBookDetails('${book.title}')">View Details</a>
        </div>
      `;
      bookList.appendChild(bookCard);
    });
  };
  
  // --- Function to view book details ---
  function viewBookDetails(title) {
    const book = books.find(book => book.title === title);
    if (book) {
      localStorage.setItem("selectedBook", JSON.stringify(book));
      window.location.href = "book-details.html";
    }
  }
  