import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const STAFF_ROLES = ['instructor', 'admin', 'super_admin']

function MenuLink({ to, children, onClick, accent = 'text-white/90' }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 py-3 font-mono text-sm ${accent} hover:text-brand-purple transition`}
    >
      {children}
    </Link>
  )
}

export function MenuOverlay({ isOpen, onClose }) {
  const { isAuthenticated, user, logout } = useAuth()
  const isStaff = isAuthenticated && STAFF_ROLES.includes(user?.role)

  function handleLogout() {
    logout()
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      <div className="h-full bg-ink flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 bg-surface-raised border-b border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-red/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green/80" />
          <span className="ml-2 text-xs font-mono text-white/40">menu.sh</span>
          <button
            onClick={onClose}
            className="ml-auto text-white/40 hover:text-white text-sm font-mono"
            aria-label="Close menu"
          >
            close
          </button>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <p className="text-xs font-mono text-white/30 mb-2">// navigate</p>
          <div className="border-b border-white/5 pb-2 mb-2">
            <MenuLink to="/courses" onClick={onClose}>
              📁 courses.md
            </MenuLink>
            <MenuLink to="/tutor" onClick={onClose} accent="text-brand-amber">
              📁 tutor.ai
            </MenuLink>
            <MenuLink to="/playground" onClick={onClose} accent="text-brand-green">
              📁 playground/
            </MenuLink>
            {isAuthenticated && (
              <MenuLink to="/certificates" onClick={onClose} accent="text-brand-purple">
                📁 certificates/
              </MenuLink>
            )}
          </div>

          {isStaff && (
            <div className="border-b border-white/5 pb-2 mb-2">
              <p className="text-xs font-mono text-white/30 mb-2">// staff</p>
              <MenuLink to="/admin" onClick={onClose} accent="text-brand-sky">
                📁 admin/
              </MenuLink>
              <MenuLink to="/admin/capstones" onClick={onClose} accent="text-brand-sky">
                📁 admin/capstones/
              </MenuLink>
            </div>
          )}

          <div>
            <p className="text-xs font-mono text-white/30 mb-2">// account</p>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="font-mono text-sm text-white/50 hover:text-brand-red transition py-3"
              >
                logout
              </button>
            ) : (
              <>
                <MenuLink to="/login" onClick={onClose}>
                  login.sh
                </MenuLink>
                <MenuLink to="/signup" onClick={onClose}>
                  signup.sh
                </MenuLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
