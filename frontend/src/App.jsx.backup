import { useState } from 'react'
import FileUploader from './components/FileUploader'
import SpreadsheetEditor from './components/SpreadsheetEditor'
import ColumnManager from './components/ColumnManager'
import MLSuggestions from './components/MLSuggestions'
import { useSpreadsheet } from './hooks/useSpreadsheet'

function App() {
  const { data, columns, selectedColumns, loadData, setSelectedColumns } = useSpreadsheet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Smart Spreadsheet Formatter
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Formatador inteligente com Machine Learning
              </p>
            </div>
            
            {data.length > 0 && (
              <div className="flex gap-3">
                <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
                  <span className="text-blue-400 font-bold text-lg">{data.length}</span>
                  <span className="text-slate-500 text-xs ml-2">linhas</span>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
                  <span className="text-cyan-400 font-bold text-lg">{columns.length}</span>
                  <span className="text-slate-500 text-xs ml-2">colunas</span>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
                  <span className="text-teal-400 font-bold text-lg">{selectedColumns.length}</span>
                  <span className="text-slate-500 text-xs ml-2">selecionadas</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <FileUploader onDataLoad={loadData} />
            <ColumnManager 
              columns={columns} 
              data={data}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
            />
            <MLSuggestions data={data} columns={columns} />
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            <SpreadsheetEditor data={data} columns={columns} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            Desenvolvido por <span className="text-blue-400 font-semibold">Wesley Robot</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
