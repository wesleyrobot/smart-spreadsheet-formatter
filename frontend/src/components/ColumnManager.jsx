import { exportToExcel } from '../services/spreadsheetService'

export default function ColumnManager({ columns, data, selectedColumns, setSelectedColumns }) {
  const toggleColumn = (col) => {
    setSelectedColumns(prev => 
      prev.includes(col) 
        ? prev.filter(c => c !== col)
        : [...prev, col]
    )
  }

  const toggleAll = () => {
    setSelectedColumns(selectedColumns.length === columns.length ? [] : columns)
  }

  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('Nenhum dado para exportar')
      return
    }

    const filteredData = data.map(row => {
      const filtered = {}
      selectedColumns.forEach(col => {
        filtered[col] = row[col]
      })
      return filtered
    })

    exportToExcel(filteredData, 'planilha_formatada.xlsx')
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/50 shadow-2xl">
      <h2 className="text-lg font-semibold mb-4 text-white">Colunas</h2>
      
      {columns.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Aguardando planilha</p>
      ) : (
        <>
          <button
            onClick={toggleAll}
            className="w-full mb-3 flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition text-sm text-slate-300 font-medium"
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
              selectedColumns.length === columns.length 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-slate-600'
            }`}>
              {selectedColumns.length === columns.length && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            Selecionar todas
          </button>
          
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2 mb-4 custom-scrollbar">
            {columns.map((col) => (
              <div 
                key={col} 
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition cursor-pointer group"
                onClick={() => toggleColumn(col)}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  selectedColumns.includes(col)
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-slate-600 group-hover:border-blue-500'
                }`}>
                  {selectedColumns.includes(col) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-300 truncate flex-1">{col}</span>
              </div>
            ))}
          </div>
        </>
      )}
      
      <button
        onClick={handleExport}
        disabled={selectedColumns.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none font-semibold"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Exportar ({selectedColumns.length})
      </button>
    </div>
  )
}
