import { table } from "console";
var stringSimilarity = require("string-similarity");
const levenSort = require("leven-sort");
const sourceName = "Bill Griffin";

const nameAry = [
  "Bill Griffin",
  "Carl Martinez",
  "Roger Davis",
  "William George",
  "Andrew Torres",
  "Billy Campbell",
  "Alan King",
  "Benjamin Wilson",
  "Dennis Smith",
  "Billy Griffith",
];

table(nameAry);
table(levenSort(nameAry, sourceName));

table(
  nameAry.sort(
    (a, b) =>
      stringSimilarity.compareTwoStrings(nameAry[0], b) -
      stringSimilarity.compareTwoStrings(nameAry[0], a)
  )
);
