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

class SimpleFlashcard extends Flashcard {
	constructor(original, translation) {
		super(original, translation);
	}

	flip() {
		[this._word.original, this._word.translation] = [this._word.translation, this._word.original];
	}

	render(active, rerender) {
		const div = document.createElement("div");
		div.className = "carousel-item";

		const innerDiv = document.createElement("div");
		innerDiv.style = "carousel-caption d-none d-md-block";
		innerDiv.style.display = "grid";
		innerDiv.style["justify-content"] = "center";

		const h5 = document.createElement("h5");
		h5.innerHTML = this._word.original;

		const button = document.createElement("button");
		button.className = "btn btn-secondary";
		button.id = "flashcardBtn";
		button.innerHTML = "Flip";

		button.addEventListener("click", () => {
			this.flip();
			rerender();
		});

		innerDiv.appendChild(h5);
		innerDiv.appendChild(button);
		div.appendChild(innerDiv);
		active && div.classList.add("active");

		return div;
	}
}

class TextFlashcard extends Flashcard {
	constructor(original, translation) {
		super(original, translation);
	}

	takeInput(input) {
		console.log("taking input: ", input);
	}

	checkAnswer() {
		const answer = document.getElementById("inputAnswer").value;
		console.log(this._word.translation === answer.toLowerCase());
	}

	render(active) {
		const wrapper = document.createElement("div");
		wrapper.className = "card text-center";
		wrapper.style = "width: 18rem;";

		const h5 = document.createElement("h5");
		h5.style = "card-title";
		h5.innerHTML = this._word.original;

		const div = document.createElement("div");
		div.className = "input-group mb-3";

		const input = document.createElement("input");
		input.type = "text";
		input.className = "form-control";
		input.placeholder = "type answer";
		input.id = "inputAnswer";

		const btn = document.createElement("button");
		btn.className = "btn btn-outline-secondary";
		btn.type = "button";
		btn.id = "button-addon2";
		btn.innerHTML = "check";

		div.appendChild(input);
		div.appendChild(btn);
		wrapper.appendChild(h5);
		wrapper.appendChild(div);

		btn.addEventListener("click", () => this.checkAnswer());

		document.getElementById("root").firstChild.remove();
		document.getElementById("root").appendChild(wrapper);
	}
}

class Game {
	constructor(words, type) {
		this.flashcards = [];
		this.words = words;
		this.type = type;

		this.getFlashcards();

		this._timer = 0;
		this._current = 0;

		document.querySelector(".carousel-control-prev").addEventListener("click", () => {
			this._current === 0 ? (this._current = 1) : this._current--;
			this._current %= 2;
		});
		document.querySelector(".carousel-control-next").addEventListener("click", () => {
			this._current++;
			this._current %= 2;
		});
	}

	init() {
		console.log("initialize the game");
	}

	play() {
		console.log("lets play");
	}

	getFlashcards() {
		if (this.type === 1)
			this.flashcards = this.words.map(word => new SimpleFlashcard(word.original, word.translation));
		else this.flashcards = this.words.map(word => new TextFlashcard(word.original, word.translation));
	}

	render() {
		const cards = this.flashcards.map((card, i) => {
			return card.render(i === this._current, () => this.render());
		});

		document.querySelector(".carousel-inner").innerHTML = "";
		document.querySelector(".carousel-inner").append(...cards);
	}
}

class LearnGame extends Game {
	constructor(words, type) {
		super(words, type);
	}

	prev() {
		return this._current > 0 ? this._flashcards[this._current - 1] : this._flashcards.at(-1);
	}

	next() {
		return this._current >= this._flashcards.length ? this._flashcards[0] : this._flashcards[this._current + 1];
	}
}

class PointGame extends Game {
	constructor(words, type, range) {
		super(words, type);
		this.counter = 0;
		this.score = 0;
		this.count(range);
	}

	count(range) {
		range > this.counter &&
			setTimeout(() => {
				this.counter++;
				document.querySelector("#timer").innerHTML = this.counter;
				this.count(range);
			}, 1000);
	}

	updateScore(newScore) {
		this.score = newScore;
	}
}

const game2 = new PointGame(
	[
		{original: "cat", translation: "kot"},
		{original: "ferret", translation: "fretka"},
	],
	1,
	10
);

game2.render();
