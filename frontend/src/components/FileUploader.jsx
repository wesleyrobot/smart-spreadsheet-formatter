import { Upload } from 'lucide-react'
import { readExcelFile } from '../services/spreadsheetService'

export default function FileUploader({ onDataLoad }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const data = await readExcelFile(file)
      const columns = data.length > 0 ? Object.keys(data[0]) : []
      onDataLoad(data, columns)
    } catch (error) {
      console.error('Erro ao ler arquivo:', error)
      alert('Erro ao processar arquivo')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">📁 Upload</h2>
      <label className="flex flex-col items-center gap-3 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
        <Upload className="w-8 h-8 text-gray-400" />
        <span className="text-sm text-gray-600">Arraste ou clique</span>
        <span className="text-xs text-gray-400">Excel, CSV</span>
        <input 
          type="file" 
          className="hidden" 
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  )
}
