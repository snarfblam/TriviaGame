//@ts-check

/*

Question:
    Present question, list of answers, timer
    User makes correct selection:
        Display correct message and appropriate image/sound
    User makes incorrect selection/timer runs out:
        Display appropriate message and present correct answer

        */


/*
    Question object { question: string, answers[4]: string }
        -The correct answer is prefixed with an asterisk
*/

var TriviaGame;

$(document).ready(function () {
    var game = {

        // Panes
        uiIntroPane: $("#intro-pane"),
        uiQuestionPane: $("#question-pane"),
        uiAnswerPane: $("#answer-pane"),
        uiFinalResultPane: $("#final-result-pane"),
        uiPanes: [],

        uiStartButton: $("#start-button"),
        uiTimer: $("#timer"),
        uiQuestion: $("#question"),
        uiAnswerList: $("#answer-list"),
        uiAnswers: [],
        uiSelection: $("#answer-selection"),

        uiAnswerResult: $("#answer-result"),
        uiCorrectAnswer: $("#correct-answer"),
        uiAnswerImage: $("#answer-image"),
        uiAnswerDetails: $("#answer-details"),

        uiTallyRight: $("#tally-right"),
        uiTallyWrong: $("#tally-wrong"),
        uiTallyUnanswered: $("#tally-unanswered"),

        answerImagePath: "assets/images/answers/",

        questionTimer: null,
        currentQuestionTime: 0, // seconds
        timePerQuestion: 15, // seconds
        timing: {
            // delay after:
            selectionMade: 3000,
            answerShown: 5000,
        },

        // Per-game variables
        currentQuestion: null,
        questionIndex: -1,
        correctAnswerCount: 0,
        incorrectAnswerCount: 0,
        unansweredCount: 0,

        // Per-question variables
        correctAnswerIndex: -1,
        /** The selected answer, or -1 if no selection has been made (indicative if timer running out when checking if the correct answer was picked). */
        selectedAnswerIndex: -1,
        guessMade: false,


        init: function () {
            var answerItems = $(".answer-text");
            var answerContainers = $(".answer-item");

            this.initAnswerElement($(answerItems[0]), $(answerContainers[0]));
            this.initAnswerElement($(answerItems[1]), $(answerContainers[1]));;
            this.initAnswerElement($(answerItems[2]), $(answerContainers[2]));;
            this.initAnswerElement($(answerItems[3]), $(answerContainers[3]));;

            this.uiPanes = [
                this.uiIntroPane,
                this.uiQuestionPane,
                this.uiFinalResultPane,
                this.uiAnswerPane,
            ];

            this.displayIntroPane();

            this.uiStartButton.click(this.startButton_click.bind(this));
        },

        /** Adds the specified element to this.uiAnswers and wires the click event */
        initAnswerElement(jqAnswer, jqContainer) {
            var self = this;
            var index = this.uiAnswers.length;

            this.uiAnswers.push({
                answer: jqAnswer,
                container: jqContainer,
                index: index,
            });
            jqContainer.click(function (e) {
                self.uiAnswers_click(e, index);
            });
        },

        questions: [
            {
                question: "Of the following famous movie one-liners, which is the only one that is NOT said by a character right before they fire a gun? ",
                answers: [
                    "\"Say hello to my little friend\"",
                    "\"Well do ya, punk?\"",
                    "*\"Get off my plane\"",
                    "\"Hasta la vista, baby\"",
                ],
                image: "af1.jpg",
                details: "In the film <em>Air Force One</em> President James Marshall says this line before knocking Korshunov off the back of the plane."
            },
            {
                question: "According to the Washington Post, as much as 20% of all power outages are caused by animals—especially which kind of animal?",
                answers: [
                    "Polar Bear",
                    "*Squirrel",
                    "Rhino",
                    "Squid",
                ],
                image: "squirrel.jpg",
                details: "It has been hypothesized that the threat to the infrastructure and services posed by squirrels may exceed that posed by terrorists."
            },
            {
                question: "To assure someone that great things take time to achieve, you might remind them that, according to a famous phrase, what \"wasn't built in a day\"?",
                answers: [
                    "*Rome",
                    "the Silk Road",
                    "Ryan Reynolds' six-pack",
                    "the Colosseum"
                ],
                image: "rome.jpg",
                details: "The Count of Flanders—a 12th century cleric in the court of Phillippe of Alsace—is credited for the original phrase, in French: \"Rome ne s’est pas faite en un jour.\""
            },
            {
                question: "Blamed on its high cost of living, what state has, by far, the largest percentage of adults still living with their parents?",
                answers: [
                    "Montana",
                    "*New Jersey",
                    "Nebraska",
                    "Tennessee",
                ],
                image: "millineals_home.jpg",
                details: "In 2015, 47% of New Jersey residents ages 18 to 34 were living in their parent’s home."
            },
            {
                question: "What desert surrounds the city of Las Vegas?",
                answers: [
                    "*Mojave",
                    "Sonoran",
                    "Painted",
                    "Great basin"
                ],
                image: "mojave.jpg",
                details: "The Mojave Desert is the driest desert in North America. It's located insouthwestern United States, primarily within southeastern California and southern Nevada.",
            },
            {
                question: "Fittingly, Nintendo honors its legendary mustachioed plumber on what date each year?",
                answers: [
                    "*Mar. 10",
                    "Apr. 30",
                    "Sep. 20",
                    "Dec. 31",
                ],
                image: "mario03.png",
                details: "National Mario Day is observed each year on March 10th and honors Mario from the popular Nintendo game.",
            },
            {
                question: "Though still worth over $2 billion, who of the following lost the vast majority of his wealth due to a disastrous merger announced in January 2000?",
                answers: [
                    "Larry Ellison",
                    "Bill Gates",
                    "*Ted Turner",
                    "Jeff Bezos",
                ],
                details: "Turner was Time Warner's biggest individual shareholder. It is estimated he lost as much as $7 billion when the stock collapsed in the wake of the merger.",
                image: "turner.jpg",
            },
            {
                question: "In the classic 1939 film <em>The Wizard of Oz</em>, the Wicked Witch of the West sports a large wart on which part of her face?",
                answers: [
                    "her nose",
                    "*her chin",
                    "her cheek",
                    "her forehead",
                ],
                image: "witch.jpg",
                details: "Margaret Hamilton plays the Wicked Witch of the West as a green-skinned witch dressed in a long black dress with a black pointed hat",
            },
            {
                question: "\"The anatomical juxtaposition of two orbicularis oris muscles in a state of contraction\" is a fancy way of describing a what?",
                answers: [
                    "high five",
                    "hug",
                    "*kiss",
                    "handshake",
                ],
                image: "lips.jpg",
                details: "The orbicularis oris muscle is a complex of muscles in the lips that encircles the mouth."
            },
            {
                question: "Thought to have inspired the name of a Dr. Seuss character, the French word \"grincheux\" means what in English? ",
                answers: [
                    "generous",
                    "gigantic",
                    "garlicky",
                    "*grumpy",
                ],
                image: "grinch.jpg",
                details: "The Grinch is the grumpy green main character of the children's book <em>How the Grinch Stole Christmas!</em>",
            },
        ],

        uiAnswers_click: function (e, index) {
            this.selectAnswer(index);
        },

        /** Index of selected item, or -1 to indicate no selection was made (time up) */
        selectAnswer: function (index) {
            var self = this;

            this.stopTimer();

            if (!this.guessMade) {
                this.guessMade = true;
                this.selectedAnswerIndex = index;
                this.setSelectedAnswerStyle();

                setTimeout(function () {
                    self.removeSelectedAnswerStyle();
                    self.displayAnswer();
                }, this.timing.selectionMade);
            }
        },

        startButton_click: function (e) {
            this.startQuiz();
        },


        setSelectedAnswerStyle: function () {
            if (this.selectedAnswerIndex >= 0) { // was a selection made?
                // Then use the selection background and style
                this.uiAnswers[this.selectedAnswerIndex].container.addClass("answer-selected");
                this.uiSelection.removeClass("hidden").addClass("position-" + this.selectedAnswerIndex);
            }
        },

        removeSelectedAnswerStyle: function () {
            for (var i = 0; i < this.uiAnswers.length; i++) {
                this.uiAnswers[i].container.removeClass("answer-selected");
                this.uiSelection.addClass("hidden").removeClass("position-0 position-1 position-2 position-3");
            }
        },

        startQuiz: function () {
            this.questionIndex = -1;
            this.correctAnswerCount = 0;
            this.incorrectAnswerCount = 0;

            if (!this.displayNextQuestion()) { // returns false if no more questions
                this.endQuiz();
            }
        },

        endQuiz: function () {
            this.uiTallyWrong.text(this.incorrectAnswerCount);
            this.uiTallyRight.text(this.correctAnswerCount);
            this.uiTallyUnanswered.text(this.unansweredCount);
            this.setVisiblePane(this.uiFinalResultPane);
        },

        setVisiblePane: function (jqPane) {
            for (var i = 0; i < this.uiPanes.length; i++) {
                var pane = this.uiPanes[i];
                if (pane == jqPane) {
                    pane.removeClass("hidden");
                    pane.addClass("fade-in");
                } else {
                    pane.addClass("hidden");
                    pane.removeClass("fade-in");
                }
            }
        },

        displayIntroPane: function () {
            this.setVisiblePane(this.uiIntroPane);
        },

        /** Initializes and displays the next question. Returns false if there are no more questions, otherwise returns true. */
        displayNextQuestion: function () {
            this.guessMade = false;

            this.questionIndex++;
            if (this.questionIndex >= this.questions.length) return false; // no more questions

            this.currentQuestion = this.questions[this.questionIndex];
            this.displayQuestion(this.currentQuestion);

            this.setVisiblePane(this.uiQuestionPane);

            return true; // We found a question
        },

        displayAnswer: function () {
            var self = this;

            var correct = this.selectedAnswerIndex == this.correctAnswerIndex;
            if (correct) {
                this.uiCorrectAnswer.text(this.currentQuestion.answers[this.correctAnswerIndex].substr(1));
                this.uiAnswerResult.text("Correct!");
                this.correctAnswerCount++;
            } else if(this.selectedAnswerIndex >= 0) { // incorrect
                this.uiCorrectAnswer.text("The correct answer is: " + this.currentQuestion.answers[this.correctAnswerIndex].substr(1));
                this.uiAnswerResult.text("Incorrect");
                this.incorrectAnswerCount++;
            } else { // time up
                this.uiCorrectAnswer.text("The correct answer is: " + this.currentQuestion.answers[this.correctAnswerIndex].substr(1));
                this.uiAnswerResult.text("Time up");
                this.unansweredCount++;
            }

            this.uiAnswerDetails.html(this.currentQuestion.details || "");
            this.uiAnswerImage.attr("src", this.answerImagePath + this.currentQuestion.image);

            this.setVisiblePane(this.uiAnswerPane);

            setTimeout(function () {
                var moreQuestions = self.displayNextQuestion();
                if (!moreQuestions) {
                    self.endQuiz();
                }
            }, this.timing.answerShown);
        },

        displayQuestion: function (question) {
            this.startTimer();

            this.uiQuestion.html(question.question);
            if (question.question.length > 70) {
                this.uiQuestion.addClass("question-small-text");
            } else {
                this.uiQuestion.removeClass("question-small-text");
            }

            for (var i = 0; i < question.answers.length; i++) {
                var answer = question.answers[i];

                // Asterisk marks the correct question
                if (answer.charAt(0) == "*") {
                    // Save the index and remove the asterisk
                    this.correctAnswerIndex = i;
                    answer = answer.substr(1);
                }

                this.uiAnswers[i].answer.text(answer);
            }
        },

        startTimer: function () {
            if (this.questionTimer) throw "Error: timer already set.";
            this.uiTimer.removeClass("time-up");

            this.currentQuestionTime = this.timePerQuestion;
            this.questionTimer = setInterval(this.onTimer_Tick.bind(this), 1000);
            this.updateTimer();
        },

        stopTimer: function () {
            if (this.questionTimer) {
                clearInterval(this.questionTimer);
                this.questionTimer = null;
            }
        },

        onTimer_Tick: function (e) {
            this.currentQuestionTime--;
            this.updateTimer();

            if (this.currentQuestionTime == 0) {
                this.uiTimer.addClass("time-up");
                this.selectAnswer(-1); // -1 indicates no selection made
            }
        },

        updateTimer: function () {
            var timerText = this.currentQuestionTime.toString();
            while (timerText.length < 2) {
                timerText = "0" + timerText;
            }

            this.uiTimer.text(timerText);
        },
    };


    TriviaGame = game;
    TriviaGame.init();
});