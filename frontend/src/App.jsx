import { useState } from 'react'
import FileUploader from './components/FileUploader'
import SpreadsheetEditor from './components/SpreadsheetEditor'
import ColumnManager from './components/ColumnManager'
import MLSuggestions from './components/MLSuggestions'
import { useSpreadsheet } from './hooks/useSpreadsheet'

function App() {
  const { data, columns, selectedColumns, loadData, setSelectedColumns } = useSpreadsheet()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🚀 Smart Spreadsheet Formatter
          </h1>
          <p className="text-gray-600 mt-2">
            Formatador inteligente com ML/DL
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
    </div>
  )
}

export default App
