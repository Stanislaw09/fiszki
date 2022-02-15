class Word {
   constructor(original, translation) {
      this.original = original;
      this.translation = translation;
   }
}

class Flashcard {
   _word;

   constructor(original, translation) {
      this._word = new Word(original, translation);
   }

   // set word(word) {
   //    this._word = word;
   // }

   // only getter => word is protected now
   get word() {
      return this._word;
   }
}

class SimpleFlashcard extends Flashcard {
   constructor(original, translation) {
      super(original, translation);
   }

   flip() {
      [this.word.original, this.word.translation] = [this.word.translation, this.word.original];
   }

   render(active, rerender) {
      const div = document.createElement("div");
      div.className = "carousel-item";

      const innerDiv = document.createElement("div");
      innerDiv.style = "carousel-caption d-none d-md-block";
      innerDiv.style.display = "grid";
      innerDiv.style["justify-content"] = "center";

      const h5 = document.createElement("h5");
      h5.innerHTML = this.word.original;

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
      this.isCorrect = -1;
   }

   checkAnswer() {
      const answer = document.querySelector(".activeInput").value;
      if (this.word.translation === answer.toLowerCase()) {
         document.querySelector(".active #answer-input").style.border = "3px solid green";
         this.isCorrect = 1;
      } else {
         document.querySelector(".active #answer-input").style.border = "2px solid red";
         this.isCorrect = 0;
      }
	  setTimeout(() => { 
		  try {
			document.querySelector(".carousel-control-next").click() 
		  } catch(e) {
			//   nothing to see here
		  }

	  }, 800)
   }

   render(active, rerender, correct, wrong) {
      const div = document.createElement("div");
      div.className = "carousel-item";

      const innerDiv = document.createElement("div");
      innerDiv.style = "carousel-caption d-none d-md-block";
      innerDiv.style.display = "grid";
      innerDiv.style["justify-content"] = "center";

      const h5 = document.createElement("h5");
      h5.innerHTML = this.word.original;

      const wrapper = document.createElement("div");
      wrapper.className = "input-group mb-3";

      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-control";
      input.id = "answer-input";
      input.placeholder = "type answer";
      active && input.classList.add("activeInput");
      // input.addEventListener('change')

      const btn = document.createElement("button");
      btn.className = "btn btn-outline-secondary";
      btn.type = "button";
      // btn.id = "button-addon2";
      btn.innerHTML = "check";

      btn.addEventListener("click", () => {
         this.checkAnswer(correct, wrong);

         setTimeout(() => {
            rerender();
         }, 700);
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
   constructor() {
      this.initialize()
   }

   initialize() {
      this.flashcards = [];
      this.words = JSON.parse(localStorage.getItem("words")) || [];
      this._current = 0;
      this.correct = 0;
      this.wrong = 0;
      this.playing = false
      this.getFlashcards();
   }

   next() {
      this.counter = 0;
      this._current++;
      this._current %= this.words.length;
      setTimeout(() => {
         this.render();
      }, 500);
   }

   prev() {
      this.counter = 0;
      this._current += this.words.length;
      this._current--;
      this._current %= this.words.length;
      setTimeout(() => {
         this.render();
      }, 500);
   }

   play() {
      console.log("lets play");
      document.getElementById("newWordForm").style.display = "none";
      document.getElementById("counter_input").disabled = true;
   }

   getFlashcards() {
      console.log("Something went wrong");
   }

   render() {
      this.correct = 0
      this.wrong = 0

      const cards = this.flashcards.map((card, i) => {
         this.correct += card.isCorrect == 1 ? 1 : 0;
         this.wrong += card.isCorrect == 0 ? 1 : 0;

         return card.render(i === this._current, () => this.render());
      });

      document.querySelector('#correct-answers').innerHTML = this.correct
      document.querySelector('#wrong-answers').innerHTML = this.wrong

      document.querySelector(".carousel-inner").innerHTML = "";
      document.querySelector(".carousel-inner").append(...cards);
   }

   addWord(word) {
      this.words.push(word);
      localStorage.setItem("words", JSON.stringify(this.words));
      this.getFlashcards();
      this.render();
   }
}

class LearnGame extends Game {
   constructor() {
      super();
      document.querySelector(".carousel-control-prev").style.display = "block"
      document.querySelector(".carousel-control-prev").style.display = "block"
   }

   getFlashcards() {
      this.flashcards = this.words.map(word => new SimpleFlashcard(word.original, word.translation));
      // this.flashcards[0].word = { original: 'róże', translation: 'roses' } //test the protected properties
   }

   // prev() {
   // 	console.log(this._current)
   // 	return this._current > 0 ? this.flashcards[this.current - 1] : this.flashcards.at(-1);
   // }

   // next() {
   // 	return this._current >= this.flashcards.length ? this.flashcards[0] : this.flashcards[this.current + 1];
   // }
}

class PointGame extends Game {
   #counter;   //private property declaration

   constructor() {
      super();
      this.#counter = 0;
      this.range = 10;
      setTimeout(this.enableOrDisableCheckButton.bind(this), 10)
   }

   getFlashcards() {
      this.flashcards = this.words.map(
         word => new TextFlashcard(word.original, word.translation, this.correct, this.wrong)
      );
   }

   handleCounterChange() {
      this.range = Math.max(Math.min(document.querySelector("#counter_input").value, 60), 2);
      document.querySelector("#counter_input").value = Math.max(
         Math.min(document.querySelector("#counter_input").value, 60),
         2
      );
   }

   #count() {
      if (this.range <= this.#counter) {
         this.#counter = 0;
         if (this._current != this.flashcards.length - 1) {

            document.querySelector(".carousel-control-next").click();
         } else {
            alert(`Koniec Gry!\n${this.correct} dobrych odpowiedzi\n${this.wrong} złych odpowiedzi\n${this.correct / this.flashcards.length * 100}% opanowania materiału`)
            window.location.reload();
         }
      }

      setTimeout(() => {
         this.#counter++;
         document.querySelector("#timer").innerHTML = this.range - this.#counter;
         this.#count();
      }, 1000);
   }

   enableOrDisableCheckButton() {
      document.querySelectorAll(".btn.btn-outline-secondary").forEach(x => { x.disabled = !this.playing })
   }

   play() {
      super.initialize()

      this.playing = true
      document.querySelector(".carousel-control-prev").style.display = "none"
      document.querySelector(".carousel-control-next").style.display = "none"
      document.getElementById("newWordForm").style.display = "none";
      document.getElementById("counter_input").disabled = true;
      document.querySelector(".carousel-control-next").style.display = "block"

      this.handleCounterChange()
      this.#count()
      setTimeout(this.enableOrDisableCheckButton.bind(this), 10)
   }

   next() {
      super.next()
      this.#counter = 0
   }

   prev() {
      super.prev()
      this.#counter = 0
   }

   render() {
      super.render()

      if (this.playing) {
         document.querySelector(".carousel-control-next").style.display = (this._current === this.flashcards.length - 1) ? "none" : "block"

      }
   }
}

let game = null;

const handleNewFlashcard = e => {
   e.preventDefault();
   const original = document.getElementById("word_original").value
   const translation = document.getElementById("word_translation").value

   if (original.length != 0 && translation.length != 0) {
      const newWord = new Word(original, translation);
      game.addWord(newWord);
   }

   e.target.reset();
};

const changeMode = mode => {
   delete game;

   switch (mode) {
      case "learn":
         game = new LearnGame();
         document.getElementById("learnButton").classList.add("active");
         document.getElementById("pointButton").classList.remove("active");
         break;
      case "point":
         document.getElementById("learnButton").classList.remove("active");
         document.getElementById("pointButton").classList.add("active");
         game = new PointGame();

         // console.log(game.#counter)    //private props check
         break;
      default:
         console.error("Thats a problem");
   }

   game.getFlashcards();
   game.render();
   document.getElementById("playButton").disabled = false;
};

changeMode("learn");

document.getElementById("newWordForm").addEventListener("submit", handleNewFlashcard);
document.getElementById("learnButton").addEventListener("click", () => {
   changeMode("learn");
});
document.getElementById("pointButton").addEventListener("click", () => {
   changeMode("point");
});
document.getElementById("playButton").addEventListener("click", () => game.play())
document.querySelector(".carousel-control-prev").addEventListener("click", () => game.prev());
document.querySelector(".carousel-control-next").addEventListener("click", () => game.next());

