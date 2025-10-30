import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { apiFetch, API_BASE } from '../services/api'
export default function Audits({ token, user, onLogout }){
  const [audits, setAudits] = useState([]);
  async function load(){ try{ setAudits(await apiFetch('/audits', {}, token)); }catch(e){ alert(e.message); } }
  useEffect(()=>{ load(); },[]);
  async function downloadServerPdf(a){
    try{
      const res = await fetch(`${API_BASE.replace('/api','')}/api/reports/${a._id}/pdf`, { headers: { 'Authorization': 'Bearer ' + token } });
      if (!res.ok) throw new Error('No se pudo generar el PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const ael = document.createElement('a'); ael.href = url; ael.download = `${a.name}.pdf`; document.body.appendChild(ael); ael.click(); ael.remove();
    }catch(e){ alert(e.message || 'Error PDF'); }
  }
  return (
    <div className="container">
      <div className="card">
        <NavBar user={user} onLogout={onLogout} />
        <h3 style={{marginTop:0}}>Mis auditorías</h3>
        {audits.length===0 ? <div className="item-meta">No hay auditorías guardadas.</div> : (
          <div className="list">
            {audits.map(a => (
              <div key={a._id} className="card" style={{padding:'12px', marginBottom:10}}>
                <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <div className="item-title">{a.name}</div>
                    <div className="item-meta">{a.standard} · {new Date(a.createdAt).toLocaleString()} · {a.score.percent}%</div>
                  </div>
                  <div className="row">
                    <button className="btn btn-outline" onClick={()=>downloadServerPdf(a)}>PDF</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
