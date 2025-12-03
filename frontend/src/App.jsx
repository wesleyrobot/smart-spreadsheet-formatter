import { useState, useEffect } from 'react'
import FileUploader from './components/FileUploader'
import SpreadsheetEditor from './components/SpreadsheetEditor'
import ChatCommand from './components/ChatCommand'
import ProjectManager from './components/ProjectManager'
import DataDashboard from './components/DataDashboard'
import { useSpreadsheet } from './hooks/useSpreadsheet'
import { BarChart3 } from 'lucide-react'

function App() {
  const { data, columns, selectedColumns, loadData, setSelectedColumns } = useSpreadsheet()
  const [transformedData, setTransformedData] = useState(null)
  const [transformedColumns, setTransformedColumns] = useState([])
  const [projectName, setProjectName] = useState('')
  const [showDashboard, setShowDashboard] = useState(true)

  useEffect(() => {
    if (data.length === 0) {
      setTransformedData(null)
      setTransformedColumns([])
      setProjectName('')
    }
  }, [data])

  const currentData = transformedData || data
  const currentColumns = transformedColumns.length > 0 ? transformedColumns : columns

  const handleAITransform = (newData) => {
    setTransformedData(newData)
    if (newData && newData.length > 0) {
      setTransformedColumns(Object.keys(newData[0]))
    }
  }

  const handleLoadProject = (projectData, projectColumns, name) => {
    loadData(projectData, projectColumns)
    setProjectName(name)
    setTransformedData(null)
    setTransformedColumns([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Smart Spreadsheet Formatter
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {projectName ? ` ${projectName}` : 'Formatador inteligente com IA + Análise automática'}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {currentData.length > 0 && (
                <>
                  <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
                    <span className="text-blue-400 font-bold text-lg">{currentData.length}</span>
                    <span className="text-slate-500 text-xs ml-2">linhas</span>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
                    <span className="text-cyan-400 font-bold text-lg">{currentColumns.length}</span>
                    <span className="text-slate-500 text-xs ml-2">colunas</span>
                  </div>
                  <button
                    onClick={() => setShowDashboard(!showDashboard)}
                    className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
                      showDashboard 
                        ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' 
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-3 space-y-6">
            <FileUploader onDataLoad={loadData} />
            
            <ProjectManager 
              data={currentData}
              columns={currentColumns}
              onLoad={handleLoadProject}
            />

            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl p-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                 Comandos Rápidos
              </h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span><strong className="text-slate-300">multione</strong> - Google Contacts</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-slate-300">comercial</strong> - Formata comercial</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong className="text-slate-300">baixar</strong> - Download Excel</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong className="text-slate-300">baixar zip</strong> - Compactar</span>
                </div>
              </div>
            </div>

            {currentData.length > 0 && (
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-500/30 shadow-2xl p-4">
                <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                   Planilha Carregada
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Linhas:</span>
                    <span className="font-bold text-green-400">{currentData.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Colunas:</span>
                    <span className="font-bold text-green-400">{currentColumns.length}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green-500/30">
                  <p className="text-xs text-green-300/70">
                     Use "Salvar Projeto"
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-9 h-[700px]">
            <ChatCommand 
              data={currentData} 
              columns={currentColumns}
              onTransform={handleAITransform}
            />
          </div>
        </div>

        {/* DASHBOARD */}
        {showDashboard && currentData.length > 0 && (
          <div className="mb-6">
            <DataDashboard data={currentData} columns={currentColumns} />
          </div>
        )}

        {/* EDITOR */}
        <div className="h-[600px]">
          <SpreadsheetEditor data={currentData} columns={currentColumns} />
        </div>
      </main>

      <footer className="bg-slate-900/30 backdrop-blur-xl border-t border-slate-800/50 py-4">
        <div className="max-w-[1920px] mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
             Smart Spreadsheet Formatter v3.0 • 
            IA + Análise Automática + Sugestões Inteligentes • 
            <span className="text-slate-400 ml-1">
              {currentData.length > 0 ? `${currentData.length} linhas` : 'Aguardando upload'}
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
