(async function() {
  const msg = document.getElementById('dash-message');
  const ctaCtx = document.getElementById('ctaChart').getContext('2d');
  const segCtx = document.getElementById('segmentChart').getContext('2d');

  const supabaseClient = (typeof window !== 'undefined' && window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY)
    ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
    : null;

  if (!supabaseClient) {
    msg.textContent = 'Configure SUPABASE_URL e SUPABASE_ANON_KEY para carregar dados.';
    msg.style.color = '#e74c3c';
    return;
  }

  async function fetchCtaData() {
    const { data, error } = await supabaseClient
      .from('events')
      .select('label')
      .eq('type', 'cta_click')
      .eq('page', 'index')
      .gte('created_at', new Date(Date.now() - 1000*60*60*24*30).toISOString());
    if (error) return {};
    const counts = {};
    (data || []).forEach(e => { counts[e.label] = (counts[e.label] || 0) + 1; });
    return counts;
  }

  async function fetchSegmentData() {
    const { data, error } = await supabaseClient
      .from('leads')
      .select('segment_group');
    if (error) return {};
    const counts = {};
    (data || []).forEach(r => { const k = r.segment_group || 'Sem Grupo'; counts[k] = (counts[k] || 0) + 1; });
    return counts;
  }

  async function loadCharts() {
    msg.textContent = 'Carregando...';
    const [ctaCounts, segCounts] = await Promise.all([fetchCtaData(), fetchSegmentData()]);

    const ctaLabels = Object.keys(ctaCounts);
    const ctaValues = ctaLabels.map(l => ctaCounts[l]);
    const segLabels = Object.keys(segCounts);
    const segValues = segLabels.map(l => segCounts[l]);

    new Chart(ctaCtx, {
      type: 'bar',
      data: {
        labels: ctaLabels,
        datasets: [{ label: 'Cliques por CTA (30d)', data: ctaValues, backgroundColor: '#3498db' }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    new Chart(segCtx, {
      type: 'doughnut',
      data: {
        labels: segLabels,
        datasets: [{ label: 'Segmentos', data: segValues, backgroundColor: ['#1abc9c','#3498db','#9b59b6','#f1c40f','#e67e22','#e74c3c'] }]
      },
      options: { responsive: true }
    });

    msg.textContent = '';
  }

  window.reloadData = function() { location.reload(); }

  loadCharts();
})();
