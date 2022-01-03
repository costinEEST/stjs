import { readFile } from "node:fs";

const count = () => {
  const fileNames = process.argv.slice(2);
  const dict = {
    totalLines: 0,
    totalWords: 0,
  };

  if (!fileNames.length) {
    console.log(
      "Please add the names of the files as arguments when executing this script"
    );

    return;
  }

  for (const file of fileNames) {
    readFile(file, (err, data) => {
      if (err) {
        console.log(err);

        return;
      }

      const linesCounter = data.toString().split("\n").filter(Boolean).length;
      const wordsCounter = data
        .toString()
        .replace(/\r?\n|\r/g, " ")
        .split(" ")
        .map((c) => c.trim())
        .filter(Boolean).length;

      dict[file] = {
        totalLines: linesCounter,
        totalWords: wordsCounter,
      };
      dict.totalLines = dict.totalLines + linesCounter;
      dict.totalWords = dict.totalWords + wordsCounter;
    });
  }
};

console.log(count());
