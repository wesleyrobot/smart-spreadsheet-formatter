import { useEffect, useRef, useState } from 'react'
import { HotTable } from '@handsontable/react'
import 'handsontable/dist/handsontable.full.css'
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Download, Search } from 'lucide-react'

export default function SpreadsheetEditor({ data, columns }) {
  const hotTableRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fontSize, setFontSize] = useState(13)

  useEffect(() => {
    if (hotTableRef.current && data.length > 0) {
      const hot = hotTableRef.current.hotInstance
      hot.loadData(data)
    }
  }, [data])

  const handleSearch = () => {
    if (!searchQuery) return
    const hot = hotTableRef.current?.hotInstance
    if (hot) {
      const searchPlugin = hot.getPlugin('search')
      const searchResult = searchPlugin.query(searchQuery)
      hot.render()
    }
  }

  const handleZoomIn = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  const handleZoomOut = () => {
    setFontSize(prev => Math.max(prev - 2, 10))
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl p-12 flex flex-col items-center justify-center h-full">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-400 mb-2">Nenhuma planilha carregada</h3>
        <p className="text-sm text-slate-500 text-center max-w-md">
          Faça upload de um arquivo Excel/CSV para visualizar e editar
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-slate-900/50 backdrop-blur-xl rounded-2xl border-2 border-purple-500/50 shadow-2xl flex flex-col ${isExpanded ? 'fixed inset-4 z-50' : 'h-full'}`}>
      {/* Header com controles */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">📊 Editor de Planilha</h2>
            <p className="text-xs text-slate-400">{data.length} linhas × {columns.length} colunas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Busca */}
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-32"
            />
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg px-2 py-2 border border-slate-700/50">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-700 rounded transition"
              title="Diminuir zoom"
            >
              <ZoomOut className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-xs text-slate-400 px-2">{fontSize}px</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-700 rounded transition"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Expandir */}
          <button
            onClick={toggleExpand}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
            title={isExpanded ? "Minimizar" : "Tela cheia"}
          >
            {isExpanded ? (
              <Minimize2 className="w-5 h-5 text-slate-400" />
            ) : (
              <Maximize2 className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-hidden p-4">
        <div 
          className="h-full rounded-xl overflow-hidden border border-slate-800/50"
          style={{ fontSize: `${fontSize}px` }}
        >
          <HotTable
            ref={hotTableRef}
            data={data}
            colHeaders={columns}
            rowHeaders={true}
            width="100%"
            height="100%"
            licenseKey="non-commercial-and-evaluation"
            stretchH="all"
            className="handsontable-dark"
            manualColumnResize={true}
            manualRowResize={true}
            contextMenu={true}
            search={true}
            filters={true}
            dropdownMenu={true}
            columnSorting={true}
            autoWrapRow={true}
            autoWrapCol={true}
          />
        </div>
      </div>

      {/* Footer com estatísticas */}
      <div className="px-4 py-3 border-t border-slate-800/50 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex gap-4">
            <span>💾 Auto-salvo ativo</span>
            <span>•</span>
            <span>⚡ Editável em tempo real</span>
          </div>
          <div className="flex gap-4">
            <span className="text-blue-400">{data.length} linhas</span>
            <span>•</span>
            <span className="text-cyan-400">{columns.length} colunas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
