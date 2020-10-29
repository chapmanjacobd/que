import { readFileSync } from "fs";
import { setItem } from "node-persist";
import { initializeBooks } from "./io";
import { Book } from "./types";
import { err } from "./utils";

export function getText(shelf: Book[], paragraphsPerEmail: number) {
  let currentBook = shelf.filter((x) => !x.finished)[0];

  const bookTxt = readFileSync(currentBook.filename, { encoding: "utf-8" })
    .replace(/(?:\r\n|\r|\n){2,}/g, "\n\n")
    .split("\n\n")
    .map((x) => x.replace(/\n/g, " ").replace(/\s+/g, " "));

  const { endIndex, nextEmailWords } = tryToFillWords({
    bookTxt,
    progress: currentBook.progress,
    paragraphsPerEmail,
  });

  currentBook.progress = endIndex;
  currentBook.finished = endIndex >= bookTxt.length;

  // update reading progress
  setItem(
    "bookList",
    shelf.map((book) => {
      if (book.filename === currentBook.filename) return currentBook;
      return book;
    })
  );

  const percent = ((endIndex / bookTxt.length) * 100).toFixed(0);
  const basename = currentBook.filename.split("/").pop();

  return {
    title: `${basename} (${percent}%)`,
    body: nextEmailWords.join("\n\n"),
  };
}

if (!module.parent)
  (async () => {
    await initializeBooks()
      .then((b) => {
        console.log(getText(b, 5).body);
      })
      .catch(err);
  })();

function tryToFillWords({
  bookTxt,
  progress,
  paragraphsPerEmail,
}: {
  bookTxt: string[];
  progress: number;
  paragraphsPerEmail: number;
}) {
  const tryParagraphs = (paragraphs: number) => {
    const endIndex = progress + paragraphs;

    const nextEmailWords = bookTxt.slice(0 + progress, endIndex);
    return { endIndex, nextEmailWords };
  };

  const MINIMUM_WORDS = 470;

  while (progress + paragraphsPerEmail < bookTxt.length) {
    const attempt = tryParagraphs(paragraphsPerEmail);

    if (attempt.nextEmailWords.join(" ").split(" ").length >= MINIMUM_WORDS) return attempt;

    paragraphsPerEmail++;
  }

  // if we reached the end of the book, return the end ¯\_(ツ)_/¯
  return tryParagraphs(paragraphsPerEmail);
}
