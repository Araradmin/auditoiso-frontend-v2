import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../services/api'
export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      setLoading(true);
      await apiFetch('/auth/signup', { method:'POST', body: JSON.stringify({ name, email, password }) });
      alert('Usuario creado. Ya puedes iniciar sesión.');
      nav('/login');
    }catch(err){ alert(err.message || 'Error'); } finally{ setLoading(false); }
  }
  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <h2>Crear cuenta</h2>
        <p>Regístrate para usar Auditoiso</p>
        <div style={{marginBottom:10}}>
          <label style={{display:'block', fontSize:12}}>Nombre</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" required />
        </div>
        <div style={{marginBottom:10}}>
          <label style={{display:'block', fontSize:12}}>Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
        </div>
        <div style={{marginBottom:10}}>
          <label style={{display:'block', fontSize:12}}>Contraseña</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <button className="btn btn-primary" disabled={loading} style={{width:'100%'}}>{loading?'Creando…':'Crear cuenta'}</button>
        <div style={{marginTop:10, textAlign:'center', color:'#6b7280'}}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </form>
    </div>
  )
}
