import { glob } from "glob";
import shelf from "node-persist";
import { Book } from "./types";

const defaultBookObject = (filename: string) => {
  return { filename, progress: 0, finished: false };
};

export function getListOfFiles(folder: string) {
  return glob.sync(folder).map(defaultBookObject);
}

export async function initializeBooks(): Promise<Book[]> {
  await shelf.init({ dir: "book-status" });

  const cart: Book[] = await shelf.getItem("bookList");
  const booksDir: Book[] = getListOfFiles("./books/**/*.txt");

  const bookList = booksDir.map(
    (newBook) => cart?.find((known) => newBook.filename === known.filename) ?? newBook
  );

  await shelf.setItem("bookList", bookList);

  return bookList;
}

if (!module.parent)
  (async () => {
    console.log(await initializeBooks());
  })();
