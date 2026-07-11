import { Link, useLocation } from 'react-router-dom'
import { EditorWindow } from '../components/EditorWindow'

export default function NotFound() {
  const location = useLocation()

  return (
    <div className="min-h-[calc(100vh-73px-42px)] flex items-center justify-center px-6 py-12">
      <EditorWindow label="404.md" className="w-full max-w-md">
        <p className="font-mono text-xs text-brand-red mb-6">
          $ cat {location.pathname}
        </p>
        <h1 className="font-display font-extrabold text-3xl text-white mb-2">
          404
        </h1>
        <p className="font-display font-semibold text-lg text-white/80 mb-4">
          Page not found
        </p>
        <p className="text-white/50 mb-8 leading-relaxed">
          Nothing lives at <span className="font-mono text-brand-amber">{location.pathname}</span>.
          It may have moved, or the link might be wrong.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="text-center bg-brand-purple text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-brand-purple/20 hover:opacity-90 transition"
          >
            Back to Home
          </Link>
          <Link
            to="/courses"
            className="text-center border border-white/10 text-white/80 px-6 py-3 rounded-full font-semibold hover:bg-white/5 transition"
          >
            Browse Courses
          </Link>
        </div>
        <p className="font-mono text-xs text-white/30 mt-8">
          &gt; error: ENOENT — no such route
        </p>
      </EditorWindow>
    </div>
  )
}
