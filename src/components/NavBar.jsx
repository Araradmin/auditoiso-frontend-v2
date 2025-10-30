import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
export default function NavBar({ user, onLogout }){
  const nav = useNavigate();
  function logout(){ onLogout(); nav('/login'); }
  return (
    <div className="header">
      <div className="brand">
        <div className="logo"></div>
        <div>
          <h1 className="title">Auditoiso</h1>
          <p className="subtitle">Auditorías ISO 9001 / 14001</p>
        </div>
      </div>
      <div className="row" style={{alignItems:'center'}}>
        <Link className="btn btn-outline" to="/">Checklist</Link>
        <Link className="btn btn-outline" to="/audits">Mis auditorías</Link>
        {user?.role==='admin' && <Link className="btn btn-outline" to="/admin">Admin</Link>}
        <button className="btn btn-primary" onClick={logout}>Salir</button>
      </div>
    </div>
  )
}
