import { X, ArrowRight, AlertCircle } from 'lucide-react'

export default function PreviewModal({ isOpen, onClose, before, after, changes }) {
  if (!isOpen) return null

  const beforeSample = before?.slice(0, 5) || []
  const afterSample = after?.slice(0, 5) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-200">👁️ Preview das Mudanças</h2>
            <p className="text-slate-400 text-sm mt-1">Visualize antes de aplicar</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Changes Summary */}
        {changes && (
          <div className="p-6 bg-blue-500/10 border-b border-slate-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-slate-200 mb-2">Alterações:</div>
                <div className="space-y-1">
                  {changes.map((change, idx) => (
                    <div key={idx} className="text-sm text-slate-300">
                      • {change}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-6">
            {/* Before */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="font-semibold text-slate-200">Antes</h3>
                <span className="text-xs text-slate-500">({before?.length || 0} linhas)</span>
              </div>
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-800/50">
                    <tr>
                      {beforeSample[0] && Object.keys(beforeSample[0]).map((col) => (
                        <th key={col} className="px-2 py-2 text-left text-slate-400 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {beforeSample.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-800/50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-2 py-2 text-slate-300">
                            {val || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* After */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-semibold text-slate-200">Depois</h3>
                <span className="text-xs text-slate-500">({after?.length || 0} linhas)</span>
              </div>
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-800/50">
                    <tr>
                      {afterSample[0] && Object.keys(afterSample[0]).map((col) => (
                        <th key={col} className="px-2 py-2 text-left text-slate-400 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {afterSample.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-800/50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-2 py-2 text-slate-300">
                            {val || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
