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

        answerImagePath: "assets/images/answers/",

        // Per-game variables
        currentQuestion: null,
        questionIndex: -1,
        correctAnswerCount: 0,
        incorrectAnswerCount: 0,

        // Per-question variables
        correctAnswerIndex: -1,
        selectedAnswerIndex: -1,
        guessMade: false,

        timing: {
            // delay after:
            selectionMade: 3000,
            answerShown: 5000,
        },

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
            }
        ],

        uiAnswers_click: function (e, index) {
            var self = this;

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
            this.uiAnswers[this.selectedAnswerIndex].container.addClass("answer-selected");
            this.uiSelection.removeClass("hidden").addClass("position-" + this.selectedAnswerIndex);
        },

        removeSelectedAnswerStyle: function() {
            for(var i = 0; i < this.uiAnswers.length; i++) {
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
            } else {
                this.uiCorrectAnswer.text("The correct answer is: " + this.currentQuestion.answers[this.correctAnswerIndex].substr(1));
                this.uiAnswerResult.text("Wrong!");
                this.incorrectAnswerCount++;
            }

            this.uiAnswerDetails.html(this.currentQuestion.details || "");
            this.uiAnswerImage.attr("src", this.answerImagePath + this.currentQuestion.image);

            this.setVisiblePane(this.uiAnswerPane);

            setTimeout(function(){
                var moreQuestions = self.displayNextQuestion();
                if(!moreQuestions){
                    self.endQuiz();
                }
            }, this.timing.answerShown);
        },

        displayQuestion: function (question) {
            this.uiQuestion.text(question.question);
            if(question.question.length > 70) {
                this.uiQuestion.addClass("question-small-text");
            }else{
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
    };

    TriviaGame = game;
    TriviaGame.init();
});