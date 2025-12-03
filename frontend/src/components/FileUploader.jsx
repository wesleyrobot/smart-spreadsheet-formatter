import { useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle, Trash2 } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function FileUploader({ onDataLoad }) {
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [rowCount, setRowCount] = useState(0)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)
        
        if (data.length > 0) {
          const columns = Object.keys(data[0])
          onDataLoad(data, columns)
          setRowCount(data.length)
        }
      } catch (error) {
        console.error('Erro ao processar arquivo:', error)
        alert('Erro ao processar arquivo!')
      } finally {
        setUploading(false)
      }
    }
    reader.readAsBinaryString(file)
  }

  const limparTudo = () => {
    if (confirm('🗑️ Remover planilha atual e começar do zero?')) {
      setFileName('')
      setRowCount(0)
      onDataLoad([], [])
      // Limpar input
      const input = document.querySelector('input[type="file"]')
      if (input) input.value = ''
    }
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
        📤 Carregar Planilha
      </h3>

      {!fileName ? (
        <label className="block cursor-pointer">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 hover:border-blue-500 transition text-center">
            <Upload className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <p className="text-sm text-slate-400 mb-1">
              Arraste ou clique para selecionar
            </p>
            <p className="text-xs text-slate-500">
              Excel, CSV (max 50MB)
            </p>
          </div>
        </label>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-300 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-green-400/70 mt-1">
                  {rowCount.toLocaleString()} linhas carregadas
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-full px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 border border-blue-500/30 transition text-center cursor-pointer text-sm font-medium">
                📁 Novo arquivo
              </div>
            </label>

            <button
              onClick={limparTudo}
              className="w-full px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 border border-red-500/30 transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpar
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent" />
          Processando...
        </div>
      )}
    </div>
  )
}
