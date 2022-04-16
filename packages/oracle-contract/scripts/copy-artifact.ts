import fs from "fs";
import path from "path";

// source path
const source = ".";
const sourceAbi = `${source}/abis`;
const sourceType = `${source}/typechain`;

// destination path
const dest = "../console-app/src/app/ethereum";
const destAbi = `${dest}/abis`;
const destType = `${dest}/types`;

// targets to copy
const abiFiles = ["Oracle.json"];
const typeFiles = [
  "Oracle.d.ts",
  "VerificationPersonalToken.d.ts",
  "VerificationContractToken.d.ts",
  "common.d.ts",
];

abiFiles.forEach((fileName) => {
  fs.copyFile(
    path.resolve(sourceAbi, fileName),
    path.resolve(destAbi, fileName),
    (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`${fileName}をコピーしました`);
      }
    }
  );
});

typeFiles.forEach((fileName) => {
  fs.copyFile(
    path.resolve(sourceType, fileName),
    path.resolve(destType, fileName),
    (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`${fileName}をコピーしました`);
      }
    }
  );
});
