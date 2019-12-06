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
  //console.log(numRaisins);
  pattern = /[o.]/g;
  cakeSize = cake.match(pattern).length;
  sliceSize = cakeSize / numRaisins;
  if (sliceSize != Math.floor(sliceSize)) {return []};
  let possSlices = possibleSlices(cakeGrid, sliceSize);
  let sliceList = [];

  //check slices
  let solution = checkSlices(cakeGrid, possSlices, numRaisins, sliceList, [], 0)
  //if (solution.length > numRaisins) {
  //  solution.pop();
  //}

  //process solutions
  if (!solution) {
    return []
  }
  return solution.map(slice => {
    return showSlice(slice[0], cakeGrid, slice[1]);
  })
}

function checkSlices(cakeGrid, possSlices, numRaisins, sliceList, solutions, level) {
  let chkLoc = findNextSliceStart(sliceList, cakeGrid);
  console.log(level, chkLoc, sliceList);
  assert(level == sliceList.length);
  //calculate next available top left start location for slice
  //no free points found, so cake completely sliced
  if (chkLoc == -1) {
    //exit and return list of slices
    return sliceList;
  }
  //check all possible slices in order
  for (let i = 0; i < possSlices.length; i++) {
    //if slice is valid (1 raisin and all within cake)
    if (checkSlice(chkLoc, cakeGrid, possSlices[i]) &&
        checkNoOverlap(chkLoc, possSlices[i], sliceList)) {
      //current level slice set to slice being checked
      //console.log('add slice')
      sliceList[level] = [chkLoc, possSlices[i]];
      //find next slice
      checkSlices(cakeGrid, possSlices, numRaisins, sliceList, solutions, level + 1);
      if (findNextSliceStart(sliceList, cakeGrid) == -1) {
        //console.log('found answer');
        return sliceList
      } else {
        //not found solution, so remove last slice
        //console.log('remove slice')
        sliceList.pop();
      }
      //console.log('removing slice', findNextSliceStart(sliceList, cakeGrid));
      //let nextSliceStart = findNextSliceStart(sliceList, cakeGrid);
      //if (nextSliceStart == -1) {
      //} else {
        //let nextSlice =
        //if (nextSlice) {
        //  console.log(nextSlice[0])//, nextSlice[0], cakeGrid, nextSlice[1]);
        //  return nextSlice;
    }
  }
}

//finds next non slice location
function findNextSliceStart(sliceList, cakeGrid) {
  for (y = 0; y < cakeGrid.length; y++) {
    for (x = 0; x < cakeGrid[0].length; x++) {
      if (sliceList.filter(slice => {
        return x >= slice[0][0] &&
               x < slice[0][0] + slice[1][0] &&
               y >= slice[0][1] &&
               y < slice[0][1] + slice[1][1]
      }).length == 0){return [x, y]}
    }
  }
  return -1;
}

//returns a slice from location and size
function showSlice(pos, cakeGrid, slice) {
  return cakeGrid
    .slice(pos[1], pos[1] + slice[1])
    .map(row => row.slice(pos[0], pos[0] + slice[0]))
    .join('\n')
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

function checkNoOverlap(chkLoc, possSlice, sliceList) {
  if (!sliceList.length) {
    return true;
  }
  return sliceList.reduce((check, slice) => {
    if (chkLoc[0] >= slice[0][0] + slice[1][0]) {
      return true && check;
    } else if (chkLoc[0] + possSlice[0] <= slice[0][0]) {
      return true && check;
    } else if (chkLoc[1] >= slice[0][1] + slice[1][0]) {
      return true && check;
    } else if (chkLoc[1] + possSlice[1] <= slice[1][0]) {
      return true && check;
    } else {
      //console.log('-----', chkLoc, possSlice, slice);
      return false;
    }
  }, true)
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
/*
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
'......\n......\n......\n......\n......\n......\n......\n...o..', [ [ 0, 0 ], [ 6, 8 ] ]
'o.......................\n........................',             [ 6, 0 ], [ 24, 2 ] ]
'......\n......\n......\n......\n......\n......\n......\n..o...', [ [ 30, 0 ], [ 6, 8 ] ],
'......\n......\n......\n......\n....o.\n......\n......\n......', [ [ 36, 0 ], [ 6, 8 ] ],
'................\n.o..............\n................',           [ [ 6, 2 ], [ 16, 3 ] ],
'........\n........\n.o......\n........\n........\n........',     [ [ 22, 2 ], [ 8, 6 ] ]
'............o...\n................\n................'],          [ [ 6, 5 ], [ 16, 3 ] ]

instead got: [
'......\n......\n......\n......\n......\n......\n......\n...o..',
'o.......................\n........................',
'......\n......\n......\n......\n......\n......\n......\n..o...',
'......\n......\n......\n......\n....o.\n......\n......\n......',
'................\n.o..............\n................',
'................\n................\n.o..............',
'............o...\n................\n................']
*/

var cake =
`................
.....o..........
................
...............o
................
................
................
.....o..o.....o.
................
................
...o............
................
................
...............o
................
.o..............`


var result= [
'................\n'+       //[ [ [ 0, 0 ], [ 16, 2 ] ],
'.....o..........',
'................\n'+       //[ [ 0, 2 ], [ 16, 2 ] ],
'...............o',

'........\n'+             
'........\n'+
'........\n'+
'.....o..',

'....\n'+
'....\n'+
'....\n'+
'o...\n'+
'....\n'+
'....\n'+
'....\n'+
'....',

'....\n'+
'....\n'+
'....\n'+
'..o.\n'+
'....\n'+
'....\n'+
'....\n'+
'....',

'........\n'+
'........\n'+
'...o....\n'+
'........',

'................\n'+
'...............o',

'................\n'+
'.o..............']

cutCake = cut(cake);
console.log(cutCake);
console.log('\n');
console.log(result);
