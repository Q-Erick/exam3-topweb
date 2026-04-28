'use client'

import { LoginForm } from '@/features/auth/components/LoginForm'
import { SupportLink } from './components/SupportLink'

export default function LoginPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '1000px', backgroundColor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', display: 'flex', minHeight: '520px' }}>
        
        {/* Panel izquierdo — decorativo */}
        <div style={{ display: 'flex', width: '42%', backgroundImage: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '32px' }} className="hidden md:flex">
            <div style={{
            width: '160px',
            height: '160px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
            <img
                src="/logo.png"
                alt="Logo TecNM Celaya"
                style={{ width: '110px', height: '110px', objectFit: 'contain' }}
            />
            </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, margin: 0 }}>Portal Estudiantil</h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginTop: '8px', margin: 0 }}>TecNM Campus Celaya</p>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '56px', paddingRight: '56px', paddingTop: '48px', paddingBottom: '48px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#0F172A', margin: 0, marginBottom: '12px' }}>Bienvenido de nuevo</h2>
            <p style={{ color: '#64748B', fontSize: '16px', marginTop: '12px', margin: 0 }}>
              Ingresa tus credenciales institucionales para continuar.
            </p>
          </div>

          <LoginForm />

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '32px' }}>
            ¿Problemas para acceder?{' '}
            <SupportLink>Contacta a soporte</SupportLink>
          </p>
        </div>
      </div>
    </main>
  )
}