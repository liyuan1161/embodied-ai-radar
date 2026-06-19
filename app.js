const opportunities = [
  {
    title: '中小工厂视觉巡检 Agent',
    desc: '为没有自动化团队的工厂提供低成本视觉巡检方案：相机 + 多模态模型 + 缺陷报告。',
    tags: ['目标客户：中小制造厂', 'MVP：7天可交付', '客单价：2-10万']
  },
  {
    title: '机器人产品出海情报服务',
    desc: '跟踪海外家庭机器人、割草机器人、陪伴机器人新品，给跨境卖家提供选品和竞品报告。',
    tags: ['目标客户：跨境卖家', 'MVP：周报', '客单价：199-999/月']
  },
  {
    title: '具身智能企业内训课',
    desc: '面向传统企业创新部门，讲清楚具身智能能做什么、不能做什么、如何选择试点场景。',
    tags: ['目标客户：企业创新部', 'MVP：2小时课', '客单价：1-5万']
  }
];

function renderOpportunities() {
  const root = document.getElementById('opportunityList');
  root.innerHTML = opportunities.map(item => `
    <article class="card">
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <div class="metric">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    </article>
  `).join('');
}

function getLeads() {
  try { return JSON.parse(localStorage.getItem('embodied_ai_leads') || '[]'); }
  catch { return []; }
}

function saveLead(lead) {
  const leads = getLeads();
  leads.push({ ...lead, createdAt: new Date().toISOString() });
  localStorage.setItem('embodied_ai_leads', JSON.stringify(leads));
}

function toCsv(rows) {
  const headers = ['name', 'contact', 'interest', 'budget', 'createdAt'];
  const escape = value => `"${String(value || '').replaceAll('"', '""')}"`;
  return [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h])).join(','))].join('\n');
}

function downloadCsv() {
  const leads = getLeads();
  if (!leads.length) {
    alert('还没有线索，先提交一条测试数据。');
    return;
  }
  const blob = new Blob([toCsv(leads)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `具身智能线索-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function bindForm() {
  const form = document.getElementById('leadForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    saveLead(data);
    msg.textContent = '提交成功。MVP 阶段线索已保存在本机浏览器，可点击“导出线索 CSV”。';
    form.reset();
  });
  document.getElementById('exportBtn').addEventListener('click', downloadCsv);
}

renderOpportunities();
bindForm();
