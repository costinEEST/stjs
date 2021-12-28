import glob from "glob";
import fs from "fs-extra";
import { dirname } from "node:path";

const { stat, ensureDir, copy } = fs;
const [srcRoot, dstRoot] = process.argv.slice(2);

glob(`${srcRoot}/**/*.*`, { ignore: "*~" }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    for (const srcName of files) {
      stat(srcName, (err, stats) => {
        if (err) {
          console.error(err);
        } else if (stats.isFile()) {
          const dstName = srcName.replace(srcRoot, dstRoot);
          const dstDir = dirname(dstName);
          ensureDir(dstDir, (err) => {
            if (err) {
              console.error(err);
            } else {
              copy(srcName, dstName, (err) => {
                if (err) {
                  console.error(err);
                }
              });
            }
          });
        }
      });
    }
  }
});
