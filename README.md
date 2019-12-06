# CutTheCake

Solution for Codewars problem: Cut the cake - 2 kyu (unfinished)


Task

We have a rectangular cake with some raisins on it:

We need to cut the cake evenly into n small rectangular pieces, so that each small cake has 1 raisin. n is not an argument, it is the number of raisins contained inside the cake:

result should be an array of the pieces:
  [
     ........
     ..o.....
  ,
     ...o....
     ........
  ]
  
// In order to clearly show, we omit the quotes and "\n"

If there is no solution, return an empty array []
Note

The number of raisins is always more than 1 and less than 10.
If there are multiple solutions, select the one with the largest width of the first element of the array. (See also the examples below.)
Evenly cut into n pieces, meaning the same area. But their shapes can be different. (See also the examples below.)
In the result array, the order of pieces is from top to bottom and from left to right (according to the location of the upper left corner).
Each piece of cake should be rectangular.
