document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSend = document.querySelector('.chatbot-send');
    const chatbotHeader = document.querySelector('.chatbot-header');
    
    // Speech Synthesis
    const synth = window.speechSynthesis;
    let speechActive = false;
    let firstClick = true; // Track if it's the first click

    // Career Path Responses
    const careerResponses = {
        'software': {
            answer: "The software industry offers careers like software development, data science, and cybersecurity. These roles typically require problem-solving skills and technical knowledge.",
            link: { text: "Explore Software Careers", url: "career-tech.html" }
        },
        'healthcare': {
            answer: "Healthcare careers include nursing, medical practice, and physical therapy. These roles focus on patient care and medical knowledge.",
            link: { text: "Explore Healthcare Careers", url: "career-health.html" }
        },
        'education': {
            answer: "Education careers range from classroom teaching to curriculum design. These roles require communication skills and subject expertise.",
            link: { text: "Explore Education Careers", url: "career-edu.html" }
        },
        'default': {
            answer: "I can help with information about software, healthcare, or education careers. Which field interests you?",
            links: [
                { text: "Software Careers", url: "career-tech.html" },
                { text: "Healthcare Careers", url: "career-health.html" },
                { text: "Education Careers", url: "career-edu.html" }
            ]
        }
    };

    // Toggle speech when clicking chatbot header
    chatbotHeader.addEventListener('click', function() {
        speechActive = true; // Always activate speech on click
        
        // Visual feedback
        this.style.backgroundColor = '#e0f7fa';
        setTimeout(() => {
            this.style.backgroundColor = '';
        }, 1000);
        
        // Stop any ongoing speech
        if (synth.speaking) {
            synth.cancel();
        }
        
        // Speak introduction on first click
        if (firstClick) {
            const intro = "Hello! I'm your career assistant. Ask me about software, healthcare, or education careers.";
            speak(intro);
            firstClick = false;
        }
    });

    // Speak function - only when active
    function speak(text) {
        if (!speechActive) return;
        
        if (synth.speaking) {
            synth.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        synth.speak(utterance);
    }

    // Original functions remain exactly the same
    function createLink(linkInfo) {
        const link = document.createElement('a');
        link.href = linkInfo.url;
        link.textContent = linkInfo.text;
        link.className = 'chatbot-link';
        link.addEventListener('click', function(e) {
            e.preventDefault();
            speak(`Opening ${linkInfo.text}`);
            setTimeout(() => {
                window.location.href = linkInfo.url;
            }, 500);
        });
        return link;
    }

    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', `${sender}-message`);
        
        if (typeof content === 'string') {
            messageDiv.textContent = content;
        } else {
            messageDiv.appendChild(content);
        }
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        if (sender === 'bot') {
            speak(typeof content === 'string' ? content : content.textContent);
        }
    }

    function generateResponse(input) {
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('software') || lowerInput.includes('programming') || lowerInput.includes('developer')) {
            return createCareerResponse('software');
        }
        else if (lowerInput.includes('health') || lowerInput.includes('medical') || lowerInput.includes('doctor')) {
            return createCareerResponse('healthcare');
        }
        else if (lowerInput.includes('education') || lowerInput.includes('teaching') || lowerInput.includes('teacher')) {
            return createCareerResponse('education');
        }
        else {
            return createDefaultResponse();
        }
    }

    function createCareerResponse(career) {
        const response = careerResponses[career];
        const container = document.createElement('div');
        
        const answer = document.createElement('p');
        answer.textContent = response.answer;
        container.appendChild(answer);
        
        const link = createLink(response.link);
        container.appendChild(document.createElement('br'));
        container.appendChild(link);
        
        return container;
    }

    function createDefaultResponse() {
        const response = careerResponses['default'];
        const container = document.createElement('div');
        
        const answer = document.createElement('p');
        answer.textContent = response.answer;
        container.appendChild(answer);
        
        response.links.forEach(linkInfo => {
            container.appendChild(document.createElement('br'));
            container.appendChild(createLink(linkInfo));
        });
        
        return container;
    }

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;
        
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, 500);
    }

    // Event listeners
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initial silent greeting (display only)
    setTimeout(() => {
        const greeting = "Hello! I'm your career assistant. Ask me about software, healthcare, or education careers.";
        addMessage(greeting, 'bot');
    }, 500);
});