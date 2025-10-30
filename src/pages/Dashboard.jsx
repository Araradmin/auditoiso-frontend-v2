import React, { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import NavBar from '../components/NavBar'
import { apiFetch } from '../services/api'
function formatDateTime(date = new Date()) { return date.toLocaleString(); }
export default function Dashboard({ token, user, onLogout }){
  const [standards, setStandards] = useState([]);
  const [byStd, setByStd] = useState({});
  const [standard, setStandard] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentAuditName, setCurrentAuditName] = useState('');
  const [notes, setNotes] = useState('');
  const [auditor, setAuditor] = useState(user?.name || '');

  useEffect(()=>{
    (async ()=>{
      try{
        const defaults = await apiFetch('/checklists/defaults', {}, token);
        const map = {};
        for (const c of defaults){
          if (!map[c.standard]) map[c.standard] = [];
          (c.items||[]).forEach(it => map[c.standard].push({ id: it.id, text: it.text, weight: it.weight||1 }));
        }
        const stds = Object.keys(map);
        setByStd(map); setStandards(stds);
        if (stds.length){ setStandard(stds[0]); setChecklist(map[stds[0]]); }
      }catch(e){ alert('No se pudo cargar checklist desde servidor'); }
    })();
  }, [token]);

  useEffect(()=>{ if (standard && byStd[standard]){ setChecklist(byStd[standard]); setResponses({}); } }, [standard, byStd]);
  function toggleResponse(id){ setResponses(prev=>({ ...prev, [id]: !prev[id] })); }
  function calculateScore(items = checklist, resp = responses){
    let totalPossible = 0, totalAchieved = 0;
    for (const it of items){ totalPossible += it.weight||1; if (resp[it.id]) totalAchieved += it.weight||1; }
    const percent = totalPossible ? Math.round((totalAchieved/totalPossible)*100) : 0;
    return { totalPossible, totalAchieved, percent };
  }
  const liveScore = useMemo(()=>calculateScore(), [responses, checklist]);
  async function finalizeAudit(){
    const payload = {
      name: currentAuditName || `Auditoría ${standard} - ${formatDateTime(new Date())}`,
      standard,
      checklist: checklist.map(it => ({ ...it, passed: !!responses[it.id] })),
      notes,
      auditor: auditor || user?.name || '',
      score: calculateScore()
    };
    try{
      await apiFetch('/audits', { method:'POST', body: JSON.stringify(payload) }, token);
      alert('Auditoría guardada');
      setResponses({}); setNotes(''); setCurrentAuditName('');
    }catch(e){ alert(e.message || 'Error al guardar'); }
  }
  return (
    <div className="container">
      <div className="card">
        <NavBar user={user} onLogout={onLogout} />
        <div className="row">
          <select className="select" value={standard} onChange={e=>setStandard(e.target.value)} style={{maxWidth:220}}>
            {standards.map(s => <option key={s}>{s}</option>)}
          </select>
          <input className="input" placeholder="Nombre de auditoría (opcional)" value={currentAuditName} onChange={e=>setCurrentAuditName(e.target.value)} />
          <input className="input" placeholder="Auditor" value={auditor} onChange={e=>setAuditor(e.target.value)} />
        </div>
        <div style={{marginTop:12}}>
          <div className="row" style={{alignItems:'center', justifyContent:'space-between'}}>
            <div style={{fontWeight:700}}>Progreso</div>
            <div className="badge">{liveScore.totalAchieved} / {liveScore.totalPossible} ({liveScore.percent}%)</div>
          </div>
          <div className="progress" title={`${liveScore.percent}%`}>
            <div style={{width:`${liveScore.percent}%`}} />
          </div>
        </div>
        <div style={{marginTop:12}}>
          <ul className="list">
            {checklist.map(it => (
              <li key={it.id} className="item">
                <input type="checkbox" checked={!!responses[it.id]} onChange={()=>toggleResponse(it.id)} />
                <div>
                  <div className="item-title">{it.text}</div>
                  <div className="item-meta">Peso: {it.weight}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col" style={{marginTop:12}}>
          <label style={{fontWeight:700}}>Observaciones</label>
          <textarea className="textarea" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
        <div className="row" style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={finalizeAudit}>Finalizar y guardar</button>
        </div>
      </div>
    </div>
  )
}
