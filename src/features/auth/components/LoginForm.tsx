'use client'

import { useState } from 'react'
import { useLogin } from '@/features/auth/hooks/useLogin'

export function LoginForm() {
  const { login, loading, error } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  function validate(): boolean {
    const newErrors = { email: '', password: '' }
    let valid = true
    if (!email.trim()) {
      newErrors.email = 'El correo es requerido'
      valid = false
    } else if (!email.includes('@')) {
      newErrors.email = 'Ingresa un correo válido'
      valid = false
    }
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida'
      valid = false
    }
    setErrors(newErrors)
    return valid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Email Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
          Correo institucional
        </label>
        <input
          type="email"
          placeholder="ej. l22030907@celaya.tecnm.mx"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '2px solid #E2E8F0',
            borderRadius: '12px',
            fontSize: '15px',
            color: '#0F172A',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3B82F6'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {errors.email && (
          <span style={{ fontSize: '13px', color: '#EF4444' }}>
            {errors.email}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
          Contraseña
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              paddingRight: '48px',
              border: '2px solid #E2E8F0',
              borderRadius: '12px',
              fontSize: '15px',
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3B82F6'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px 8px'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.password && (
          <span style={{ fontSize: '13px', color: '#EF4444' }}>
            {errors.password}
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '14px 16px',
          backgroundColor: '#FEE2E2',
          border: '2px solid #FECACA',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#DC2626',
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'opacity 0.2s',
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.opacity = '0.85'
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.opacity = '1'
        }}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión →'}
      </button>
    </form>
  )
}