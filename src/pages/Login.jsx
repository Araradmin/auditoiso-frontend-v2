import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../services/api'
export default function Login({ onLogged }){
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      setLoading(true);
      const data = await apiFetch('/auth/login', { method:'POST', body: JSON.stringify({ email, password }) });
      onLogged(data.token, data.user);
      nav('/');
    }catch(err){ alert(err.message || 'Error'); } finally{ setLoading(false); }
  }
  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <h2>Auditoiso</h2>
        <p>Ingresa para continuar</p>
        <div style={{marginBottom:10}}>
          <label style={{display:'block', fontSize:12}}>Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        </div>
        <div style={{marginBottom:10}}>
          <label style={{display:'block', fontSize:12}}>Contraseña</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="contraseña" />
        </div>
        <button className="btn btn-primary" disabled={loading} style={{width:'100%'}}>{loading?'Entrando…':'Entrar'}</button>
        <div style={{marginTop:10, textAlign:'center', color:'#6b7280'}}>
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </div>
      </form>
    </div>
  )
}
