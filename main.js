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

	checkAnswer() {
		const answer = document.querySelector(".activeInput").value;
		console.log(this._word.translation === answer.toLowerCase());
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

		const wrapper = document.createElement("div");
		wrapper.className = "input-group mb-3";

		const input = document.createElement("input");
		input.type = "text";
		input.className = "form-control";
		input.placeholder = "type answer";
		active && input.classList.add("activeInput");

		const btn = document.createElement("button");
		btn.className = "btn btn-outline-secondary";
		btn.type = "button";
		btn.id = "button-addon2";
		btn.innerHTML = "check";

		btn.addEventListener("click", () => {
			this.checkAnswer();
			rerender();
		});

		wrapper.appendChild(input);
		wrapper.appendChild(btn);

		innerDiv.appendChild(h5);
		innerDiv.appendChild(wrapper);
		div.appendChild(innerDiv);
		active && div.classList.add("active");

		return div;
	}
}

class Game {
	constructor(words, type) {
		this.flashcards = [];
		this.words = words;
		this.type = type;
		this._timer = 0;
		this._current = 0;

		this.getFlashcards();

		document.querySelector(".carousel-control-prev").addEventListener("click", () => this.prev());
		document.querySelector(".carousel-control-next").addEventListener("click", () => this.next());
	}

	next() {
		this._current++;
		this._current %= this.words.length;
		setTimeout(() => {
			this.render();
		}, 500);
	}

	prev() {
		this._current += this.words.length;
		this._current--;
		this._current %= this.words.length;
		setTimeout(() => {
			this.render();
		}, 500);
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
		{original: "necrosis", translation: "martwica"},
		{original: "bereavement", translation: "zaloba"},
	],
	1, //can be 1 for flip cards or sth else (eg 0) for text card
	10 //time counter, for now does nothing
);

game2.render();
