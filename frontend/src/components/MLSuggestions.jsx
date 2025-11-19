import { useState, useEffect } from 'react'
import { Sparkles, Loader } from 'lucide-react'
import { getMLSuggestions } from '../services/api'

export default function MLSuggestions({ data, columns }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!data || data.length === 0) return

    setLoading(true)
    getMLSuggestions({ data, columns })
      .then(response => setSuggestions(response.data.suggestions || []))
      .catch(error => console.error('Erro ao buscar sugestões:', error))
      .finally(() => setLoading(false))
  }, [data, columns])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        ML Sugestões
      </h2>
      
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm">Analisando...</span>
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-sm text-gray-500">
          Carregue dados para ver sugestões inteligentes
        </p>
      ) : (
        <div className="space-y-2">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm font-medium">{suggestion.title}</p>
              <p className="text-xs text-gray-600">{suggestion.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
