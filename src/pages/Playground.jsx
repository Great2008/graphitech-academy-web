import { useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import { EditorWindow } from '../components/EditorWindow'

const LANGUAGES = [
  { key: 'python', label: 'Python', ext: 'py', starter: 'print("Hello, GraphiTech Academy!")' },
  { key: 'javascript', label: 'JavaScript', ext: 'js', starter: 'console.log("Hello, GraphiTech Academy!")' },
  { key: 'typescript', label: 'TypeScript', ext: 'ts', starter: 'const msg: string = "Hello!";\nconsole.log(msg);' },
  { key: 'java', label: 'Java', ext: 'java', starter: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello!");\n  }\n}' },
  { key: 'c', label: 'C', ext: 'c', starter: '#include <stdio.h>\n\nint main() {\n  printf("Hello!\\n");\n  return 0;\n}' },
  { key: 'cpp', label: 'C++', ext: 'cpp', starter: '#include <iostream>\n\nint main() {\n  std::cout << "Hello!" << std::endl;\n  return 0;\n}' },
  { key: 'go', label: 'Go', ext: 'go', starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello!")\n}' },
  { key: 'ruby', label: 'Ruby', ext: 'rb', starter: 'puts "Hello, GraphiTech Academy!"' },
  { key: 'php', label: 'PHP', ext: 'php', starter: '<?php\necho "Hello!";' },
]

const STATUS_COLORS = {
  Accepted: 'text-brand-green',
  'Compilation Error': 'text-brand-amber',
  'Runtime Error': 'text-brand-red',
}

export default function Playground() {
  const { isAuthenticated } = useAuth()
  const [langKey, setLangKey] = useState('python')
  const [code, setCode] = useState(LANGUAGES[0].starter)
  const [stdin, setStdin] = useState('')
  const [showStdin, setShowStdin] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const activeLang = LANGUAGES.find((l) => l.key === langKey)

  function handleLangChange(key) {
    const lang = LANGUAGES.find((l) => l.key === key)
    setLangKey(key)
    setCode(lang.starter)
    setResult(null)
    setError('')
  }

  async function handleRun() {
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await api.post('/api/playground/run', {
        language: langKey,
        source_code: code,
        stdin: stdin || undefined,
      })
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-73px-42px)] flex items-center justify-center px-6 text-center">
        <p className="text-white/40 font-mono text-sm">log in to use the coding playground.</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px-42px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        <p className="font-mono text-xs text-brand-green mb-1">$ ./playground</p>
        <h1 className="font-display font-bold text-xl text-white mb-4">Code Playground</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {LANGUAGES.map((l) => (
            <button
              key={l.key}
              onClick={() => handleLangChange(l.key)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                langKey === l.key
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-white/50 border border-white/5 hover:border-white/20'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <EditorWindow label={`main.${activeLang.ext}`}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={12}
            className="w-full bg-transparent font-mono text-sm text-white/90 focus:outline-none resize-y"
          />
        </EditorWindow>

        <button
          onClick={() => setShowStdin(!showStdin)}
          className="text-xs font-mono text-white/40 mt-3 mb-1"
        >
          {showStdin ? '− hide stdin' : '+ add stdin'}
        </button>
        {showStdin && (
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Input passed to your program…"
            rows={3}
            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white/80 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-purple mb-3"
          />
        )}

        <button
          onClick={handleRun}
          disabled={loading}
          className="w-full bg-brand-purple text-white font-semibold py-3 rounded-full shadow-lg shadow-brand-purple/20 hover:opacity-90 transition disabled:opacity-50 mt-2"
        >
          {loading ? 'Running…' : '▶ Run'}
        </button>

        {error && (
          <p className="text-sm text-brand-red bg-brand-red/10 border border-brand-red/20 rounded-lg px-4 py-2 mt-4 font-mono">
            {error}
          </p>
        )}

        {result && (
          <EditorWindow label="output" className="mt-4">
            <p className={`font-mono text-xs mb-3 ${STATUS_COLORS[result.status] || 'text-white/60'}`}>
              &gt; {result.status}
            </p>
            {result.compile_output && (
              <>
                <p className="text-xs text-white/30 font-mono mb-1">compile output:</p>
                <pre className="text-sm text-brand-amber font-mono whitespace-pre-wrap mb-3">
                  {result.compile_output}
                </pre>
              </>
            )}
            {result.stdout && (
              <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap mb-3">
                {result.stdout}
              </pre>
            )}
            {result.stderr && (
              <>
                <p className="text-xs text-white/30 font-mono mb-1">stderr:</p>
                <pre className="text-sm text-brand-red font-mono whitespace-pre-wrap">
                  {result.stderr}
                </pre>
              </>
            )}
            {!result.stdout && !result.stderr && !result.compile_output && (
              <p className="text-white/30 font-mono text-sm">(no output)</p>
            )}
          </EditorWindow>
        )}
      </div>
    </div>
  )
}
