const fullQuestionSet = [
    { question: "Which law is used to find thermal efficiency of an engine?", answers: [ { text: "Boyle's law", correct: false }, { text: "Newton's law", correct: false }, { text: "Carnot's law", correct: true }, { text: "Pascal's law", correct: false } ] },
    { question: "Which metal is used in aircraft structures?", answers: [ { text: "Aluminum", correct: true }, { text: "Copper", correct: false }, { text: "Lead", correct: false }, { text: "Iron", correct: false } ] },
    { question: "Which device converts mechanical energy to electrical energy?", answers: [ { text: "Compressor", correct: false }, { text: "Motor", correct: false }, { text: "Generator", correct: true }, { text: "Pump", correct: false } ] },
    { question: "SI unit of pressure is?", answers: [ { text: "Pascal", correct: true }, { text: "Newton", correct: false }, { text: "Watt", correct: false }, { text: "Bar", correct: false } ] },
    { question: "Which cycle is used in gas turbines?", answers: [ { text: "Otto cycle", correct: false }, { text: "Brayton cycle", correct: true }, { text: "Diesel cycle", correct: false }, { text: "Rankine cycle", correct: false } ] },
    { question: "Which engine component connects piston to crankshaft?", answers: [ { text: "Cylinder", correct: false }, { text: "Connecting rod", correct: true }, { text: "Camshaft", correct: false }, { text: "Valve", correct: false } ] },
    { question: "Hardness of a material is measured using?", answers: [ { text: "Tensile test", correct: false }, { text: "Brinell test", correct: true }, { text: "Fatigue test", correct: false }, { text: "Impact test", correct: false } ] },
    { question: "Which process is used to join metals?", answers: [ { text: "Welding", correct: true }, { text: "Casting", correct: false }, { text: "Milling", correct: false }, { text: "Drilling", correct: false } ] },
    { question: "The part which stores energy in mechanical systems?", answers: [ { text: "Governor", correct: false }, { text: "Flywheel", correct: true }, { text: "Brake", correct: false }, { text: "Clutch", correct: false } ] },
    { question: "Which instrument measures temperature?", answers: [ { text: "Manometer", correct: false }, { text: "Thermometer", correct: true }, { text: "Barometer", correct: false }, { text: "Tachometer", correct: false } ] },
    { question: "Lathe machine is used for?", answers: [ { text: "Welding", correct: false }, { text: "Turning", correct: true }, { text: "Drilling", correct: false }, { text: "Casting", correct: false } ] },
    { question: "Casting is done for?", answers: [ { text: "Machining parts", correct: false }, { text: "Joining parts", correct: false }, { text: "Shaping molten metal", correct: true }, { text: "Assembling", correct: false } ] },
    { question: "Rankine cycle is used in?", answers: [ { text: "Petrol engine", correct: false }, { text: "Diesel engine", correct: false }, { text: "Steam power plant", correct: true }, { text: "Gas turbine", correct: false } ] },
    { question: "Crankshaft rotates due to?", answers: [ { text: "Spark plug", correct: false }, { text: "Piston movement", correct: true }, { text: "Camshaft", correct: false }, { text: "Valve timing", correct: false } ] },
    { question: "Hydraulic press works on?", answers: [ { text: "Bernoulli's law", correct: false }, { text: "Pascal's law", correct: true }, { text: "Ohm's law", correct: false }, { text: "Newton's law", correct: false } ] },
];

let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;
let studentInfo = {
    name: "",
    rollNumber: "",
    email: ""
};

document.addEventListener('DOMContentLoaded', function() {
    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const startButton = document.getElementById("start-btn");
    const continueButton = document.getElementById("continue-btn");
    const restartButton = document.getElementById("restart-btn");
    const quizContainer = document.querySelector(".quiz");
    const resultContainer = document.querySelector(".result-container");
    const studentInfoForm = document.querySelector(".student-info-form");
    const questionCountSelect = document.querySelector(".question-count-select");
    const dropdown = document.getElementById("question-count");
    const timeDisplay = document.getElementById("time");
    const progressBar = document.getElementById("progress");
    const currentQuestionDisplay = document.getElementById("current-question");
    const totalQuestionsDisplay = document.getElementById("total-questions");
    const welcomeMessage = document.getElementById("welcome-message");
    const timerContainer = document.getElementById("timer-container");

    // Student info form fields
    const studentNameInput = document.getElementById("student-name");
    const rollNumberInput = document.getElementById("roll-number");
    const emailInput = document.getElementById("email");
    const nameError = document.getElementById("name-error");
    const rollError = document.getElementById("roll-error");
    const emailError = document.getElementById("email-error");

    // Add event listeners
    continueButton.addEventListener("click", validateStudentInfo);
    
    startButton.addEventListener("click", () => {
        const count = parseInt(dropdown.value);
        startQuiz(count);
    });

    nextButton.addEventListener("click", () => {
        if (currentQuestionIndex < selectedQuestions.length) {
            handleNextQuestion();
        }
    });

    restartButton.addEventListener("click", () => {
        hideElement(resultContainer);
        showElement(studentInfoForm);
        // Reset form fields
        studentNameInput.value = "";
        rollNumberInput.value = "";
        emailInput.value = "";
        clearErrors();
    });

    function validateStudentInfo() {
        // Reset error messages
        clearErrors();
        
        let isValid = true;
        
        // Validate name (not empty)
        if (!studentNameInput.value.trim()) {
            showError(studentNameInput, nameError, "Please enter your name");
            isValid = false;
        }
        
        // Validate roll number (not empty)
        if (!rollNumberInput.value.trim()) {
            showError(rollNumberInput, rollError, "Please enter your roll number");
            isValid = false;
        }
        
        // Validate email (format check)
        const emailValue = emailInput.value.trim();
        if (!emailValue) {
            showError(emailInput, emailError, "Please enter your email");
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailInput, emailError, "Please enter a valid email address");
            isValid = false;
        }
        
        if (isValid) {
            // Store student info
            studentInfo.name = studentNameInput.value.trim();
            studentInfo.rollNumber = rollNumberInput.value.trim();
            studentInfo.email = emailInput.value.trim();
            
            // Set welcome message
            welcomeMessage.textContent = `Welcome, ${studentInfo.name}!`;
            
            // Proceed to question selection
            fadeOut(studentInfoForm, () => {
                fadeIn(questionCountSelect);
            });
        }
    }
    
    function clearErrors() {
        nameError.textContent = "";
        rollError.textContent = "";
        emailError.textContent = "";
        studentNameInput.classList.remove("error");
        rollNumberInput.classList.remove("error");
        emailInput.classList.remove("error");
    }
    
    function showError(inputElement, errorElement, message) {
        inputElement.classList.add("error");
        errorElement.textContent = message;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function startQuiz(count) {
        selectedQuestions = getRandomQuestions(count);
        currentQuestionIndex = 0;
        score = 0;
        
        // Update total questions display
        totalQuestionsDisplay.textContent = selectedQuestions.length;
        
        // Hide question selection, show quiz
        fadeOut(questionCountSelect, () => {
            fadeIn(quizContainer);
            showQuestion();
        });
    }

    function showQuestion() {
        resetState();
        startTimer();
        
        let currentQuestion = selectedQuestions[currentQuestionIndex];
        
        // Update progress indicators
        updateProgress();
        
        // Set question text
        questionElement.innerHTML = currentQuestion.question;
        
        // Create shuffled answer buttons
        const shuffledAnswers = shuffleAnswers([...currentQuestion.answers]);
        
        shuffledAnswers.forEach((answer, index) => {
            setTimeout(() => {
                const button = document.createElement("button");
                button.innerHTML = answer.text;
                button.classList.add("btn");
                
                // Add delay for animation
                button.style.animationDelay = `${index * 0.1}s`;
                
                answerButtons.appendChild(button);
                
                if (answer.correct) {
                    button.dataset.correct = answer.correct;
                }
                
                button.addEventListener("click", selectAnswer);
            }, 0);
        });
    }

    function handleNextQuestion() {
        clearInterval(timer);
        currentQuestionIndex++;
        
        if (currentQuestionIndex < selectedQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    function selectAnswer(e) {
        clearInterval(timer);
        
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
            
            // Show the correct answer
            Array.from(answerButtons.children).forEach(button => {
                if (button.dataset.correct === "true") {
                    button.classList.add("correct");
                }
            });
        }
        
        // Disable all buttons
        Array.from(answerButtons.children).forEach(button => {
            button.disabled = true;
        });
        
        // Show next button
        nextButton.style.display = "block";
        setTimeout(() => {
            nextButton.style.opacity = "1";
            nextButton.style.transform = "translateY(0)";
        }, 50);
    }

    function startTimer() {
        timeLeft = 20;
        timeDisplay.textContent = timeLeft;
        timerContainer.classList.remove("warning");
        
        timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 5) {
                timerContainer.classList.add("warning");
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                
                // Auto-select incorrect if time runs out
                Array.from(answerButtons.children).forEach(button => {
                    button.disabled = true;
                    if (button.dataset.correct === "true") {
                        button.classList.add("correct");
                    }
                });
                
                // Show next button
                nextButton.style.display = "block";
                setTimeout(() => {
                    nextButton.style.opacity = "1";
                    nextButton.style.transform = "translateY(0)";
                }, 50);
            }
        }, 1000);
    }

    function showResults() {
        hideElement(quizContainer);
        
        // Update student details
        const studentDetails = document.getElementById("student-details");
        studentDetails.innerHTML = `
            <strong>Name:</strong> ${studentInfo.name}<br>
            <strong>Roll Number:</strong> ${studentInfo.rollNumber}<br>
            <strong>Email:</strong> ${studentInfo.email}
        `;
        
        // Calculate percentage
        const percentage = Math.round((score / selectedQuestions.length) * 100);
        
        // Create score circle
        const scoreDisplay = document.getElementById("score-display");
        scoreDisplay.innerHTML = `
            <div class="score-circle">
                <div class="score-number">${score}/${selectedQuestions.length}</div>
                <div class="score-percent">${percentage}%</div>
            </div>
        `;
        
        // Generate result message based on percentage
        const resultMessage = document.getElementById("result-message");
        let messageClass = "";
        let message = "";
        
        if (percentage >= 90) {
            message = "Excellent! You have a strong understanding of mechanical engineering concepts!";
            messageClass = "result-excellent";
        } else if (percentage >= 70) {
            message = "Good job! You have a solid grasp of mechanical engineering principles.";
            messageClass = "result-good";
        } else if (percentage >= 50) {
            message = "Average performance. Consider reviewing some of the mechanical engineering concepts.";
            messageClass = "result-average";
        } else {
            message = "Needs improvement. We recommend studying the fundamental mechanical engineering concepts again.";
            messageClass = "result-needs-improvement";
        }
        
        resultMessage.textContent = message;
        resultMessage.className = messageClass;
        
        // Show results container
        fadeIn(resultContainer);
    }

    function resetState() {
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
        
        nextButton.style.display = "none";
        nextButton.style.opacity = "0";
        nextButton.style.transform = "translateY(10px)";
    }

    function getRandomQuestions(count) {
        const shuffled = [...fullQuestionSet].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function shuffleAnswers(answers) {
        return answers.sort(() => 0.5 - Math.random());
    }

    function updateProgress() {
        const progressPercentage = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        currentQuestionDisplay.textContent = currentQuestionIndex + 1;
    }

    // Utility functions for fade in/out animations
    function hideElement(element) {
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.display = "none";
        }, 300);
    }

    function showElement(element) {
        element.style.display = "block";
        setTimeout(() => {
            element.style.opacity = "1";
        }, 50);
    }

    function fadeOut(element, callback) {
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.display = "none";
            if (callback) callback();
        }, 300);
    }

    function fadeIn(element, callback) {
        element.style.display = "block";
        setTimeout(() => {
            element.style.opacity = "1";
            if (callback) callback();
        }, 50);
    }
});