// Quiz Logic
let currentQuestion = 0;
let responses = {};
let selectedArea = "";

const quizData = {
    tecnologia: [
        { q: "Qual ferramenta de IA você usa com mais frequência?", options: ["ChatGPT/Copilot", "Ferramentas de análise", "Nenhuma", "Outras"] },
        { q: "Qual seu maior medo em relação à IA?", options: ["Perda de emprego", "Obsolecência de habilidades", "Falta de tempo para aprender", "Outros"] },
        { q: "Seu nível atual de programação:", options: ["Iniciante", "Intermediário", "Avançado", "Expert"] },
        { q: "Quanto você está disposto a investir mensalmente em aprendizado?", options: ["Nada", "Até R$100", "R$101-300", "Mais de R$300"] },
        { q: "Qual é sua urgência em se adaptar à IA?", options: ["Imediata", "Em 6 meses", "Em 1 ano", "Não urgente"] },
        { q: "Qual habilidade você mais deseja desenvolver?", options: ["IA/ML", "Cloud", "Cybersecurity", "DevOps"] },
        { q: "Como você percebe o impacto da IA na sua área atualmente?", options: ["Alto", "Moderado", "Baixo", "Nenhum"] },
        { q: "Qual é sua maior barreira para aprender novas tecnologias?", options: ["Custo", "Tempo", "Complexidade", "Motivação"] }
    ],
    publicidade: [
        { q: "Qual ferramenta de IA você usa com mais frequência?", options: ["ChatGPT para copy", "Análise de público", "Design automatizado", "Nenhuma"] },
        { q: "Qual seu maior medo em relação à IA?", options: ["Perda de criatividade", "Automação de campanhas", "Falta de demanda", "Outros"] },
        { q: "Seu nível de análise de dados:", options: ["Básico", "Intermediário", "Avançado", "Expert"] },
        { q: "Quanto você está disposto a investir mensalmente em aprendizado?", options: ["Nada", "Até R$100", "R$101-300", "Mais de R$300"] },
        { q: "Qual é sua urgência em se adaptar à IA?", options: ["Imediata", "Em 6 meses", "Em 1 ano", "Não urgente"] },
        { q: "Qual é seu foco principal no trabalho?", options: ["Conteúdo", "Mídia paga", "Estratégia", "Social Media"] },
        { q: "Como você percebe o impacto da IA na sua área atualmente?", options: ["Alto", "Moderado", "Baixo", "Nenhum"] },
        { q: "Qual é sua maior barreira para aprender novas tecnologias?", options: ["Custo", "Tempo", "Complexidade", "Motivação"] }
    ],
    financas: [
        { q: "Qual ferramenta financeira você usa com mais frequência?", options: ["Excel avançado", "Python/R", "Power BI", "Nenhuma"] },
        { q: "Qual seu maior medo em relação à IA?", options: ["Automação de análises", "Perda de precisão", "Falta de controle", "Outros"] },
        { q: "Seu nível de modelagem financeira:", options: ["Básico", "Intermediário", "Avançado", "Expert"] },
        { q: "Quanto você está disposto a investir mensalmente em aprendizado?", options: ["Nada", "Até R$100", "R$101-300", "Mais de R$300"] },
        { q: "Qual é sua urgência em se adaptar à IA?", options: ["Imediata", "Em 6 meses", "Em 1 ano", "Não urgente"] },
        { q: "Qual área de interesse domina seu trabalho?", options: ["Investimentos", "Risco", "Fintech", "Compliance"] },
        { q: "Como você percebe o impacto da IA na sua área atualmente?", options: ["Alto", "Moderado", "Baixo", "Nenhum"] },
        { q: "Qual é sua maior barreira para aprender novas tecnologias?", options: ["Custo", "Tempo", "Complexidade", "Motivação"] }
    ],
    construcao: [
        { q: "Qual software você usa com mais frequência?", options: ["AutoCAD/Revit", "Excel", "ERP", "Nenhum"] },
        { q: "Qual seu maior medo em relação à IA?", options: ["Automação de projetos", "Redução de mão de obra", "Custo de adoção", "Outros"] },
        { q: "Seu nível de gestão de projetos:", options: ["Básico", "Intermediário", "Avançado", "Expert"] },
        { q: "Quanto você está disposto a investir mensalmente em aprendizado?", options: ["Nada", "Até R$100", "R$101-300", "Mais de R$300"] },
        { q: "Qual é sua urgência em se adaptar à IA?", options: ["Imediata", "Em 6 meses", "Em 1 ano", "Não urgente"] },
        { q: "Qual é sua área de foco principal?", options: ["Planejamento", "Execução", "Manutenção", "Orçamentos"] },
        { q: "Como você percebe o impacto da IA na sua área atualmente?", options: ["Alto", "Moderado", "Baixo", "Nenhum"] },
        { q: "Qual é sua maior barreira para aprender novas tecnologias?", options: ["Custo", "Tempo", "Complexidade", "Motivação"] }
    ],
    outra: [
        { q: "Qual ferramenta de IA você usa com mais frequência?", options: ["ChatGPT", "Análise de dados", "Automação", "Nenhuma"] },
        { q: "Qual seu maior medo em relação à IA?", options: ["Incerteza geral", "Perda de controle", "Falta de recursos", "Outros"] },
        { q: "Seu nível técnico atual:", options: ["Básico", "Intermediário", "Avançado", "Expert"] },
        { q: "Quanto você está disposto a investir mensalmente em aprendizado?", options: ["Nada", "Até R$100", "R$101-300", "Mais de R$300"] },
        { q: "Qual é sua urgência em se adaptar à IA?", options: ["Imediata", "Em 6 meses", "Em 1 ano", "Não urgente"] },
        { q: "Qual é seu maior desafio atual no trabalho?", options: ["Tempo", "Custo", "Complexidade", "Motivação"] },
        { q: "Como você percebe o impacto da IA na sua área atualmente?", options: ["Alto", "Moderado", "Baixo", "Nenhum"] },
        { q: "Qual é sua maior barreira para aprender novas tecnologias?", options: ["Custo", "Tempo", "Complexidade", "Motivação"] }
    ],
    saude: [
        { q: "Qual ferramenta de IA você usa com mais frequência?", options: ["Sistemas de diagnóstico", "Análise de dados", "Nenhuma", "Outras"] },
        { q: "Qual seu maior medo em relação à IA?", options: ["Erro médico", "Perda de humanização", "Regulamentação", "Outros"] },
        { q: "Seu nível de uso de tecnologia na saúde:", options: ["Básico", "Intermediário", "Avançado", "Expert"] },
        { q: "Quanto você está disposto a investir mensalmente em aprendizado?", options: ["Nada", "Até R$100", "R$101-300", "Mais de R$300"] },
        { q: "Qual é sua urgência em se adaptar à IA?", options: ["Imediata", "Em 6 meses", "Em 1 ano", "Não urgente"] },
        { q: "Qual é sua área de foco principal?", options: ["Diagnóstico", "Tratamento", "Administração", "Pesquisa"] },
        { q: "Como você percebe o impacto da IA na sua área atualmente?", options: ["Alto", "Moderado", "Baixo", "Nenhum"] },
        { q: "Qual é sua maior barreira para aprender novas tecnologias?", options: ["Custo", "Tempo", "Complexidade", "Motivação"] }
    ],
    educacao: [
        { q: "Qual ferramenta de IA você usa com mais frequência?", options: ["Plataformas EAD", "Avaliação automática", "Nenhuma", "Outras"] },
        { q: "Qual seu maior medo em relação à IA?", options: ["Substituição de professores", "Falta de personalização", "Acesso desigual", "Outros"] },
        { q: "Seu nível de uso de tecnologia educacional:", options: ["Básico", "Intermediário", "Avançado", "Expert"] },
        { q: "Quanto você está disposto a investir mensalmente em aprendizado?", options: ["Nada", "Até R$100", "R$101-300", "Mais de R$300"] },
        { q: "Qual é sua urgência em se adaptar à IA?", options: ["Imediata", "Em 6 meses", "Em 1 ano", "Não urgente"] },
        { q: "Qual é sua área de foco principal?", options: ["Ensino", "Gestão", "Pesquisa", "Treinamento"] },
        { q: "Como você percebe o impacto da IA na sua área atualmente?", options: ["Alto", "Moderado", "Baixo", "Nenhum"] },
        { q: "Qual é sua maior barreira para aprender novas tecnologias?", options: ["Custo", "Tempo", "Complexidade", "Motivação"] }
    ]
};

function openQuizForm() {
    selectedArea = "";
    responses = {};
    currentQuestion = 0;
    document.getElementById("quiz-modal").style.display = "block";
    loadQuestion();
    window.open("https://gabrielbribeiroo.github.io/FutureProofNavigator/quiz.html", "_blank");
}

function closeQuizModal() {
    document.getElementById("quiz-modal").style.display = "none";
}

function loadQuestion() {
    if (!selectedArea) {
        const areaSelect = document.createElement("select");
        areaSelect.id = "area-selection";
        areaSelect.innerHTML = `
            <option value="">Selecione sua área de atuação</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="publicidade">Publicidade/Marketing</option>
            <option value="financas">Finanças</option>
            <option value="construcao">Construção Civil</option>
            <option value="outra">Outra</option>
            <option value="saude">Saúde</option>
            <option value="educacao">Educação</option>
        `;
        areaSelect.onchange = function() { selectedArea = this.value; loadQuestion(); };
        document.getElementById("question-container").innerHTML = "<h3>Selecione sua área de atuação</h3>";
        document.getElementById("options-container").innerHTML = areaSelect.outerHTML;
        document.getElementById("next-btn").style.display = "none";
        return;
    }

    const currentQuiz = quizData[selectedArea][currentQuestion];
    document.getElementById("progress-text").textContent = `Pergunta ${currentQuestion + 1} de 8`;
    document.getElementById("progress-fill").style.width = `${((currentQuestion + 1) / 8) * 100}%`;

    document.getElementById("question-container").innerHTML = `<h3>${currentQuiz.q}</h3>`;
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = currentQuiz.options.map((opt, i) => 
        `<label class="quiz-option">
            <input type="radio" name="q${currentQuestion}" value="${opt}" onchange="selectAnswer(${currentQuestion}, '${opt}')">
            ${opt}
        </label>`
    ).join('');

    document.getElementById("prev-btn").style.display = currentQuestion > 0 ? "inline-block" : "none";
    document.getElementById("next-btn").style.display = currentQuestion < 7 ? "inline-block" : "none";
    document.getElementById("submit-quiz").style.display = currentQuestion === 7 ? "inline-block" : "none";
}

function selectAnswer(questionIndex, option) {
    responses[`q${questionIndex}`] = option;
    document.getElementById("next-btn").style.display = "inline-block";
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function nextQuestion() {
    if (!responses[`q${currentQuestion}`]) return alert("Selecione uma opção!");
    if (currentQuestion < 7) {
        currentQuestion++;
        loadQuestion();
    }
}

function submitQuiz() {
    if (!responses[`q${currentQuestion}`]) return alert("Selecione uma opção antes de finalizar!");
    
    // Calcular Score de Impacto da IA
    let iaScore = 0;
    const fearImpact = { "Perda de emprego": 4, "Obsolecência de habilidades": 3, "Falta de tempo para aprender": 2, "Outros": 1 };
    const urgencyImpact = { "Imediata": 4, "Em 6 meses": 3, "Em 1 ano": 2, "Não urgente": 1 };
    const currentImpact = { "Alto": 4, "Moderado": 3, "Baixo": 2, "Nenhum": 1 };
    
    iaScore += fearImpact[responses.q1] || 1;
    iaScore += urgencyImpact[responses.q4] || 1;
    iaScore += currentImpact[responses.q6] || 1;
    iaScore = Math.min(12, Math.max(3, iaScore)); // Normaliza entre 3 e 12

    // Preenche campos ocultos
    document.getElementById("area-hidden").value = selectedArea;
    document.getElementById("responses-hidden").value = JSON.stringify(responses);
    document.getElementById("ia-score-hidden").value = iaScore;

    // Fecha o modal e redireciona para a seção de contato
    closeQuizModal();
    window.location.href = "#contact";
    alert(`Seu Score de Impacto da IA: ${iaScore}/12. Preencha o formulário para receber seu relatório!`);
}

// Form Submission Logic
document.getElementById("lead-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const formMessage = document.getElementById("form-message");

    if (!name || !email) {
        formMessage.textContent = "Por favor, preencha todos os campos.";
        formMessage.style.color = "#e74c3c";
        return;
    }

    formMessage.textContent = "Obrigado! Seu relatório será enviado em breve.";
    formMessage.style.color = "#2ecc71";
    document.getElementById("lead-form").reset();

    console.log("Lead Capturado (Simulação):");
    console.log(`Nome: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Área: ${document.getElementById("area-hidden").value}`);
    console.log(`Respostas: ${document.getElementById("responses-hidden").value}`);
    console.log(`Score IA: ${document.getElementById("ia-score-hidden").value}`);
});

// Share Functionality
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: "FutureProof Navigator",
            text: "Prepare-se para o impacto da IA na sua carreira! Confira este recurso.",
            url: window.location.href
        }).then(() => console.log("Compartilhado com sucesso!"))
          .catch((error) => console.log("Erro ao compartilhar:", error));
    } else {
        alert("Compartilhamento não suportado neste navegador. Copie o link: " + window.location.href);
    }
}