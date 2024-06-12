import { nanoid } from "nanoid";
import books from "./books.js";

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message: `Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount`,
      })
      .code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt: insertedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
  }

  return h
    .response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
};

const getAllBooks = (request) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  if (name && name.trim().length > 0) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (reading && (reading === "1" || reading === "0")) {
    filteredBooks = filteredBooks.filter(
      (book) => book.reading === (reading === "1"),
    );
  }

  if (finished && (finished === "1" || finished === "0")) {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === (finished === "1"),
    );
  }

  return {
    status: "success",
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((item) => item.id === bookId);

  if (book === undefined) {
    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  }

  return {
    status: "success",
    data: {
      book,
    },
  };
};

const editBookById = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  if (index === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200);
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
  }

  books.splice(index, 1);

  return h
    .response({
      status: "success",
      message: "Buku berhasil dihapus",
    })
    .code(200);
};

export { addBook, getAllBooks, getBookById, editBookById, deleteBookById };
