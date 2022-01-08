class Word {
	constructor(original, translation) {
		this.original = original;
		this.translation = translation;
	}
}

class Flashcard {
	constructor(original, translation) {
		this._word = new Word(original, translation);
	}

	set word(word) {
		this._word = word;
	}

	get word() {
		return this._word;
	}

	animate() {
		console.log(this._word.original, "means", this._word.translation);
	}
}

class SimpleFlashcarde extends Flashcard {
	constructor(original, translation) {
		super(original, translation);
	}

	flip() {
		console.log("flippin");
	}
}

class TextFlashcard extends Flashcard {
	constructor(original, translation) {
		super(original, translation);
	}

	takeInput(input) {
		console.log("taking input: ", input);
	}

	checkAnswer(answer) {
		return this._word.translation === answer;
	}
}

class Game {
	constructor(words) {
		this._flashcards = words.map(word => new Flashcard(word.original, word.translation));
		this._timer = 0;
		//dunno wheter list of words will be needed
	}

	count(range) {
		console.log(this._timer);
		range > this._timer &&
			setTimeout(() => {
				this._timer = this._timer + 1;
				this.count(range);
			}, 1000);
	}

	init() {
		console.log("initialize the game");
	}

	play() {
		console.log("lets play");
	}
}

class LearnGame extends Game {
	constructor(words) {
		super(words);
		this._current = 0;
	}

	prev() {
		return this._current > 0 ? this._flashcards[this._current - 1] : this._flashcards.at(-1);
	}

	next() {
		return this._current >= this._flashcards.length ? this._flashcards[0] : this._flashcards[this._current + 1];
	}
}

class PointGame extends Game {
	constructor(words, time) {
		super(words);
		this._time = time;
		this.score = 0;
	}

	updateScore(newScore) {
		this.score = newScore;
	}
}

// const fish1 = new TextFlashcard("cat", "kot");
// fish1.animate();
// console.log(fish1.checkAnswer("kot"));

const game1 = new Game([
	{original: "cat", translation: "kot"},
	{original: "ferret", translation: "fretka"},
]);

// game1.count(10);

const game2 = new PointGame(
	[
		{original: "cat", translation: "kot"},
		{original: "ferret", translation: "fretka"},
	],
	10
);

console.log(game2.score);
game2.updateScore(20);
console.log(game2.score);
