import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { apiFetch } from '../services/api'
export default function Admin({ token, user, onLogout }){
  const [users, setUsers] = useState([]);
  const [audits, setAudits] = useState([]);
  async function load(){
    try{
      const us = await apiFetch('/auth/users', {}, token);
      const au = await apiFetch('/admin/audits', {}, token);
      setUsers(us); setAudits(au);
    }catch(e){ alert('Debes ser admin para ver este panel.'); }
  }
  useEffect(()=>{ load(); },[]);
  async function setRole(id, role){
    try{ await apiFetch(`/auth/users/${id}/role`, { method:'PATCH', body: JSON.stringify({ role }) }, token); load(); }
    catch(e){ alert(e.message); }
  }
  async function deleteAudit(id){
    if (!confirm('¿Eliminar la auditoría?')) return;
    try{ await apiFetch(`/admin/audits/${id}`, { method:'DELETE' }, token); load(); }
    catch(e){ alert(e.message); }
  }
  return (
    <div className="container">
      <div className="card">
        <NavBar user={user} onLogout={onLogout} />
        <div className="row" style={{alignItems:'center', justifyContent:'space-between'}}>
          <h3 style={{margin:0}}>Panel de administración</h3>
          <span className="badge">Admin</span>
        </div>
        <div className="row" style={{marginTop:16, gap:16}}>
          <div className="card" style={{flex:'1 1 380px'}}>
            <h4 style={{marginTop:0}}>Usuarios</h4>
            {users.length===0 ? <div className="item-meta">Sin usuarios.</div> : (
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead><tr style={{textAlign:'left'}}><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name||'-'}</td><td>{u.email}</td><td>{u.role}</td>
                      <td style={{textAlign:'right'}}>
                        {u.role!=='admin' ? (
                          <button className="btn btn-outline" onClick={()=>setRole(u.id,'admin')}>Hacer admin</button>
                        ) : (
                          <button className="btn btn-outline" onClick={()=>setRole(u.id,'user')}>Quitar admin</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="card" style={{flex:'2 1 520px'}}>
            <h4 style={{marginTop:0}}>Auditorías</h4>
            {audits.length===0 ? <div className="item-meta">Sin auditorías.</div> : (
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead><tr style={{textAlign:'left'}}><th>Nombre</th><th>Norma</th><th>Fecha</th><th>Score</th><th></th></tr></thead>
                <tbody>
                  {audits.map(a => (
                    <tr key={a._id}>
                      <td>{a.name}</td><td>{a.standard}</td><td>{new Date(a.createdAt).toLocaleString()}</td><td>{a.score?.percent}%</td>
                      <td style={{textAlign:'right'}}><button className="btn btn-danger" onClick={()=>deleteAudit(a._id)}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
