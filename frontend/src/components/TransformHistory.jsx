import { useState } from 'react'
import { History, RotateCcw, RotateCw, Trash2 } from 'lucide-react'

export default function TransformHistory({ history, onUndo, onRedo, onClear, currentIndex }) {
  const [isOpen, setIsOpen] = useState(true)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-slate-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-200">🔄 Histórico</h2>
          {history.length > 0 && (
            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
              {history.length}
            </span>
          )}
        </div>
        <span className="text-slate-400 text-sm">{isOpen ? '▼' : '▶'}</span>
      </div>

      {isOpen && (
        <div className="p-4">
          {/* Controls */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <RotateCcw className="w-4 h-4" />
              Desfazer
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <RotateCw className="w-4 h-4" />
              Refazer
            </button>
            <button
              onClick={onClear}
              disabled={history.length === 0}
              className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* History List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Nenhuma transformação ainda
              </div>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    index === currentIndex
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-slate-700/50 bg-slate-800/30'
                  } ${index > currentIndex ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-200">
                        {item.action}
                      </div>
                      {item.details && (
                        <div className="text-xs text-slate-400 mt-1">
                          {item.details}
                        </div>
                      )}
                    </div>
                    {index === currentIndex && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info */}
          {history.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/50">
              <div className="text-xs text-slate-500 text-center">
                Etapa {currentIndex + 1} de {history.length}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
