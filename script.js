document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggling
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Quiz Logic
    const quizForm = document.getElementById('career-quiz');
    if (quizForm) {
        const questions = document.querySelectorAll('.question');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const progressBar = document.getElementById('quiz-progress');
        const progressText = document.getElementById('progress-text');
        
        let currentQuestion = 0;
        
        // Show first question
        showQuestion(currentQuestion);
        
        // Next button click
        nextBtn.addEventListener('click', function() {
            if (validateQuestion(currentQuestion)) {
                currentQuestion++;
                showQuestion(currentQuestion);
            }
        });
        
        // Previous button click
        prevBtn.addEventListener('click', function() {
            currentQuestion--;
            showQuestion(currentQuestion);
        });
        
        // Form submission
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Calculate results
            const results = calculateResults();
            // Store results in localStorage
            localStorage.setItem('quizResults', JSON.stringify(results));
            // Redirect to results page
            window.location.href = 'results.html';
        });
        
        function showQuestion(index) {
            // Hide all questions
            questions.forEach(question => {
                question.classList.remove('active');
            });
            
            // Show current question
            questions[index].classList.add('active');
            
            // Update progress bar
            const progress = ((index + 1) / questions.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `Question ${index + 1} of ${questions.length}`;
            
            // Update button states
            prevBtn.disabled = index === 0;
            nextBtn.style.display = index === questions.length - 1 ? 'none' : 'block';
            submitBtn.style.display = index === questions.length - 1 ? 'block' : 'none';
        }
        
        function validateQuestion(index) {
            const currentQuestion = questions[index];
            const inputs = currentQuestion.querySelectorAll('input[type="radio"]');
            let answered = false;
            
            inputs.forEach(input => {
                if (input.checked) answered = true;
            });
            
            if (!answered) {
                alert('Please select an answer before continuing.');
                return false;
            }
            
            return true;
        }
        
        function calculateResults() {
            const results = {
                tech: 0,
                health: 0,
                edu: 0,
                creative: 0,
                outdoor: 0
            };
            
            questions.forEach(question => {
                const selected = question.querySelector('input[type="radio"]:checked');
                if (selected) {
                    results[selected.value]++;
                }
            });
            
            // Normalize results to percentages
            const totalQuestions = questions.length;
            for (const category in results) {
                results[category] = Math.round((results[category] / totalQuestions) * 100);
            }
            
            return results;
        }
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
    
    // Chatbot toggle
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    
    if (chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', function() {
            chatbotContainer.classList.toggle('active');
        });
        
        chatbotClose.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
    }
    
    // Career Paths Filter
    const pathSearch = document.getElementById('path-search');
    const pathCategory = document.getElementById('path-category');
    const pathCards = document.querySelectorAll('.path-card');
    
    if (pathSearch && pathCategory && pathCards.length > 0) {
        function filterPaths() {
            const searchTerm = pathSearch.value.toLowerCase();
            const category = pathCategory.value;
            
            pathCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const cardCategory = card.getAttribute('data-category');
                
                const matchesSearch = text.includes(searchTerm);
                const matchesCategory = category === 'all' || cardCategory === category;
                
                if (matchesSearch && matchesCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        pathSearch.addEventListener('input', filterPaths);
        pathCategory.addEventListener('change', filterPaths);
    }
});