import { useState } from 'react'
import { Download } from 'lucide-react'
import { exportToExcel } from '../services/spreadsheetService'

export default function ColumnManager({ columns, data, selectedColumns, setSelectedColumns }) {
  const toggleColumn = (col) => {
    setSelectedColumns(prev => 
      prev.includes(col) 
        ? prev.filter(c => c !== col)
        : [...prev, col]
    )
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">🔧 Colunas</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
        {columns.length === 0 ? (
          <p className="text-sm text-gray-500">Carregue uma planilha</p>
        ) : (
          columns.map((col) => (
            <div key={col} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100">
              <input 
                type="checkbox" 
                checked={selectedColumns.includes(col)}
                onChange={() => toggleColumn(col)}
                className="cursor-pointer"
              />
              <span className="text-sm">{col}</span>
            </div>
          ))
        )}
      </div>
      
      <button
        onClick={handleExport}
        disabled={selectedColumns.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Exportar ({selectedColumns.length} colunas)
      </button>
    </div>
  )
}
