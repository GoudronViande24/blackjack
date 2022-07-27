import { createCard, randomCard } from "./card.js";
import error from "./error.js";

let balance = 500;
let bet = 0;
let playing = false;

/** @type {String[]} */
const bankCards = [];

/** @type {String[]} */
const playerCards = [];

/**
 * Elements to target by ID faster
 * @type {Object<string, HTMLElement>}
 */
const elements = {};

[
	10,
	20,
	50,
	100
].forEach(n => {
	const id = "bet-" + n;
	const element = document.getElementById(id);
	elements[id] = element;

	element.addEventListener("click", () => addBet(n));
});

[
	"bet",
	"reset",
	"bank-cards",
	"bank-total",
	"player-cards",
	"player-total",
	"player-bet",
	"player-balance"
].forEach(id => elements[id] = document.getElementById(id));

// Reset bet button
elements["reset"].addEventListener("click", () => {
	if (playing) return;

	balance += bet;
	bet = 0;
	update();
});

// Confirm bet button
elements["bet"].addEventListener("click", () => {
	if (playing) return;
	if (!bet) return error("You must bet some money!");

	playing = true;
	startGame();
});

/**
 * Add a bet from balance
 * @param {Number} bet - The bet to add
 */
function addBet(toBet) {
	if (playing) return;
	if (toBet > balance) return error("You do not have enough money!");

	balance -= toBet;
	bet += toBet;
	update();
}

/** Update UI with up-to-date values */
function update() {
	elements["player-bet"].innerText = bet;
	elements["player-balance"].innerText = balance;
	elements["bank-total"].innerText = getTotal("bank");
	elements["player-total"].innerText = getTotal("player");

	elements["bank-cards"].innerHTML = "";
	elements["player-cards"].innerHTML = "";

	for (const card of bankCards) {
		elements["bank-cards"].appendChild(createCard(card));
	}

	for (const card of playerCards) {
		elements["player-cards"].appendChild(createCard(card));
	}
}

/** Start a game */
async function startGame() {
	playerCards.push(randomCard());
	update();

	let playerIsPlaying = true;
	while (playerIsPlaying) {
		const action = await playerAction();

		switch (action) {
			case "hit":
				playerCards.push(randomCard());
				break;

			case "stay":
				playerIsPlaying = false;
				break;

			case "double":
				if (bet > balance) {
					error("You don't have enough money left!");
					break;
				}

				balance -= bet;
				bet *= 2;
				playerCards.push(randomCard());
				playerIsPlaying = false;
				break;
		}

		update();

		if (getTotal("player") > 21) break;
	}

	if (getTotal("player") > 21) {
		error("You lost.");
		return resetGame();
	}

	while (true) {
		bankCards.push(randomCard());
		update();
		const bankTotal = getTotal("bank");
		const playerTotal = getTotal("player");

		if (bankTotal > 21) {
			error("You won!");
			balance += bet * 2;
			break;
		}

		if (bankTotal > 15) {
			if (bankTotal > playerTotal) {
				error("You lost.");
			} else if (bankTotal < playerTotal) {
				error("You won!");
				balance += bet * 2;
			} else {
				error("Tie!");
				balance += bet;
			}

			break;
		}
	}

	resetGame();
}

/**
 * Get the move of the player
 * @returns {Promise<"stay"|"hit"|"double">} Action the player want to do
 */
function playerAction() {
	const actions = [
		"stay",
		"hit",
		"double"
	];

	/** @type {Object<string, Function>} */
	const functions = {};

	return new Promise(resolve => {
		for (const action of actions) {
			const fn = () => {
				for (const action of actions) {
					document.getElementById(action).removeEventListener("click", functions[actions]);
				}

				resolve(action);
			}

			functions[action] = fn;
			document.getElementById(action).addEventListener("click", fn);
		}
	});
};

/** Reset the cards and be ready for a new game */
function resetGame() {
	bet = 0;
	bankCards.length = 0;
	playerCards.length = 0;
	bankCards.push(randomCard());
	playerCards.push(randomCard());
	update();
	playing = false;
}

resetGame();

/**
 * Get total value of cards
 * @param {"bank"|"player"} who 
 * @returns {Number}
 */
function getTotal(who) {
	/** @type {String[]} */
	let cards;
	let total = 0;

	switch (who) {
		case "bank":
			cards = bankCards;
			break;

		case "player":
			cards = playerCards;
			break;

		default:
			throw new Error("'who' must be 'bank' or 'player', not '" + who + "'.");
	}

	for (const card of cards) {
		let value = parseInt(card);

		if (value) {
			total += value;
			continue;
		}

		switch (card) {
			case "A":
				total += 1;
				break;

			case "J":
			case "Q":
			case "K":
				total += 10;
				break;

			default:
				throw new Error("Unknown card");
		}
	}

	if (cards.includes("A") && total < 12) total += 10;

	return total;
}