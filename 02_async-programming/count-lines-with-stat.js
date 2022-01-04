import { lstat, readFile } from "node:fs/promises";
import { promisify } from "node:util";

import glob from "glob";

const statPair = (fileName) =>
  new Promise((resolve, reject) => {
    lstat(fileName)
      .then((res) => resolve({ fileName, isFile: res.isFile() }))
      .catch((err) => reject(err));
  });

const lineCount = (fileName) =>
  new Promise((resolve, reject) => {
    readFile(fileName, { encoding: "utf-8" })
      .then((data) =>
        resolve({
          name: fileName,
          lines: data.split("\n").length - 1,
        })
      )
      .catch((err) => reject(err));
  });

const count = async (srcDir = process.argv[2]) => {
  if (!srcDir) {
    console.log(
      "Please write the name of the dir, when executing this script!"
    );

    return;
  }

  const pGlob = promisify(glob);
  const files = await pGlob(`${srcDir}/**/*.*`);
  const pairs = await Promise.all(
    files
      .filter((x) => !x.includes("node_modules"))
      .map(async (fileName) => await statPair(fileName))
  );
  const filtered = pairs
    .filter((pair) => pair.isFile)
    .map((pair) => pair.fileName);

  const counts = await Promise.all(
    filtered.map(async (file) => await lineCount(file))
  );

  counts.forEach(({ name, lines }) =>
    console.log(`${lines} lines in '${name}'`)
  );
};

count();
