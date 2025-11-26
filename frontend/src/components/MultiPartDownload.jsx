import { useState } from 'react'
import { Download, FileSpreadsheet, Loader, CheckCircle } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function MultiPartDownload({ data, columns, numPartes = 8 }) {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)

  const dividirEBaixar = () => {
    if (!data || data.length === 0) {
      alert('Nenhum dado para dividir!')
      return
    }

    setDownloading(true)
    setProgress(0)
    setCompleted(false)

    const totalLinhas = data.length
    const linhasPorParte = Math.ceil(totalLinhas / numPartes)

    setTimeout(() => {
      for (let i = 0; i < numPartes; i++) {
        const inicio = i * linhasPorParte
        const fim = Math.min((i + 1) * linhasPorParte, totalLinhas)
        const dadosParte = data.slice(inicio, fim)

        // Criar planilha
        const ws = XLSX.utils.json_to_sheet(dadosParte)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Dados')

        // Baixar
        XLSX.writeFile(wb, `planilha_comercial_parte_${i + 1}_de_${numPartes}.xlsx`)

        // Atualizar progresso
        setProgress(Math.round(((i + 1) / numPartes) * 100))
      }

      setDownloading(false)
      setCompleted(true)

      // Reset após 3 segundos
      setTimeout(() => {
        setCompleted(false)
        setProgress(0)
      }, 3000)
    }, 500)
  }

  const calcularLinhasPorParte = () => {
    if (!data) return 0
    return Math.ceil(data.length / numPartes)
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <FileSpreadsheet className="w-5 h-5 text-green-400" />
        📊 Dividir e Baixar
      </h3>

      {data && data.length > 0 ? (
        <>
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="text-sm text-blue-300 space-y-2">
              <div className="flex justify-between">
                <span>Total de linhas:</span>
                <span className="font-bold">{data.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Dividir em:</span>
                <span className="font-bold">{numPartes} planilhas</span>
              </div>
              <div className="flex justify-between">
                <span>Linhas por planilha:</span>
                <span className="font-bold">~{calcularLinhasPorParte()}</span>
              </div>
            </div>
          </div>

          {downloading && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 text-sm text-slate-400">
                <span>Gerando planilhas...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {completed && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">
                ✅ {numPartes} planilhas baixadas com sucesso!
              </span>
            </div>
          )}

          <button
            onClick={dividirEBaixar}
            disabled={downloading}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:from-slate-700 disabled:to-slate-700 transition font-medium flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Baixando {numPartes} planilhas...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Baixar {numPartes} Planilhas
              </>
            )}
          </button>

          <div className="mt-3 text-xs text-slate-500 text-center">
            💡 Os arquivos serão baixados automaticamente
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Use "comercial" no chat primeiro</p>
        </div>
      )}
    </div>
  )
}
