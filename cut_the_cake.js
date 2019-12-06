var assert  = require('assert');

function addSlice(x, y, width, height) {
  slicesList.push({'x': x, 'y': y, 'width': width, 'height': height})
}

function makeCakeGrid(cake) {
  return cake.split('\n');
}

function cut(cake){
  let cakeGrid = makeCakeGrid(cake);
  let raisins = findRaisins(cakeGrid);
  numRaisins = raisins.length;
  pattern = /[o.]/g;
  cakeSize = cake.match(pattern).length;
  sliceSize = cakeSize / numRaisins;
  if (sliceSize != Math.floor(sliceSize)) {return []};
  let possSlices = possibleSlices(cakeGrid, sliceSize);
  let sliceList = [];
  //let solutions = [];



  //check slices
  let solution = checkSlices(cakeGrid, possSlices, numRaisins, sliceList, [], 0)
  if (solution.length > numRaisins) {
    solution.pop();
  }
/*
  //console.log(solutions);
  let sol = solutions.reduce((res, solution, idx) => {
    if (solution[0][1][0] > res) {
      res = idx;
    }
  }, -1)
  console.log(sol, solutions[sol]);
  return solutions[sol];
*/
  //process solutions
  //console.log(solution);
  if (!solution) {
    return []
  }

  return solution.map(slice => {
    return showSlice(slice[0], cakeGrid, slice[1]).join('\n');
  }) //.join('\n');
  //return 'ended';
}

//calculates total area of slices
function areaSlices(sliceList) {
  return sliceList.reduce((sum, slice) => {
    return sum += slice[1][0] * slice[1][1];
  }, 0)
}


function checkSlices(cakeGrid, possSlices, numRaisins, sliceList, solutions, level) {
  for (let i = 0; i < possSlices.length; i++) {
    //console.log('----chk');
    let chkLoc = findNextSliceStart(sliceList, cakeGrid);
    //console.log(i, possSlices[i], checkSlice(chkLoc, cakeGrid, possSlices[i]), sliceList, sliceList.length, numRaisins, level)
    if (checkSlice(chkLoc, cakeGrid, possSlices[i])) {
      sliceList[level] = [chkLoc, possSlices[i]];
      let nextSliceStart = findNextSliceStart(sliceList, cakeGrid);
      //console.log(`Found slice at: ${chkLoc}. Slice is: ${possSlices[i]}`);
      //console.log(`New check location: ${nextSliceStart}`);
      //console.log(`Current slices: ${sliceList}`);
      if (nextSliceStart == -1) {
        //console.log('Cake fully sliced');
        //console.log(sliceList);
        return sliceList;
      } else {
        //console.log('Checking next slice');
        let nextSlice = checkSlices(cakeGrid, possSlices, numRaisins, sliceList, solutions, level + 1);
        //console.log(level, nextSlice, i);
        if (nextSlice) {
          return nextSlice;
        }
      }

      /*
      //sliceList.push([chkLoc, possSlices[i]]);
      console.log(`Current slices: ${sliceList}`);
      //let nextSliceStart = findNextSliceStart(sliceList, cakeGrid);
      console.log(`New check location: ${nextSliceStart}`);
      if (nextSliceStart != -1) {
        checkSlices(nextSliceStart, cakeGrid, possSlices, numRaisins, sliceList, solutions)
      } else {
        console.log(`All cake sliced: answer = ${sliceList}`)
        solutions.push(sliceList);
        return solutions;
      }
      */
    }
  }
  //console.log(solutions);
  sliceList.pop();
  return false;
}

//finds next non slice location
function findNextSliceStart(sliceList, cakeGrid) {
  for (y = 0; y < cakeGrid.length; y++) {
    for (x = 0; x < cakeGrid[0].length; x++) {
      if (sliceList.filter(slice => {
        //console.log(x, y, slice);
        return x >= slice[0][0] &&
               x < slice[0][0] + slice[1][0] &&
               y >= slice[0][1] &&
               y < slice[0][1] + slice[1][1]
      }).length == 0){return [x, y]}
    }
  }
  return -1;
}

function showSlice(chkLoc, cakeGrid, possSlice) {
  return cakeGrid
    .slice(chkLoc[1], chkLoc[1] + possSlice[1])
    .map(row => row.slice(chkLoc[0], chkLoc[0] + possSlice[0]))
}

//checks if a slice contains only one raisin and if slice is within cake
function checkSlice(chkLoc, cakeGrid, possSlice) {
  let chkSlice = cakeGrid
                  .slice(chkLoc[1], chkLoc[1] + possSlice[1])
                  .map(row => row.slice(chkLoc[0], chkLoc[0] + possSlice[0]))
  let pattern = /[o]/g;
  chkRaisins = chkSlice.join('').match(pattern);
  if (!chkRaisins ||
      chkRaisins.length > 1 ||
      chkLoc[0] + possSlice[0] > cakeGrid[0].length ||
      chkLoc[1] + possSlice[1] > cakeGrid.length) {
    return false;
  } else {
    return true;
  }
}

//finds the position of raisins in the cake grid
function findRaisins(cakeGrid) {
  let raisins = []
  let regex1 = RegExp(/o/g), match;
  for (let i = 0 ; i < cakeGrid.length; i++) {
    while ((match = regex1.exec(cakeGrid[i])) !== null) {
      raisins.push([regex1.lastIndex - 1, i])
    }
  }
  return raisins;
}

//calculates possible slice shapes based on size and cake grid
function possibleSlices(cakeGrid, sliceSize) {
  possSlices = [];
  for (width = sliceSize; width >= 1; width--) {
    let height = sliceSize / width;
    if(sliceSize % width == 0 && cakeGrid[0].length >= width && cakeGrid.length >= height) {
      possSlices.push([width, height]);
    }
  }
  return possSlices;
}

//Tests

var cake =
`........
..o.....
...o....
........`

var result =
[
`........
..o.....`,

`...o....
........`
]

//check possibleSlices
var testCake = makeCakeGrid(cake);
testSlice = possibleSlices(testCake, 32);
assert(testSlice[0][0] == 8);
assert(testSlice[0][1] == 4);
testSlice = possibleSlices(testCake, 4);
assert(testSlice[2][0] == 1);
assert(testSlice[2][1] == 4);
assert(testSlice[1][0] == 2);
assert(testSlice[1][1] == 2);
assert(testSlice[0][0] == 4);
assert(testSlice[0][1] == 1);
testSlice = possibleSlices(testCake, 3);
assert(testSlice[1][0] == 1);
assert(testSlice[1][1] == 3);
assert(testSlice[0][0] == 3);
assert(testSlice[0][1] == 1);

//check findRaisins
testRaisins = findRaisins(testCake);
assert(testRaisins[0][0] == 2);
assert(testRaisins[0][1] == 1);
assert(testRaisins[1][0] == 3);
assert(testRaisins[1][1] == 2);

//checkSlices
assert(checkSlice([0,0], testCake, [3,2]) == true); //1 raisin
assert(checkSlice([0,1], testCake, [2,2]) == false);// 0 raisins
assert(checkSlice([1,1], testCake, [3,3]) == false);// 2 raisins

//Finds next point to check slices
//1 slice
let testSlices = [ [ [0,0], [2,2] ] ];
let nextSliceStart = findNextSliceStart(testSlices, testCake);
//console.log(nextSliceStart);
assert(nextSliceStart[0] == 2);
assert(nextSliceStart[1] == 0);
//2 slices full row
testSlices = [ [ [0,0], [4,1] ], [ [4,0], [4,1] ] ];
nextSliceStart = findNextSliceStart(testSlices, testCake);
//console.log(nextSliceStart);
assert(nextSliceStart[0] == 0);
assert(nextSliceStart[1] == 1);
//no empty spaces
testSlices = [ [ [0,0], [4,8] ], [ [4,0], [4,8] ] ];
nextSliceStart = findNextSliceStart(testSlices, testCake);
assert(nextSliceStart == -1);

//check slice area
testSlices = [ [ [0,0], [2,2] ] ];
assert(areaSlices(testSlices) == 4);
testSlices = [ [ [1,3], [4,1] ], [ [0,7], [1,3] ], [ [7,8], [2,5] ] ];
assert(areaSlices(testSlices) == 17);

/*
cutCake = cut(cake);
console.log(cutCake);
//for (i = 0; i < result.length; i++) {
//  assert(cutCake[i] == result[i])
//}

var cake =
`.o......
......o.
....o...
..o.....`

cutCake = cut(cake);
console.log(cutCake);

var cake =
`.o.o....
........
....o...
........
.....o..
........`

cutCake = cut(cake);
console.log(cutCake);


var cake =
`.o.o....
.o.o....
........
........`

cutCake = cut(cake);
console.log(cutCake);

var cake =
`.o....o.
.o....o.
........
o..oo..o`

cutCake = cut(cake);
console.log(cutCake);

var cake =
`............................................................
.............................o..............................
..................o.........................o...............
........................................o...................
............................................................
...........o......................o.........................
............................................................
..........................................................o.
........o...................................................
....o......................................o................`

cutCake = cut(cake);
console.log(cutCake);
*/

/*
Expected:
['......\n......\n......\n......\n......\n......\n......\n......\n......\n....o.',
'..............................\n.......................o......',
'......\n......\n......\n....o.\n......\n......\n......\n......\n......\n......',
'............\n............\n..o.........\n............\n............',
'......\n......\n......\n......\n......\n......\n......\n....o.\n......\n......',
'............o.................\n..............................',
'....................\n.....o..............\n....................',
'..........\n........o.\n..........\n..........\n..........\n..........',
'............\n............\n............\n............\n.o..........',
'....................\n..o.................\n....................']

instead got:
['......\n......\n......\n......\n......\n......\n......\n......\n......\n....o.',  Y
'..............................\n.......................o......',                   Y
'......\n......\n......\n....o.\n......\n......\n......\n......\n......\n......',   Y
'............\n............\n..o.........\n............\n............',             Y
'......\n......\n......\n......\n......\n......\n......\n....o.\n......\n......',   Y
'............o.................\n..............................',                   Y
'....................\n.....o..............\n....................',                 Y
'...............\n........o......\n...............\n...............',               Y
'............\n............\n............\n............\n.o..........',             Y
'....................\n..o.................\n....................',                 Y
'..............................\n.................o............'] ?
*/

cake =
`......o...................................
..........................................
..........................................
.......o..................................
.......................o................o.
..................o.......................
..........................................
...o............................o.........`

cutCake = cut(cake);
console.log(cutCake);

/*
Expected:[
'......\n......\n......\n......\n......\n......\n......\n...o..',
'o.......................\n........................',
'......\n......\n......\n......\n......\n......\n......\n..o...',
'......\n......\n......\n......\n....o.\n......\n......\n......',
'................\n.o..............\n................',
'........\n........\n.o......\n........\n........\n........',
'............o...\n................\n................'],

instead got: [
'......\n......\n......\n......\n......\n......\n......\n...o..',
'o.......................\n........................',
'......\n......\n......\n......\n......\n......\n......\n..o...',
'......\n......\n......\n......\n....o.\n......\n......\n......',
'................\n.o..............\n................',
'................\n................\n.o..............',
'............o...\n................\n................']
*/
