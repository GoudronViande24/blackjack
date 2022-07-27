/**
 * Create a new card
 * @param {String} n - Number of the card
 * @returns {HTMLDivElement} Card to add to the DOM
 */
export function createCard(n) {
	const element = document.createElement("div");
	element.classList.add("m-1", "p-3", "bg-white", "rounded", "fs-1", "text-primary");
	element.innerText = n;

	return element;
}

/**
 * List of possible cards
 * @type {String[]}
 */
export const cards = [
	"A",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"J",
	"Q",
	"K"
];

/**
 * Get a random card
 * @returns {String}
 */
export function randomCard() {
	return cards[Math.floor(Math.random() * cards.length)];
}