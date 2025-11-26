import { useState, useRef } from 'react'
import { MessageSquare, Send, Sparkles, Loader, BookOpen, Trash2 } from 'lucide-react'
import axios from 'axios'
import * as XLSX from 'xlsx'

export default function ChatCommand({ data, columns, onTransform }) {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const examples = [
    "comercial",
    "baixar",
    "baixar em 8 partes",
    "baixar tudo",
    "Como fazer soma?",
    "Separar nome",
    "Limpar CNPJ",
    "Remover duplicatas"
  ]

  // ==================== FUNÇÕES DE DOWNLOAD ====================
  
  const baixarExcel = (dadosParaBaixar, nomeArquivo = 'planilha') => {
    const ws = XLSX.utils.json_to_sheet(dadosParaBaixar)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dados')
    XLSX.writeFile(wb, `${nomeArquivo}.xlsx`)
  }

  const baixarCSV = (dadosParaBaixar, nomeArquivo = 'planilha') => {
    const ws = XLSX.utils.json_to_sheet(dadosParaBaixar)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${nomeArquivo}.csv`
    link.click()
  }

  const baixarJSON = (dadosParaBaixar, nomeArquivo = 'planilha') => {
    const json = JSON.stringify(dadosParaBaixar, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${nomeArquivo}.json`
    link.click()
  }

  const baixarTXT = (dadosParaBaixar, nomeArquivo = 'planilha') => {
    if (!dadosParaBaixar || dadosParaBaixar.length === 0) return
    
    const headers = Object.keys(dadosParaBaixar[0])
    let txt = headers.join('\t') + '\n'
    
    dadosParaBaixar.forEach(row => {
      const values = headers.map(header => row[header] || '')
      txt += values.join('\t') + '\n'
    })
    
    const blob = new Blob([txt], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${nomeArquivo}.txt`
    link.click()
  }

  const baixarEmPartes = (dadosParaBaixar, numPartes = 8) => {
    if (!dadosParaBaixar || dadosParaBaixar.length === 0) return 0
    
    const totalLinhas = dadosParaBaixar.length
    const linhasPorParte = Math.ceil(totalLinhas / numPartes)
    
    for (let i = 0; i < numPartes; i++) {
      const inicio = i * linhasPorParte
      const fim = Math.min((i + 1) * linhasPorParte, totalLinhas)
      const dadosParte = dadosParaBaixar.slice(inicio, fim)
      
      setTimeout(() => {
        baixarExcel(dadosParte, `planilha_parte_${i + 1}_de_${numPartes}`)
      }, i * 300)
    }
    
    return numPartes
  }

  const baixarTodosFormatos = (dadosParaBaixar) => {
    baixarExcel(dadosParaBaixar, 'planilha')
    setTimeout(() => baixarCSV(dadosParaBaixar, 'planilha'), 500)
    setTimeout(() => baixarJSON(dadosParaBaixar, 'planilha'), 1000)
    setTimeout(() => baixarTXT(dadosParaBaixar, 'planilha'), 1500)
  }

  // ==================== PROCESSAR COMANDO ====================

  const processarComandoDownload = (cmd) => {
    const cmdLower = cmd.toLowerCase().trim()
    
    if (!data || data.length === 0) {
      return { isDownload: false }
    }

    // DOWNLOAD SIMPLES - só "baixar", "download", "salvar", "exportar"
    const comandosSimples = ['baixar', 'download', 'salvar', 'exportar']
    const ehComandoSimples = comandosSimples.some(c => {
      // Comando exato ou seguido de pontuação
      return cmdLower === c || 
             cmdLower === c + '!' || 
             cmdLower === c + '.'
    })

    if (ehComandoSimples) {
      setTimeout(() => {
        baixarExcel(data, 'planilha_formatada')
        const msg = {
          role: 'assistant',
          content: `✅ **Download concluído!**\n\n📥 Arquivo: **planilha_formatada.xlsx**\n📊 ${data.length} linhas, ${columns.length} colunas\n\n💡 Use "baixar tudo" para múltiplos formatos`
        }
        setHistory(prev => [...prev, msg])
      }, 500)
      return { isDownload: true, message: '📥 Preparando download...' }
    }

    // BAIXAR EM PARTES
    if ((cmdLower.includes('baixar') || cmdLower.includes('dividir')) && 
        (cmdLower.includes('parte') || cmdLower.includes('planilha'))) {
      const match = cmdLower.match(/(\d+)\s*(?:parte|planilha)/i)
      const numPartes = match ? parseInt(match[1]) : 8
      
      setTimeout(() => {
        const arquivosBaixados = baixarEmPartes(data, numPartes)
        const msg = {
          role: 'assistant',
          content: `✅ **${arquivosBaixados} planilhas baixadas!**\n\n📥 Arquivos:\n${Array.from({length: numPartes}, (_, i) => `• planilha_parte_${i+1}_de_${numPartes}.xlsx`).join('\n')}\n\n📊 ~${Math.ceil(data.length/numPartes)} linhas por arquivo`
        }
        setHistory(prev => [...prev, msg])
      }, 500)
      
      return { isDownload: true, message: `🔄 Gerando ${numPartes} planilhas...` }
    }

    // BAIXAR EXCEL
    if (cmdLower.includes('excel') && (cmdLower.includes('baixar') || cmdLower.includes('exportar'))) {
      setTimeout(() => {
        baixarExcel(data, 'planilha')
        const msg = {
          role: 'assistant',
          content: '✅ **Excel baixado:** planilha.xlsx'
        }
        setHistory(prev => [...prev, msg])
      }, 500)
      return { isDownload: true, message: '📥 Baixando Excel...' }
    }

    // BAIXAR CSV
    if (cmdLower.includes('csv')) {
      setTimeout(() => {
        baixarCSV(data, 'planilha')
        const msg = {
          role: 'assistant',
          content: '✅ **CSV baixado:** planilha.csv'
        }
        setHistory(prev => [...prev, msg])
      }, 500)
      return { isDownload: true, message: '📥 Baixando CSV...' }
    }

    // BAIXAR JSON
    if (cmdLower.includes('json')) {
      setTimeout(() => {
        baixarJSON(data, 'planilha')
        const msg = {
          role: 'assistant',
          content: '✅ **JSON baixado:** planilha.json'
        }
        setHistory(prev => [...prev, msg])
      }, 500)
      return { isDownload: true, message: '📥 Baixando JSON...' }
    }

    // BAIXAR TXT
    if (cmdLower.includes('txt')) {
      setTimeout(() => {
        baixarTXT(data, 'planilha')
        const msg = {
          role: 'assistant',
          content: '✅ **TXT baixado:** planilha.txt'
        }
        setHistory(prev => [...prev, msg])
      }, 500)
      return { isDownload: true, message: '📥 Baixando TXT...' }
    }

    // BAIXAR TUDO
    if (cmdLower.includes('tudo') || cmdLower.includes('todos')) {
      setTimeout(() => {
        baixarTodosFormatos(data)
        const msg = {
          role: 'assistant',
          content: '✅ **4 formatos baixados:**\n• planilha.xlsx (Excel)\n• planilha.csv (CSV)\n• planilha.json (JSON)\n• planilha.txt (Texto)'
        }
        setHistory(prev => [...prev, msg])
      }, 500)
      return { isDownload: true, message: '📥 Baixando todos os formatos...' }
    }

    return { isDownload: false }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!command.trim() || loading) return

    const userMessage = { role: 'user', content: command }
    setHistory(prev => [...prev, userMessage])

    // Verificar se é comando de download
    const downloadResult = processarComandoDownload(command)
    
    if (downloadResult.isDownload) {
      const downloadMsg = {
        role: 'assistant',
        content: downloadResult.message
      }
      setHistory(prev => [...prev, downloadMsg])
      setCommand('')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8000/api/ml/ai-command', {
        command: command,
        data: data,
        columns: columns
      })

      const aiMessage = { 
        role: 'assistant', 
        content: response.data.message,
        type: response.data.type
      }
      
      setHistory(prev => [...prev, aiMessage])
      
      if (response.data.data && response.data.type === 'transform') {
        onTransform(response.data.data)
      }
      
      setCommand('')
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: `❌ Erro: ${error.response?.data?.detail || error.message}`
      }
      setHistory(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    if (confirm('Limpar todo o histórico?')) {
      setHistory([])
    }
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border-2 border-purple-500/50 shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-slate-800/50 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">🤖 IA Assistente</h2>
            <p className="text-sm text-slate-400">Comandos, perguntas e downloads</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {data && data.length > 0 && (
            <div className="px-3 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
              <span className="font-bold">{data.length}</span> linhas
            </div>
          )}
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-3 hover:bg-slate-800 rounded-lg transition"
              title="Limpar histórico"
            >
              <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-400" />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pt-4">
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-200 mb-1">💡 Comandos Rápidos</div>
              <div className="text-xs text-slate-400">
                <strong className="text-green-300">Downloads:</strong> "baixar" • "baixar em 8 partes" • "baixar tudo"<br/>
                <strong className="text-purple-300">Formatos:</strong> "csv" • "json" • "excel" • "txt"<br/>
                <strong className="text-blue-300">Formatar:</strong> "comercial" • "separar nome" • "limpar cnpj"
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mb-4">
              <MessageSquare className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Comece uma conversa</h3>
            <p className="text-slate-400 text-sm max-w-md">
              Digite "baixar" para download rápido ou "comercial" para formatar
            </p>
          </div>
        ) : (
          history.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3xl p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-12' 
                    : msg.type === 'excel_help'
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 mr-12'
                    : 'bg-slate-800/50 border border-slate-700/50 mr-12'
                }`}
              >
                <div className="text-xs font-semibold mb-2 opacity-70">
                  {msg.role === 'user' ? '👤 Você' : msg.type === 'excel_help' ? '📚 Excel' : '🤖 IA'}
                </div>
                <div className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl flex items-center gap-3">
              <Loader className="w-5 h-5 animate-spin text-purple-400" />
              <span className="text-sm text-slate-300">Processando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-4">
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-2">💡 Clique para usar:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setCommand(ex)}
                className="text-xs px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 border border-purple-500/30 transition font-medium"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-800/50 bg-slate-900/50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder='Digite "baixar", "comercial" ou qualquer comando...'
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !command.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  )
}
