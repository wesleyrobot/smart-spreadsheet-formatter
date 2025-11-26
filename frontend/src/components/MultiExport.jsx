import { Download, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function MultiExport({ partes }) {
  const exportarTodas = () => {
    partes.forEach((parte, idx) => {
      const ws = XLSX.utils.json_to_sheet(parte.data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Dados')
      XLSX.writeFile(wb, `planilha_comercial_parte_${parte.numero}.xlsx`)
    })
  }

  return (
    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
      <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
        <FileSpreadsheet className="w-4 h-4" />
        {partes.length} Planilhas Prontas
      </h4>
      
      <div className="space-y-2 mb-3">
        {partes.map((parte) => (
          <div key={parte.numero} className="flex items-center justify-between text-xs text-green-300 bg-green-500/10 p-2 rounded">
            <span>Parte {parte.numero}</span>
            <span>{parte.linhas} linhas</span>
          </div>
        ))}
      </div>

      <button
        onClick={exportarTodas}
        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition font-medium flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Baixar Todas ({partes.length} arquivos)
      </button>
    </div>
  )
}
