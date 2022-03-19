import squares from "../viz/squares.js";
import boxes from "../viz/boxes.js";

/*
	mapping from (string) vizType to the function called to display the viz
	eliminates need for conditionals
*/
const vizMapping = {
	"Squares": squares,
	"Boxes": boxes
}

export default vizMapping;