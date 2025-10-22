// Função para abrir o quiz em uma nova aba
function openQuizForm() {
    window.open("quiz.html", "_blank");
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

// Processar parâmetros de consulta do quiz
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById("area-hidden").value = urlParams.get("area") || "";
    document.getElementById("responses-hidden").value = urlParams.get("responses") || "";
    document.getElementById("ia-score-hidden").value = urlParams.get("iaScore") || "";
};