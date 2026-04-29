'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, ShieldAlert } from 'lucide-react'

export function SessionGuard() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // --- 🕵️ EL INTERCEPTOR MAESTRO ---
    const { fetch: originalFetch } = window;

    // Sobrescribimos el fetch global
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Si cualquier petición en TODA la app da 401, abrimos el modal
      if (response.status === 401) {
        setIsOpen(true);
      }

      return response;
    };

    // Limpiamos al desmontar (aunque el Layout casi nunca se desmonta)
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleLogin = () => {
    localStorage.clear(); 
    // Si usas cookies para el token, deberías borrarlas aquí también
    router.push('/login');
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="citas-modal-overlay" style={{ zIndex: 9999 }}>
      <div className="citas-modal-card" style={{ maxWidth: '400px', textAlign: 'center', border: '2px solid #e2e8f0' }}>
        
        <div className="citas-modal-header" style={{ background: '#1e293b', justifyContent: 'center' }}>
          <h2 className="flex items-center gap-2 text-white text-lg font-bold">
            <LogOut size={20} /> Sesión Finalizada
          </h2>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ 
            width: '60px', height: '60px', background: '#fff1f2', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 20px' 
          }}>
            <ShieldAlert size={30} className="text-red-600" />
          </div>
          
          <h3 className="text-xl font-black mb-2 text-slate-800 uppercase tracking-tight">Acceso Expirado</h3>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">
            Tu token de seguridad ya no es válido. Por tu seguridad, hemos cerrado la sesión automáticamente.
          </p>

          <button 
            onClick={handleLogin}
            className="citas-btn-submit"
            style={{ 
              width: '100%', 
              background: '#1e293b', 
              border: 'none',
              padding: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            VOLVER AL LOGIN
          </button>
        </div>
      </div>
    </div>
  )
}