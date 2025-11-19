import { useState } from 'react'
import { readExcelFile } from '../services/spreadsheetService'

export default function FileUploader({ onDataLoad }) {
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setFileName(file.name)

    try {
      const data = await readExcelFile(file)
      const columns = data.length > 0 ? Object.keys(data[0]) : []
      onDataLoad(data, columns)
    } catch (error) {
      console.error('Erro ao ler arquivo:', error)
      alert('Erro ao processar arquivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/50 shadow-2xl">
      <h2 className="text-lg font-semibold mb-4 text-white">Upload</h2>
      <label className={`
        flex flex-col items-center gap-3 cursor-pointer 
        border-2 border-dashed rounded-xl p-8
        transition-all duration-300
        ${uploading 
          ? 'border-blue-500 bg-blue-500/5' 
          : 'border-slate-700 hover:border-blue-500 hover:bg-blue-500/5'
        }
      `}>
        <svg className={`w-12 h-12 ${uploading ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <div className="text-center">
          <span className="block text-sm text-slate-300 font-medium mb-1">
            {uploading ? 'Processando...' : 'Arraste ou clique para selecionar'}
          </span>
          <span className="text-xs text-slate-500">Excel, CSV (máx 50MB)</span>
        </div>
        {fileName && (
          <div className="mt-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-xs text-green-400 truncate max-w-[200px]">{fileName}</p>
          </div>
        )}
        <input 
          type="file" 
          className="hidden" 
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </label>
    </div>
  )
}
