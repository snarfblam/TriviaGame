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

$(document).ready(function(){
    var game = {

        // Panes
        uiIntroPane: $("#intro-pane"),
        uiQuestionPane: $("#question-pane"),
        uiAnswerPane: $("#answer-pane"),
        uiFinalResultPane: $("final-result-pane"),

        uiStartButton: $("#start-button"),
        uiTimer: $("#timer"),
        uiQuestion: $("#question"),
        uiAnswerList: $("#answer-list"),
        uiAnswers: [],

        uiAnswerResult: $("answer-result"),
        uiCorrectAnswer: $("correct-answer"),
        uiAnswerImage: $("answer-image"),

        uiTallyRight: $("#tally-right"),
        uiTallyWrong: $("#tally-wrong"),



        currentQuestion: null,
        correctAnswerIndex: 0,

        init: function() {
            var answerItems = $(".answer-item");
            this.uiAnswers.push($(answerItems[0]));
            this.uiAnswers.push($(answerItems[1]));
            this.uiAnswers.push($(answerItems[2]));
            this.uiAnswers.push($(answerItems[3]));

            this.displayQuestion(this.questions[0]);
        },   

        questions: [
            {
                question: "sample question",
                answers: [
                    "answer 1",
                    "*answer 2",
                    "answer 3",
                    "answer 4",
                ]
            },
        ],

        displayQuestion: function(question) {
            this.uiQuestion.text(question.question);
            
            for(var i = 0; i < question.answers.length; i++) {
                var answer = question.answers[i];

                // Asterisk marks the correct question
                if(answer.charAt(0) == "*"){
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