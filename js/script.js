// Função para abrir o quiz em uma nova aba
const supabaseClient = (typeof window !== 'undefined' && window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY)
    ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
    : null;

async function openQuizForm() {
    if (supabaseClient) {
        try { await supabaseClient.from('events').insert({ type: 'form_click', page: 'index' }); } catch (e) {}
    }
    window.open("https://forms.gle/qm11Gqm6R2dvyva18", "_blank");
}

// Form Submission Logic
let lastSubmitAt = 0;
document.getElementById("lead-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const formMessage = document.getElementById("form-message");

    if (!name || !email) {
        formMessage.textContent = "Por favor, preencha todos os campos.";
        formMessage.style.color = "#e74c3c";
        return;
    }

    const area = document.getElementById("area-hidden").value || "outra";
    const responses = document.getElementById("responses-hidden").value;
    const iaScore = document.getElementById("ia-score-hidden").value;
    const segmentScore = document.getElementById("segment-score-hidden").value;
    const segmentGroup = document.getElementById("segment-group-hidden").value;

    if (responses && responses.length > 5000) {
        formMessage.textContent = "Respostas muito longas. Por favor, tente novamente.";
        formMessage.style.color = "#e74c3c";
        return;
    }

    const now = Date.now();
    if (now - lastSubmitAt < 30000) {
        formMessage.textContent = "Aguarde alguns segundos antes de enviar novamente.";
        formMessage.style.color = "#e74c3c";
        return;
    }
    lastSubmitAt = now;

    if (supabaseClient) {
        try {
            await supabaseClient.from('leads').insert({ name, email, area, responses, ia_score: iaScore, segment_score: segmentScore, segment_group: segmentGroup });
            await supabaseClient.from('events').insert({ type: 'submit_lead', page: 'index' });
        } catch (e) {
            console.error('Erro ao salvar lead:', e);
        }
    }

    formMessage.textContent = "Obrigado! Seu relatório será enviado em breve.";
    formMessage.style.color = "#2ecc71";
    document.getElementById("lead-form").reset();
    document.getElementById("name").focus();
    document.getElementById("contact").scrollIntoView({ behavior: 'smooth', block: 'start' });

    console.log("Lead Capturado (Simulação):");
    console.log(`Nome: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Área: ${area}`);
    console.log(`Respostas: ${responses}`);
    console.log(`Score IA: ${iaScore}`);
    console.log(`Segment Score: ${segmentScore}`);
    console.log(`Segment Group: ${segmentGroup}`);

    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient.functions.invoke('send-report', {
                body: { name, email, area, responses, iaScore, segmentScore, segmentGroup }
            });
            if (error) {
                console.error('send-report error:', error);
                formMessage.textContent = "Recebemos seus dados, mas houve erro ao enviar o relatório. Tente novamente em alguns minutos.";
                formMessage.style.color = "#e74c3c";
                try { await supabaseClient.from('events').insert({ type: 'send_report_error', page: 'index', label: String(error.message || 'unknown') }); } catch (_) {}
            } else {
                console.log('send-report ok:', data);
                try { await supabaseClient.from('events').insert({ type: 'send_report_ok', page: 'index' }); } catch (_) {}
            }
        } catch (e) {
            console.error('send-report exception:', e);
            formMessage.textContent = "Recebemos seus dados, mas houve erro ao enviar o relatório. Tente novamente em alguns minutos.";
            formMessage.style.color = "#e74c3c";
            try { await supabaseClient.from('events').insert({ type: 'send_report_exception', page: 'index' }); } catch (_) {}
        }
    }
});

// Share Functionality
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: "FutureProof Navigator",
            text: "Prepare-se para o impacto da IA na sua carreira! Confira este recurso.",
            url: window.location.href
        }).then(async () => { 
            console.log("Compartilhado com sucesso!");
            if (supabaseClient) { try { await supabaseClient.from('events').insert({ type: 'share', page: 'index' }); } catch (e) {} }
        })
          .catch((error) => console.log("Erro ao compartilhar:", error));
    } else {
        alert("Compartilhamento não suportado neste navegador. Copie o link: " + window.location.href);
    }
}

// Processar parâmetros de consulta do quiz
window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById("area-hidden").value = urlParams.get("area") || "";
    document.getElementById("responses-hidden").value = urlParams.get("responses") || "";
    document.getElementById("ia-score-hidden").value = urlParams.get("iaScore") || "";
    document.getElementById("segment-score-hidden").value = urlParams.get("segmentScore") || "";
    document.getElementById("segment-group-hidden").value = urlParams.get("segmentGroup") || "";

    // Track page view and update counters
    if (supabaseClient) {
        try { await supabaseClient.from('events').insert({ type: 'page_view', page: 'index' }); } catch (_) {}
        try { await updateStats(); } catch (_) {}
    }
};

async function updateStats() {
    const visitEl = document.getElementById('visit-count');
    const clickEl = document.getElementById('form-click-count');
    if (!visitEl || !clickEl || !supabaseClient) return;

    // Count page views
    const { count: visits } = await supabaseClient
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'page_view')
        .eq('page', 'index');

    // Count form clicks
    const { count: formClicks } = await supabaseClient
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'form_click')
        .eq('page', 'index');

    visitEl.textContent = typeof visits === 'number' ? String(visits) : '0';
    clickEl.textContent = typeof formClicks === 'number' ? String(formClicks) : '0';
}

async function trackHeroStart() {
    if (supabaseClient) { try { await supabaseClient.from('events').insert({ type: 'cta_click', page: 'index', label: 'hero_start' }); } catch (e) {} }
    openQuizForm();
}

async function missionQuiz() {
    if (supabaseClient) { try { await supabaseClient.from('events').insert({ type: 'cta_click', page: 'index', label: 'mission_quiz' }); } catch (e) {} }
    openQuizForm();
}

async function missionScore() {
    if (supabaseClient) { try { await supabaseClient.from('events').insert({ type: 'cta_click', page: 'index', label: 'mission_score' }); } catch (e) {} }
    openQuizForm();
}

async function missionReport() {
    if (supabaseClient) { try { await supabaseClient.from('events').insert({ type: 'cta_click', page: 'index', label: 'mission_report' }); } catch (e) {} }
    location.href = '#contact';
}

async function problemCta() {
    if (supabaseClient) { try { await supabaseClient.from('events').insert({ type: 'cta_click', page: 'index', label: 'problem_quiz' }); } catch (e) {} }
    openQuizForm();
}

async function solutionCta() {
    if (supabaseClient) { try { await supabaseClient.from('events').insert({ type: 'cta_click', page: 'index', label: 'solution_quiz' }); } catch (e) {} }
    openQuizForm();
}