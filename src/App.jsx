import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Audits from './pages/Audits'
import Admin from './pages/Admin'
export default function App(){
  const [token, setToken] = useState(()=> localStorage.getItem('auditoiso_token') || '');
  const [user, setUser] = useState(()=> { try { return JSON.parse(localStorage.getItem('auditoiso_user')||'null'); } catch { return null; } });
  useEffect(()=>{ token ? localStorage.setItem('auditoiso_token', token) : localStorage.removeItem('auditoiso_token') },[token]);
  useEffect(()=>{ user ? localStorage.setItem('auditoiso_user', JSON.stringify(user)) : localStorage.removeItem('auditoiso_user') },[user]);
  function handleLogged(t,u){ setToken(t); setUser(u); }
  function handleLogout(){ setToken(''); setUser(null); }
  return (
    <Routes>
      <Route path="/login" element={<Login onLogged={handleLogged} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={ token ? <Dashboard token={token} user={user} onLogout={handleLogout} /> : <Navigate to="/login" /> } />
      <Route path="/audits" element={ token ? <Audits token={token} user={user} onLogout={handleLogout} /> : <Navigate to="/login" /> } />
      <Route path="/admin" element={ token && user?.role==='admin' ? <Admin token={token} user={user} onLogout={handleLogout} /> : <Navigate to="/login" /> } />
      <Route path="*" element={<Navigate to={token?'/':'/login'} />} />
    </Routes>
  )
}
