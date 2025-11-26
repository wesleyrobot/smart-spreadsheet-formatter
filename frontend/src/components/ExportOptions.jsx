import { useState } from 'react'
import { Download, FileSpreadsheet, FileJson, FileText } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function ExportOptions({ data, selectedColumns, filename = 'export' }) {
  const [format, setFormat] = useState('xlsx')

  const formats = [
    { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, color: 'green' },
    { value: 'csv', label: 'CSV', icon: FileText, color: 'blue' },
    { value: 'json', label: 'JSON', icon: FileJson, color: 'yellow' },
    { value: 'txt', label: 'TXT', icon: FileText, color: 'gray' }
  ]

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

    switch (format) {
      case 'xlsx':
        exportToExcel(filteredData)
        break
      case 'csv':
        exportToCSV(filteredData)
        break
      case 'json':
        exportToJSON(filteredData)
        break
      case 'txt':
        exportToTXT(filteredData)
        break
    }
  }

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  const exportToCSV = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    downloadFile(csv, `${filename}.csv`, 'text/csv')
  }

  const exportToJSON = (data) => {
    const json = JSON.stringify(data, null, 2)
    downloadFile(json, `${filename}.json`, 'application/json')
  }

  const exportToTXT = (data) => {
    const headers = Object.keys(data[0])
    const lines = data.map(row => 
      headers.map(h => row[h]).join('\t')
    )
    const txt = [headers.join('\t'), ...lines].join('\n')
    downloadFile(txt, `${filename}.txt`, 'text/plain')
  }

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-4 shadow-2xl">
      <h2 className="text-lg font-semibold mb-4 text-slate-200">📥 Exportar</h2>

      <div className="space-y-2 mb-4">
        {formats.map((fmt) => (
          <label
            key={fmt.value}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              format === fmt.value 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-slate-700/50 hover:bg-slate-800/30'
            }`}
          >
            <input
              type="radio"
              name="format"
              value={fmt.value}
              checked={format === fmt.value}
              onChange={(e) => setFormat(e.target.value)}
              className="cursor-pointer"
            />
            <fmt.icon className={`w-5 h-5 text-${fmt.color}-400`} />
            <span className="text-sm font-medium text-slate-200">{fmt.label}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleExport}
        disabled={selectedColumns.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition"
      >
        <Download className="w-5 h-5" />
        <span>Baixar {format.toUpperCase()}</span>
        <span className="text-xs opacity-75">({selectedColumns.length} colunas)</span>
      </button>

      <p className="text-xs text-slate-500 mt-2 text-center">
        {data?.length || 0} linhas
      </p>
    </div>
  )
}
