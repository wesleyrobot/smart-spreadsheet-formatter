import { useState } from 'react'
import { BookOpen, Search, Lightbulb } from 'lucide-react'
import axios from 'axios'

export default function ExcelHelp() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const exampleQueries = [
    "Como fazer soma?",
    "Extrair domínio de email",
    "Concatenar textos",
    "Fórmula para primeiro nome",
    "Como usar SE?"
  ]

  const handleSearch = async (searchQuery) => {
    const queryToUse = searchQuery || query
    if (!queryToUse.trim()) return

    setLoading(true)
    setResponse(null)

    try {
      const res = await axios.post('http://localhost:8000/api/ml/excel-help', {
        query: queryToUse,
        columns: []
      })

      setResponse(res.data.message)
      setQuery('')
    } catch (error) {
      setResponse('❌ Erro ao buscar informações: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-slate-800/50 bg-gradient-to-r from-green-500/10 to-blue-500/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold text-slate-200">📚 Ajuda Excel</h2>
        </div>
        <span className="text-slate-400 text-sm">{isOpen ? '▼' : '▶'}</span>
      </div>

      {isOpen && (
        <div className="p-4">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Como fazer soma no Excel?"
                className="flex-1 px-3 py-2 bg-slate-950/50 border border-slate-700/50 rounded text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-green-500/50"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Example Queries */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">📖 Perguntas exemplo:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(ex)}
                  className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 border border-green-500/30 transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-sm text-slate-400">Buscando...</span>
            </div>
          )}

          {/* Response */}
          {response && !loading && (
            <div className="mt-4 p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg">
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-slate-200 text-sm whitespace-pre-line">{response}</div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300">
            <Lightbulb className="w-4 h-4 inline mr-1" />
            <strong>Dica:</strong> Pergunte sobre qualquer função Excel em português!
          </div>
        </div>
      )}
    </div>
  )
}
