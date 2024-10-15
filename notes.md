
### 10/25/24
If I want to keep the game playable in the terminal, with the boards already randomized, I can:

1. Have the user input coordinates of the ship they wish to place 
2. Check those coordinates against the occupied positions on the gameboard
3. Return the ship that occupies that position. 

From there I can retrieve from the user, the set of coordinates at which the user wants to place the bow of the ship and in what orientation. This would either be successful or face rejection depending on the configurations they select. 

For the UI, the user would be hovering over the gameboard and if they click a ship, it will reorient (if possible). If they click and drag, the ship will move, and only be placed if hovering over a coordinate for the bow that allows the space for the rest of the ship to reside.

What is the common core logic?