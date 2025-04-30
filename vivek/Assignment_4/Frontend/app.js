angular.module('quizApp', [])
.controller('QuizController', function($scope, $http, $interval, $sce) {
    const API_BASE_URL = 'http://localhost:3000/api';
    
    $scope.isJoined = false;
    $scope.quizEnded = false;
    $scope.joinData = {
        code: '',
        prn: ''
    };
    $scope.currentQuestionIndex = 0;
    $scope.score = 0;
    $scope.questions = [];
    
    $scope.activeTab = 'join';
    $scope.newQuiz = {
        title: '',
        startTime: new Date(),
        durationMinutes: 30,
        questions: []
    };

    $scope.setTab = function(tab) {
        $scope.activeTab = tab;
    };

    $scope.addQuestion = function() {
        $scope.newQuiz.questions.push({
            text: '',
            options: [''],
            correctAnswer: 0
        });
    };  

    $scope.addOption = function(question) {
        question.options.push('');
    };

    $scope.removeOption = function(question, index) {
        question.options.splice(index, 1);
        if (question.correctAnswer >= index) {
            question.correctAnswer = Math.max(0, question.correctAnswer - 1);
        }
    };

    $scope.renderMarkdown = function(text) {
        if (!text) return '';
        return $sce.trustAsHtml(marked.parse(text));
    };

    $scope.createQuiz = function() {
        const quizData = {
            title: $scope.newQuiz.title,
            startTime: $scope.newQuiz.startTime,
            durationMinutes: $scope.newQuiz.durationMinutes,
            createdBy: 'admin',
            questions: $scope.newQuiz.questions.map(q => ({
                question: q.text,
                options: q.options.filter(opt => opt.trim() !== ''),
                correctAnswer: parseInt(q.correctAnswer)
            }))
        };

        $http.post(`${API_BASE_URL}/quizzes`, quizData)
            .then(function(response) {
                alert(`Quiz Created Successfully!\nQuiz Code: ${response.data.code}`);
            
                $scope.newQuiz = {
                    title: '',
                    startTime: new Date(),
                    durationMinutes: 30,
                    questions: []
                };
                $scope.addQuestion();
            })
            .catch(function(error) {
                alert('Failed to create quiz');
            });
    };

    $scope.addQuestion();

    $scope.joinQuiz = function() {
        if (!$scope.joinData.code || !$scope.joinData.prn) {
            alert('Please enter both Quiz Code and PRN');
            return;
        }

        $http.post(`${API_BASE_URL}/quizzes/join`, $scope.joinData)
            .then(function(response) {
                $scope.isJoined = true;
                getQuizIdAndLoadQuestions();
                startTimer();
            })
            .catch(function(error) {
                alert(error.data || 'Failed to join quiz');
            });
    };

    function getQuizIdAndLoadQuestions() {
        $http.get(`${API_BASE_URL}/quizzes/${$scope.joinData.code}/time`)
            .then(function(response) {
                const quizDetails = response.data;
                loadQuestions($scope.joinData.code);
            })
            .catch(function(error) {
                alert('Failed to get quiz details');
            });
    }

    function loadQuestions(quizCode) {
        $scope.loadingQuestions = true;
        $scope.questions = [];
        $scope.currentQuestionIndex = 0;

        $http.get(`${API_BASE_URL}/quizzes/${quizCode}/questions`)
            .then(function(response) {
                console.log('Questions loaded:', response.data);
                $scope.questions = response.data.map(q => ({
                    id: q.id,
                    question: q.question_text,
                    options: q.options,
                    selectedAnswer: null
                }));
                if ($scope.questions.length > 0) {
                    $scope.currentQuestion = $scope.questions[0];
                    console.log('Current question set:', $scope.currentQuestion);
                }
                $scope.isJoined = true;
            })
            .catch(function(error) {
                console.error('Error loading questions:', error);
                $scope.questionError = 'Failed to load questions';
            })
            .finally(function() {
                $scope.loadingQuestions = false;
            });
    }

    $scope.submitAnswer = function() {
        const currentQuestion = $scope.questions[$scope.currentQuestionIndex];
        if (currentQuestion.selectedAnswer === null && currentQuestion.selectedAnswer !== 0) {
            return;
        }

        const answerData = {
            prn: $scope.joinData.prn,
            questionId: currentQuestion.id,
            answer: currentQuestion.selectedAnswer
        };

        $http.post(`${API_BASE_URL}/quizzes/${$scope.joinData.code}/submit`, answerData)
            .then(function(response) {
                if ($scope.currentQuestionIndex < $scope.questions.length - 1) {
                    $scope.currentQuestionIndex++;
                    $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
                    $scope.selectedOptionIndex = null;
                } else {
                    endQuiz();
                }
            })
            .catch(function(error) {
                $scope.submitError = error.data?.error || 'Failed to submit answer';
            });
    };

   
    let timerInterval;
    function startTimer() {
        $http.get(`${API_BASE_URL}/quizzes/${$scope.joinData.code}/time`)
            .then(function(response) {
                $scope.timeRemaining = response.data.timeRemaining;
                
                timerInterval = $interval(function() {
                    if ($scope.timeRemaining > 0) {
                        $scope.timeRemaining -= 1000;
                    } else {
                        $interval.cancel(timerInterval);
                        endQuiz();
                    }
                }, 1000);
            })
            .catch(function(error) {
                $scope.joinError = 'Failed to get quiz time';
            });
    }

    function endQuiz() {
        console.log('Quiz ending. Time remaining:', $scope.timeRemaining);
        $scope.quizEnded = true;
        if (timerInterval) {
            $interval.cancel(timerInterval);
        }
       
        $http.get(`${API_BASE_URL}/quizzes/${$scope.joinData.code}/participants/${$scope.joinData.prn}/score`)
            .then(function(response) {
                $scope.finalScore = response.data.score;
            })
            .catch(function(error) {
                $scope.scoreError = 'Failed to get final score';
            });
    }

    $scope.$on('$destroy', function() {
        if (timerInterval) {
            $interval.cancel(timerInterval);
        }
    });

    $scope.checkAndAddOption = function(question) {
        if (question.options[question.options.length - 1].trim() !== '') {
            question.options.push('');
        }
    };

    $scope.selectOption = function(index) {
        $scope.currentQuestion.selectedAnswer = index;
    };
});
