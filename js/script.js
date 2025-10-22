document.getElementById("lead-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const formMessage = document.getElementById("form-message");

    if (!name || !email) {
        formMessage.textContent = "Por favor, preencha todos os campos.";
        formMessage.style.color = "#ffc107";
        return;
    }

    // Simulate a successful submission for the static page
    formMessage.textContent = "Obrigado! Suas informações foram enviadas com sucesso.";
    formMessage.style.color = "#28a745";
    document.getElementById("lead-form").reset();

    // In a real application, you would send the data to a server here.
    // For GitHub Pages, we can log to the console as a demonstration.
    console.log("Lead Capturado (Simulação):");
    console.log(`Nome: ${name}`);
    console.log(`Email: ${email}`);
});
