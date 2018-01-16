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

        uiAnswerResult: $("#answer-result"),
        uiCorrectAnswer: $("#correct-answer"),
        uiAnswerImage: $("#answer-image"),

        uiTallyRight: $("#tally-right"),
        uiTallyWrong: $("#tally-wrong"),


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
            selectionMade: 1000,
            answerShown: 5000,
        },

        init: function () {
            var answerItems = $(".answer-text");
            this.initAnswerElement($(answerItems[0]));
            this.initAnswerElement($(answerItems[1]));
            this.initAnswerElement($(answerItems[2]));
            this.initAnswerElement($(answerItems[3]));

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
        initAnswerElement(jqElement) {
            var self = this;
            var index = this.uiAnswers.length;

            this.uiAnswers.push(jqElement);
            jqElement.click(function (e) {
                self.uiAnswers_click(e, index);
            });
        },

        questions: [
            {
                question: "This is a question and if you look below there are answers",
                answers: [
                    "Answer 1",
                    "*Answer 2",
                    "Answer 3",
                    "Answer 4",
                ]
            },
            {
                question: "second question",
                answers: [
                    "response 2",
                    "response 3",
                    "response 1",
                    "*response 4",
                ]
            },
        ],

        uiAnswers_click: function (e, index) {
            if (!this.guessMade) {
                this.guessMade = true;
                this.selectedAnswerIndex = index;
                setTimeout(this.displayAnswer.bind(this), this.timing.selectionMade);
            }
        },

        startButton_click: function (e) {
            this.startQuiz();
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
                this.uiAnswerResult.text("Correct!");
                this.correctAnswerCount++;
            } else {
                this.uiAnswerResult.text("Wrong!");
                this.incorrectAnswerCount++;
            }
            this.uiCorrectAnswer.text("The correct answer is: " + this.currentQuestion.answers[this.correctAnswerIndex]);

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

            for (var i = 0; i < question.answers.length; i++) {
                var answer = question.answers[i];

                // Asterisk marks the correct question
                if (answer.charAt(0) == "*") {
                    // Save the index and remove the asterisk
                    this.correctAnswerIndex = i;
                    answer = answer.substr(1);
                }

                this.uiAnswers[i].text(answer);
            }
        },
    };

    TriviaGame = game;
    TriviaGame.init();
});