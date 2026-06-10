// ==============================================
// THIS IS THE INTERACTIVE QUIZ APP AREA
// ==============================================

class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.highScore = this.loadHighScore();
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.attachEventListeners();
        this.updateHighScore();
    }

    cacheDOMElements() {
        // The screens area
        this.homeScreen = document.getElementById('homeScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.loadingScreen = document.getElementById('loadingScreen');

        // The home screen elements area
        this.categorySelect = document.getElementById('category');
        this.difficultySelect = document.getElementById('difficulty');
        this.numQuestionsSelect = document.getElementById('numQuestions');
        this.startQuizBtn = document.getElementById('startQuiz');

        // The quiz screen elements area
        this.currentQuestionEl = document.getElementById('currentQuestion');
        this.totalQuestionsEl = document.getElementById('totalQuestions');
        this.currentScoreEl = document.getElementById('currentScore');
        this.progressBar = document.getElementById('progressBar');
        this.timerEl = document.getElementById('timer');
        this.difficultyBadge = document.getElementById('difficultyBadge');
        this.questionText = document.getElementById('questionText');
        this.answersContainer = document.getElementById('answersContainer');
        this.quitQuizBtn = document.getElementById('quitQuiz');

        // The Results screen elements area
        this.resultsIcon = document.getElementById('resultsIcon');
        this.resultsTitle = document.getElementById('resultsTitle');
        this.resultsMessage = document.getElementById('resultsMessage');
        this.correctAnswersEl = document.getElementById('correctAnswers');
        this.wrongAnswersEl = document.getElementById('wrongAnswers');
        this.finalScoreEl = document.getElementById('finalScore');
        this.accuracyEl = document.getElementById('accuracy');
        this.playAgainBtn = document.getElementById('playAgain');
        this.goHomeBtn = document.getElementById('goHome');

        // The high score area
        this.highScoreEl = document.getElementById('highScore');
    }

    attachEventListeners() {
        this.startQuizBtn.addEventListener('click', () => this.startQuiz());
        this.quitQuizBtn.addEventListener('click', () => this.quitQuiz());
        this.playAgainBtn.addEventListener('click', () => this.restartQuiz());
        this.goHomeBtn.addEventListener('click', () => this.goToHome());
    }

    async startQuiz() {
        const category = this.categorySelect.value;
        const difficulty = this.difficultySelect.value;
        const amount = this.numQuestionsSelect.value;

        this.showScreen('loading');

        try {
            const response = await fetch(
                `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
            );
            const data = await response.json();

            if (data.response_code === 0) {
                this.questions = data.results;
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.correctAnswers = 0;
                this.wrongAnswers = 0;
                this.showScreen('quiz');
                this.loadQuestion();
            } else {
                this.showNotification('Failed to load questions. Please try again.', 'error');
                this.showScreen('home');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            this.showNotification('Network error. Please check your connection.', 'error');
            this.showScreen('home');
        }
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        
        // The update progress area
        this.currentQuestionEl.textContent = this.currentQuestionIndex + 1;
        this.totalQuestionsEl.textContent = this.questions.length;
        this.currentScoreEl.textContent = this.score;
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;

        // The update difficulty badge area
        this.difficultyBadge.textContent = question.difficulty;
        this.difficultyBadge.className = `difficulty-badge ${question.difficulty}`;

        // The display question area
        this.questionText.innerHTML = this.decodeHTML(question.question);

        // The shuffle and display answers area
        const answers = [...question.incorrect_answers, question.correct_answer];
        this.shuffleArray(answers);

        this.answersContainer.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];
        
        answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.innerHTML = `
                <span class="answer-letter">${letters[index]}</span>
                <span>${this.decodeHTML(answer)}</span>
            `;
            button.addEventListener('click', () => this.selectAnswer(answer, button));
            this.answersContainer.appendChild(button);
        });

        // The start timer area
        this.startTimer();
    }

    selectAnswer(selectedAnswer, button) {
        clearInterval(this.timer);
        
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedAnswer === question.correct_answer;

        // The disable all buttons area
        const allButtons = this.answersContainer.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => {
            btn.classList.add('disabled');
            const answerText = btn.querySelector('span:last-child').textContent;
            if (this.decodeHTML(question.correct_answer) === answerText) {
                btn.classList.add('correct');
            }
        });

        if (isCorrect) {
            button.classList.add('correct');
            this.correctAnswers++;
            const points = question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 15 : 20;
            this.score += points;
            this.currentScoreEl.textContent = this.score;
            this.showNotification('Correct! +' + points + ' points', 'success');
        } else {
            button.classList.add('wrong');
            this.wrongAnswers++;
            this.showNotification('Wrong answer!', 'error');
        }

        // The move to next question after delay area
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.loadQuestion();
        }, 2000);
    }

    startTimer() {
        this.timeLeft = 30;
        this.timerEl.textContent = this.timeLeft;
        this.timerEl.parentElement.classList.remove('warning');

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerEl.textContent = this.timeLeft;

            if (this.timeLeft <= 10) {
                this.timerEl.parentElement.classList.add('warning');
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timeOut();
            }
        }, 1000);
    }

    timeOut() {
        const question = this.questions[this.currentQuestionIndex];
        this.wrongAnswers++;
        
        // The highlight correct answer area
        const allButtons = this.answersContainer.querySelectorAll('.answer-btn');
        allButtons.forEach(btn => {
            btn.classList.add('disabled');
            const answerText = btn.querySelector('span:last-child').textContent;
            if (this.decodeHTML(question.correct_answer) === answerText) {
                btn.classList.add('correct');
            }
        });

        this.showNotification('Time\'s up!', 'error');

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.loadQuestion();
        }, 2000);
    }

    showResults() {
        clearInterval(this.timer);
        this.showScreen('results');

        // The update stats area
        this.correctAnswersEl.textContent = this.correctAnswers;
        this.wrongAnswersEl.textContent = this.wrongAnswers;
        this.finalScoreEl.textContent = this.score;
        
        const accuracy = Math.round((this.correctAnswers / this.questions.length) * 100);
        this.accuracyEl.textContent = accuracy + '%';

        // The update high score area
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.updateHighScore();
            this.showNotification('New High Score! 🎉', 'success');
        }

        // The set results icon and message based on performance area
        this.resultsIcon.className = 'results-icon';
        if (accuracy >= 80) {
            this.resultsIcon.classList.add('excellent');
            this.resultsIcon.innerHTML = '<i class="fas fa-trophy"></i>';
            this.resultsTitle.textContent = 'Excellent!';
            this.resultsMessage.textContent = 'Outstanding performance! You\'re a quiz master!';
        } else if (accuracy >= 60) {
            this.resultsIcon.classList.add('good');
            this.resultsIcon.innerHTML = '<i class="fas fa-star"></i>';
            this.resultsTitle.textContent = 'Good Job!';
            this.resultsMessage.textContent = 'Great work! Keep it up!';
        } else if (accuracy >= 40) {
            this.resultsIcon.classList.add('average');
            this.resultsIcon.innerHTML = '<i class="fas fa-thumbs-up"></i>';
            this.resultsTitle.textContent = 'Not Bad!';
            this.resultsMessage.textContent = 'You can do better! Try again!';
        } else {
            this.resultsIcon.classList.add('poor');
            this.resultsIcon.innerHTML = '<i class="fas fa-redo"></i>';
            this.resultsTitle.textContent = 'Keep Trying!';
            this.resultsMessage.textContent = 'Practice makes perfect! Don\'t give up!';
        }
    }

    quitQuiz() {
        if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
            clearInterval(this.timer);
            this.showScreen('home');
        }
    }

    restartQuiz() {
        this.startQuiz();
    }

    goToHome() {
        this.showScreen('home');
    }

    showScreen(screen) {
        this.homeScreen.classList.remove('active');
        this.quizScreen.classList.remove('active');
        this.resultsScreen.classList.remove('active');
        this.loadingScreen.classList.remove('active');

        switch (screen) {
            case 'home':
                this.homeScreen.classList.add('active');
                break;
            case 'quiz':
                this.quizScreen.classList.add('active');
                break;
            case 'results':
                this.resultsScreen.classList.add('active');
                break;
            case 'loading':
                this.loadingScreen.classList.add('active');
                break;
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    loadHighScore() {
        return parseInt(localStorage.getItem('quizHighScore')) || 0;
    }

    saveHighScore() {
        localStorage.setItem('quizHighScore', this.highScore);
    }

    updateHighScore() {
        this.highScoreEl.textContent = this.highScore;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInRight 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// The notification animations area
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// The app initialization area
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
    console.log('🧠 Quiz App initialized');
});
