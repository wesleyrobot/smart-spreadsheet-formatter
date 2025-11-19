import { useState, useEffect } from 'react'
import { getMLSuggestions } from '../services/api'

export default function MLSuggestions({ data, columns }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!data || data.length === 0) {
      setSuggestions([])
      return
    }

    setLoading(true)
    getMLSuggestions({ data, columns })
      .then(response => setSuggestions(response.data.suggestions || []))
      .catch(error => {
        console.error('Erro ao buscar sugestões:', error)
        setSuggestions([])
      })
      .finally(() => setLoading(false))
  }, [data, columns])

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/50 shadow-2xl">
      <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        ML Insights
      </h2>
      
      {loading ? (
        <div className="flex items-center gap-3 text-slate-400 py-4">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Analisando dados...</span>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm text-slate-500">
            Carregue uma planilha para receber insights
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <p className="text-sm font-semibold text-blue-300 mb-1">{suggestion.title}</p>
              <p className="text-xs text-slate-400">{suggestion.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
