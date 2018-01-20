//@ts-check

var TriviaGame;

$(document).ready(function () {
    var game = {

        // UI elements
            uiIntroPane: $("#intro-pane"),
            uiQuestionPane: $("#question-pane"),
            uiAnswerPane: $("#answer-pane"),
            uiFinalResultPane: $("#final-result-pane"),
            uiAllPanes: $(".pane"),
            uiPaneList: [],

            uiStartButton: $("#start-button"),
            uiMillionButton: $("#million-button"),
            uiRestartButton: $("#restart-button"),
            uiQuitButton: $("#quit-button"),
            uiTimer: $("#timer"),
            uiQuestion: $("#question"),
            uiAnswerList: $("#answer-list"),
            uiAnswers: [],
            uiSelection: $("#answer-selection"),

            uiAnswerResult: $("#answer-result"),
            uiCorrectAnswer: $("#correct-answer"),
            uiAnswerImage: $("#answer-image"),
            uiAnswerDetails: $("#answer-details"),
            uiMillionList: $("#million-list"),
            uiMillionItems: [],

            uiTallyRight: $("#tally-right"),
            uiTallyWrong: $("#tally-wrong"),
            uiTallyUnanswered: $("#tally-unanswered"),
            uiPrize: $("#prize"),

        // "Constant"s
            questionsPerGame: 10,
            answerImagePath: "assets/images/answers/",

        // Timing:
        timePerQuestion: 20, // seconds
        questionTimer: null, // Interval handle
        timing: { // delay after each, in ms.:
            selectionMade: 1000,
            answerShown: 6000,
            millionAnswerShown: 4000,
        },

        // Per-game variables
            currentQuestion: null,
            questions: [],
            questionIndex: -1,
            correctAnswerCount: 0,
            incorrectAnswerCount: 0,
            unansweredCount: 0,
            playerQuit: false, // true if player clicks the "walk away" button
            millionaireMode: false,

        // Per-question variables
            correctAnswerIndex: -1,
            selectedAnswerIndex: -1, // -1 = time-up, -2 = 'walk away'. Magic numbers are magical <3
            guessMade: false,
            currentQuestionTime: 0, // seconds

        millionairePrizes_quitter: [ // prizes if you choose to quit without answering
            0,
            500,
            1000,
            2000,
            5000,
            10000,
            20000,
            50000,
            75000,
            150000,
            250000,
            500000,
            1000000,
        ],
        millionairePrizes_loser: [ // prizes if you get a question wrong (you slip back to the last 'breakpoint' question you got right)
            0,
            0,
            1000,
            1000,
            1000,
            1000,
            1000,
            50000,
            50000,
            50000,
            50000,
            50000,
            1000000,
        ],
        allQuestions: [
            // Super easy
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
                rating: 0,
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
                rating: 0,
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
                details: "It has been hypothesized that the threat to the infrastructure and services posed by squirrels may exceed that posed by terrorists.",
                rating: 0,
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
                details: "The Count of Flanders—a 12th century cleric in the court of Phillippe of Alsace—is credited for the original phrase, in French: \"Rome ne s’est pas faite en un jour.\"",
                rating: 0,
            },
            // Very easy
            {
                question: "If something is operated \"pneumatically,\" by definition what causes it to move?",
                answers: [
                    "Gravity",
                    "Propane",
                    "Horses",
                    "*Compressed air"
                ],
                details: "Pneumatics (From Greek: πνεύμα) is a branch of engineering that makes use of gas or pressurized air.",
                image: "pneumatic.jpg",
                rating: 1,
            },
            {
                question: "Of the following famous movie one-liners, which is the only one that is NOT said by a character right before they fire a gun? ",
                answers: [
                    "\"Say hello to my little friend\"",
                    "\"Well do ya, punk?\"",
                    "*\"Get off my plane\"",
                    "\"Hasta la vista, baby\"",
                ],
                image: "af1.jpg",
                details: "In the film <em>Air Force One</em> President James Marshall says this line before knocking Korshunov off the back of the plane.",
                rating: 1,
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
                details: "The Mojave Desert is the driest desert in North America. It's located in southwestern United States, primarily within southeastern California and southern Nevada.",
                rating: 1,
            },
            {
                question: "Inspired by the term for a baby kangaroo or koala, Outback Steakhouse doesn't offer its young diners a Kids Menu, but a what?",
                answers: [
                    "Hatchling Menu",
                    "*Joey Menu",
                    "Whelp Menu",
                    "Pup menu"
                ],
                image: "joey.png",
                details: "\"Joey\" is a term used to describe an infant marsupial, including kangaroos and koalas.",
                rating: 1,
            },
            // Easy
            {
                question: "It should come as no surprise that author Beatrix Potter owned which of the following pets as a young girl?",
                answers: [
                    "A pig named Wilbur ",
                    "A horse named Beauty",
                    "*A rabbit named Peter ",
                    "A mouse named Stuart",
                ],
                details: " Peter Rabbit, named after a pet rabbit Beatrix Potter had as a child, first appeared in The Tale of Peter Rabbit in 1902 and subsequently in five more books.",
                image: "peterrabbit.jpg",
                rating: 2,
            },
            {
                question: "In the classic 1939 film <em>The Wizard of Oz</em>, the Wicked Witch of the West sports a large wart on which part of her face?",
                answers: [
                    "Her nose",
                    "*Her chin",
                    "Her cheek",
                    "Her forehead",
                ],
                image: "witch.jpg",
                details: "Margaret Hamilton plays the Wicked Witch of the West: a green-skinned witch in a black dress with a black pointed hat, and a wart on her chin.",
                rating: 2,
            },
            {
                question: "Which of the following is 2,922 days long?",
                answers: [
                    "Time between leap years",
                    "Teenage years",
                    "*Two full U.S. presidential terms ",
                    "Time between U.S. censuses",
                ],
                details: "2,922 days, or eight years, is the maximum length of time a single person may serve as president by election thanks to Twenty-Second Amendment.",
                image: "prez.jpg",
                rating: 2,
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
                details: "In 2015, 47% of New Jersey residents ages 18 to 34 were living in their parent’s home.",
                rating: 2,
            },
            // Medium
            {
                question: "Registering near the middle of the pH scale, which of these substances has a pH level of about 7?",
                answers: [
                    "Hydrochloric acid ",
                    "Lemon juice",
                    "Baking soda ",
                    "*Water",
                ],
                details: "pH (\"potential of hydrogen\") is a measure of acidity. Pure water has a pH of 7, or completely neutral.",
                image: "waterdorp.png",
                rating: 3,
            },
            {
                question: "Over David Letterman's 33 years in late-night TV, which of these people appeared the most times as a guest on his shows? ",
                answers: [
                    "Tom Brokaw",
                    "Marv Albert",
                    "*Regis Philbin",
                    "Jack Hanna",
                ],
                details: "Philbin was the original host of the U.S. version of <em>Who Wants to Be a Millionaire</em>, an ABC game show that had its roots in Britain.",
                image: "philby.jpg",
                rating: 3,
            },
            {
                question: "Vegemite, a popular sandwich spread in Australia, is made mostly of what?",
                answers: [
                    "Tofu paste",
                    "Goose livers",
                    "*Yeast extract",
                    "Wheat germ",
                ],
                image: "vegemite.jpg",
                details: "Vegemite is a thick, black Australian food spread made from leftover brewers' yeast extract with various vegetable and spice additives. Mmmmmmm...",
                rating: 3,
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
                rating: 3,
            },
            // Hard
            {
                question: "What is, or was, a brachioradialis?",
                answers: [
                    "*A muscle in the forearm",
                    "An intense hailstorm",
                    "A type of dinosaur",
                    "An ancient timekeeping device",
                ],
                details: "The brachioradialis (Venke's muscle) is a muscle that flexes the forearm at the elbow.",
                image: "forearm.jpg",
                rating: 4,
            },
            {
                question: "Your metacarpophalangeal joints are better known as your what?",
                answers: [
                    "Knees",
                    "Ankles",
                    "*Knuckles",
                    "Wrists",
                ],
                details: "The \"metacarpophalangeal joints\" refer to the joints between the metacarpal bones and the phalanges of the fingers, i.e. these are you knuckles.",
                image: "knux.png",
                rating: 4,
            },
            {
                question: "Creating an anthem for working women, Donna Summer wrote the song <em>She Works Hard for the Money</em> based on an encounter she had with a tired what?",
                answers: [
                    "Teacher ",
                    "Meter maid",
                    "Nurse ",
                    "*Bathroom attendant",
                ],
                details: "<em>She Works Hard for the Money</em> is based on the encounter Summer had with an exhausted rest room attendant named Onetta Johnson at the iconic Los Angeles restaurant Chasen's.",
                image: "summer.jpg",
                rating: 4,
            },
            {
                question: "After Stephen Douglas accused him in a debate of being two-faced, who is said to have replied, \"Honestly, if I were two-faced, would I be showing you this one?\"",
                answers: [
                    "Ulysses S. Grant",
                    "*Abraham Lincoln",
                    "Theodore Roosevelt",
                    "Andrew Jackson",
                ],
                details: "Abraham Lincoln was \"inordinately fond of jokes, anecdotes, and stories\". His style was often self-deprecating; he didn't mind being the butt of his own jokes.",
                image: "lincoln.jpg",
                rating: 4,
            },
            // Also hard. Maybe more obscure? No? Oh well, whatever. I needed some things for rating: 5.
            {
                question: "Based on the Greek the word comes from, what would someone in the field of \"zythology\" study?",
                answers: [
                    "Ancient weapons ",
                    "Poisonous flowers",
                    "*Beer ",
                    "Dreams",
                ],
                details: "\"Zythology\" is just a fancy word for the study of beer and brewing.",
                image: "beer.jpg",
                rating: 5,
            },
            {
                question: "Though now associated with Barack Obama, who used the actual word “change” more often than any other president in his inaugural address?",
                answers: [
                    "Theodore Roosevelt ",
                    "John F. Kennedy",
                    "*Lyndon B. Johnson ",
                    "George H.W. Bush",
                ],
                details: "Lyndon B. Johnson persued his \"Great Society\" by signing the Civil Rights Act of 1964, expanding Medicare and Medicaid, and education aid, among other things.",
                image: "prez2.jpg",
                rating: 5,
            },
            {
                question: "In 2016, which of these was renamed in honor of Yuri Oganessian?",
                answers: [
                    "*Last element on periodic table",
                    "World Chess trophy",
                    "The capital of Belarus",
                    "The Russian Space Agency",
                ],
                details: "Yuri Tsolakovich Oganessian is a Russian nuclear physicist of Armenian descent, who is considered the world's leading researcher in superheavy chemical elements.",
                image: "yuri.jpg",
                rating: 5,
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
                details: "The orbicularis oris muscle is a complex of muscles in the lips that encircles the mouth.",
                rating: 5,
            },


        ],


        /** Initializes the game */
        init: function () {
            var self = this;

            { // Additional UI querying
                var answerItems = $(".answer-text");
                var answerContainers = $(".answer-item");

                this.initAnswerElement($(answerItems[0]), $(answerContainers[0]));
                this.initAnswerElement($(answerItems[1]), $(answerContainers[1]));;
                this.initAnswerElement($(answerItems[2]), $(answerContainers[2]));;
                this.initAnswerElement($(answerItems[3]), $(answerContainers[3]));;

                this.uiPaneList = [
                    this.uiIntroPane,
                    this.uiQuestionPane,
                    this.uiFinalResultPane,
                    this.uiAnswerPane,
                ];

                this.uiMillionList.children().each(function () {
                    self.uiMillionItems.push($(this)); // this == <li>
                });
            }

            { // Event wiring
                this.uiStartButton.click(this.startButton_click.bind(this));
                this.uiMillionButton.click(this.millionButton_click.bind(this));
                this.uiRestartButton.click(this.restartButton_click.bind(this));
                this.uiQuitButton.click(this.quitButton_click.bind(this));
            }

            this.displayIntroPane();
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

        /** Index of selected item, or -1 to indicate no selection was made (time up), or
         * -2 to indicate player has quit the game.
         */
        selectAnswer: function (index) {
            var self = this;

            this.stopTimer();

            if (!this.guessMade) {
                this.guessMade = true;

                this.playerQuit = (index === -2);
                this.selectedAnswerIndex = index;
                // Hilight selected answer
                this.setSelectedAnswerStyle();
 
                // Wait a second, then tell user whether he was right or wrong
                setTimeout(function () {
                    self.removeSelectedAnswerStyle();
                    self.displayAnswer();
                }, this.timing.selectionMade);
            }
        },

        startButton_click: function (e) {
            this.startQuiz(false);
        },

        millionButton_click: function (e) {
            this.startQuiz(true);
        },

        restartButton_click: function (e) {
            this.startQuiz(this.millionaireMode);
        },

        quitButton_click: function (e) {
            // "walk away"            
            this.selectAnswer(-2);
        },

        uiAnswers_click: function (e, index) {
            this.selectAnswer(index);
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

        /** Initializes per-game variables and starts the game */
        startQuiz: function (boolMillionaireMode) {
            this.questionIndex = -1;
            this.correctAnswerCount = 0;
            this.incorrectAnswerCount = 0;
            this.unansweredCount = 0;
            this.millionaireMode = boolMillionaireMode;
            this.playerQuit = false;

            if (this.millionaireMode) {
                // Apply appropriate styles
                this.uiAllPanes.addClass("million-mode")
                    .removeClass("normal-mode");

                // Question list -- Two from each of six 'rating's
                this.questions = [];
                for (var r = 0; r < 6; r++) {
                    // Get questions with a rating of 'r'
                    var applicableQuestions = this.allQuestions.filter(function (q) {
                        return q.rating == r;
                    });

                    // Shuffle
                    this.shuffleArray(applicableQuestions);
                    // Add the first two to our question list.
                    this.questions = this.questions.concat(applicableQuestions.slice(0, 2));
                }
            } else {
                // Apply appropriate styles
                this.uiAllPanes.addClass("normal-mode")
                    .removeClass("million-mode");

                // Select a number of random questions
                this.questions = this.allQuestions.slice(0); // duplicate question list
                this.shuffleArray(this.questions); // Randomize questions
                this.questions = this.questions.slice(0, this.questionsPerGame); // Get rid of extras
            }

            // Randomize order of answers for selected questions (note- we are mutating the original objects here)
            this.questions.forEach(function (q) {
                this.shuffleArray(q.answers);
            }, this);


            if (!this.displayNextQuestion()) { // returns false if no more questions
                this.endQuiz();
            }
        },

        /** Displays the player's results */
        endQuiz: function () {
            this.uiTallyWrong.text(this.incorrectAnswerCount);
            this.uiTallyRight.text(this.correctAnswerCount);
            this.uiTallyUnanswered.text(this.unansweredCount);

            // prize
            var prizeList = (this.unansweredCount + this.incorrectAnswerCount > 0) ?
                this.millionairePrizes_loser :
                this.millionairePrizes_quitter;
            this.uiPrize.text(prizeList[this.correctAnswerCount].toLocaleString());
            // show/hide accordingly
            if (this.millionaireMode) {
                this.uiPrize.removeClass("hidden");
            } else {
                this.uiPrize.addClass("hidden");
            }

            this.setVisiblePane(this.uiFinalResultPane);
        },

        /** Shuffles the specified array using the Fisher-Yates shuffle algorithm. */
        shuffleArray: function (array) {
            for (var i = array.length - 1; i > 0; i -= 1) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        },

        /** Displays the specified pane */
        setVisiblePane: function (jqPane) {
            for (var i = 0; i < this.uiPaneList.length; i++) {
                var pane = this.uiPaneList[i];
                if (pane == jqPane) {
                    pane.removeClass("hidden");
                    pane.addClass("fade-in");
                } else {
                    pane.addClass("hidden");
                    pane.removeClass("fade-in");
                }
            }
        },

        /** Displays the introductory pane */
        displayIntroPane: function () {
            this.setVisiblePane(this.uiIntroPane);
        },

        /** Initializes and displays the next question. Returns false if there are no more questions, otherwise returns true. */
        displayNextQuestion: function () {
            this.guessMade = false;

            // In millionaire mode, missing one question = game over
            if (this.millionaireMode && (this.incorrectAnswerCount > 0 || this.unansweredCount > 0)) {
                return false;
            }
            if (this.playerQuit) return false;

            this.questionIndex++;
            if (this.questionIndex >= this.questions.length) return false; // no more questions

            this.currentQuestion = this.questions[this.questionIndex];
            this.displayQuestion(this.currentQuestion);

            this.setVisiblePane(this.uiQuestionPane);

            return true; // We found a question
        },

        /** Displays the correct answer and whetever details ar pertinent to the selected game mode */
        displayAnswer: function () {
            var self = this;

            // Update answer status text
            var correct = this.selectedAnswerIndex == this.correctAnswerIndex;

            if (correct) {
                this.uiCorrectAnswer.text(this.currentQuestion.answers[this.correctAnswerIndex].substr(1));
                this.uiAnswerResult.text("Correct!");
                this.correctAnswerCount++;
            } else if (this.playerQuit) { // walked away
                this.uiAnswerResult.text("Walking away");
            } else if (this.selectedAnswerIndex >= 0) { // incorrect
                this.uiCorrectAnswer.text("The correct answer is: " + this.currentQuestion.answers[this.correctAnswerIndex].substr(1));
                this.uiAnswerResult.text("Incorrect");
                this.incorrectAnswerCount++;
            } else { // time up
                this.uiCorrectAnswer.text("The correct answer is: " + this.currentQuestion.answers[this.correctAnswerIndex].substr(1));
                this.uiAnswerResult.text("Time up");
                this.unansweredCount++;
            }

            // Update prize items (for millionaire mode)
            var answeredQuestions = this.correctAnswerCount + this.incorrectAnswerCount + this.unansweredCount;
            var playerIsBadAndShouldFeelBad = (this.unansweredCount + this.incorrectAnswerCount) > 0;
            for (var i = 0; i < this.uiMillionItems.length; i++) {
                var itemNumber = this.uiMillionItems.length - i; // 12 to 1
                if (itemNumber == answeredQuestions) { // Current prize?
                    if (playerIsBadAndShouldFeelBad) {
                        this.uiMillionItems[i].addClass("missed-prize"); // Style indicating player did NOT get this prize
                    } else {
                        this.uiMillionItems[i].addClass("current-prize");
                    }
                } else {
                    this.uiMillionItems[i].removeClass("current-prize");
                    this.uiMillionItems[i].removeClass("missed-prize");
                }
            }

            // Update answer details (for normal mode)
            this.uiAnswerDetails.html(this.currentQuestion.details || "");
            this.uiAnswerImage.attr("src", this.answerImagePath + this.currentQuestion.image);

            // Display the answer pane
            this.setVisiblePane(this.uiAnswerPane);

            // And then...
            setTimeout(function () {
                // Display the next question, or...
                var moreQuestions = self.displayNextQuestion();

                // ...end game if no more questions
                if (!moreQuestions) {
                    self.endQuiz();
                }
            // Delay based on game mode
            }, this.millionaireMode ? this.timing.millionAnswerShown : this.timing.answerShown);
        },

        /** Updates the contents of the question pane with the specified data */
        displayQuestion: function (question) {
            this.startTimer();

            this.uiQuestion.html(question.question);
            if (question.question.length > 80) {
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

        /** Starts the question timer */
        startTimer: function () {
            if (this.questionTimer) throw "Error: timer already set.";
            this.uiTimer.removeClass("time-up");

            this.currentQuestionTime = this.timePerQuestion;
            this.questionTimer = setInterval(this.onTimer_Tick.bind(this), 1000);
            this.updateTimer();
        },

        /** Stops the question timer */
        stopTimer: function () {
            if (this.questionTimer) {
                clearInterval(this.questionTimer);
                this.questionTimer = null;
            }
        },

        /** Tick tock */
        onTimer_Tick: function (e) {
            this.currentQuestionTime--;
            this.updateTimer();

            if (this.currentQuestionTime == 0) {
                this.uiTimer.addClass("time-up");
                this.selectAnswer(-1); // -1 indicates no selection made
            }
        },

        /** Updates question timer UI */
        updateTimer: function () {
            var timerText = this.currentQuestionTime.toString();
            while (timerText.length < 2) {
                timerText = "0" + timerText;
            }

            this.uiTimer.text(timerText);
        },
    };

    // VSCode intellisense doesn't like it when you assign an object literal directly to a global variable
    TriviaGame = game;
    // Start 'er up
    TriviaGame.init();
});