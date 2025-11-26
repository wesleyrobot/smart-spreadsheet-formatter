#!/bin/bash

echo "🚀 IMPLEMENTANDO TOP 3 MELHORIAS"
echo "=================================="

# ==================== FRONTEND: TRANSFORM TEMPLATES ====================

cat > frontend/src/components/TransformTemplates.jsx << 'EOF'
import { useState } from 'react'
import { Wand2, Briefcase, Mail, TrendingUp, Check } from 'lucide-react'
import axios from 'axios'

export default function TransformTemplates({ data, columns, onApplyTemplate }) {
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(null)

  const templates = [
    {
      id: 'normalize_contacts',
      name: '📧 Normalizar Contatos',
      description: 'Limpa emails, padroniza nomes, remove duplicatas',
      icon: Mail,
      color: 'blue'
    },
    {
      id: 'commercial_base',
      name: '💼 Base Comercial',
      description: 'Limpa CNPJ, padroniza empresas, ordena',
      icon: Briefcase,
      color: 'green'
    },
    {
      id: 'powerbi_ready',
      name: '📊 Preparar Power BI',
      description: 'Remove vazios, normaliza datas, tipos corretos',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      id: 'clean_all',
      name: '✨ Limpeza Completa',
      description: 'Remove linhas vazias, duplicatas, caracteres especiais',
      icon: Wand2,
      color: 'pink'
    }
  ]

  const applyTemplate = async (templateId) => {
    setLoading(true)
    setApplied(null)

    try {
      const response = await axios.post('http://localhost:8000/api/transform/template', {
        template_id: templateId,
        data: data,
        columns: columns
      })

      setApplied(templateId)
      onApplyTemplate(response.data.data, response.data.changes)

      setTimeout(() => setApplied(null), 2000)
    } catch (error) {
      console.error('Erro ao aplicar template:', error)
      alert(`Erro: ${error.response?.data?.detail || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-slate-200">📋 Templates</h2>
      </div>

      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => applyTemplate(template.id)}
            disabled={loading || !data || data.length === 0}
            className={`w-full text-left p-3 rounded-lg border transition ${
              applied === template.id
                ? 'border-green-500 bg-green-500/20'
                : `border-${template.color}-500/30 bg-${template.color}-500/10 hover:bg-${template.color}-500/20`
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-start gap-3">
              <template.icon className={`w-5 h-5 text-${template.color}-400 mt-0.5`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200 text-sm">{template.name}</span>
                  {applied === template.id && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{template.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 text-purple-400 text-sm">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Aplicando template...</span>
          </div>
        </div>
      )}
    </div>
  )
}
EOF

# ==================== FRONTEND: TRANSFORM HISTORY ====================

cat > frontend/src/components/TransformHistory.jsx << 'EOF'
import { useState } from 'react'
import { History, RotateCcw, RotateCw, Trash2 } from 'lucide-react'

export default function TransformHistory({ history, onUndo, onRedo, onClear, currentIndex }) {
  const [isOpen, setIsOpen] = useState(true)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-slate-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-200">🔄 Histórico</h2>
          {history.length > 0 && (
            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
              {history.length}
            </span>
          )}
        </div>
        <span className="text-slate-400 text-sm">{isOpen ? '▼' : '▶'}</span>
      </div>

      {isOpen && (
        <div className="p-4">
          {/* Controls */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <RotateCcw className="w-4 h-4" />
              Desfazer
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <RotateCw className="w-4 h-4" />
              Refazer
            </button>
            <button
              onClick={onClear}
              disabled={history.length === 0}
              className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* History List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Nenhuma transformação ainda
              </div>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    index === currentIndex
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-slate-700/50 bg-slate-800/30'
                  } ${index > currentIndex ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-200">
                        {item.action}
                      </div>
                      {item.details && (
                        <div className="text-xs text-slate-400 mt-1">
                          {item.details}
                        </div>
                      )}
                    </div>
                    {index === currentIndex && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info */}
          {history.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/50">
              <div className="text-xs text-slate-500 text-center">
                Etapa {currentIndex + 1} de {history.length}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
EOF

# ==================== FRONTEND: PREVIEW MODAL ====================

cat > frontend/src/components/PreviewModal.jsx << 'EOF'
import { X, ArrowRight, AlertCircle } from 'lucide-react'

export default function PreviewModal({ isOpen, onClose, before, after, changes }) {
  if (!isOpen) return null

  const beforeSample = before?.slice(0, 5) || []
  const afterSample = after?.slice(0, 5) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-200">👁️ Preview das Mudanças</h2>
            <p className="text-slate-400 text-sm mt-1">Visualize antes de aplicar</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Changes Summary */}
        {changes && (
          <div className="p-6 bg-blue-500/10 border-b border-slate-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-slate-200 mb-2">Alterações:</div>
                <div className="space-y-1">
                  {changes.map((change, idx) => (
                    <div key={idx} className="text-sm text-slate-300">
                      • {change}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-6">
            {/* Before */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="font-semibold text-slate-200">Antes</h3>
                <span className="text-xs text-slate-500">({before?.length || 0} linhas)</span>
              </div>
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-800/50">
                    <tr>
                      {beforeSample[0] && Object.keys(beforeSample[0]).map((col) => (
                        <th key={col} className="px-2 py-2 text-left text-slate-400 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {beforeSample.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-800/50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-2 py-2 text-slate-300">
                            {val || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* After */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-semibold text-slate-200">Depois</h3>
                <span className="text-xs text-slate-500">({after?.length || 0} linhas)</span>
              </div>
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-800/50">
                    <tr>
                      {afterSample[0] && Object.keys(afterSample[0]).map((col) => (
                        <th key={col} className="px-2 py-2 text-left text-slate-400 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {afterSample.map((row, idx) => (
                      <tr key={idx} className="border-t border-slate-800/50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-2 py-2 text-slate-300">
                            {val || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
EOF

# ==================== BACKEND: TEMPLATES ROUTE ====================

cat > backend/app/api/routes/templates.py << 'EOF'
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import pandas as pd
import re

router = APIRouter()

@router.post("/template")
async def apply_template(payload: Dict[str, Any]):
    try:
        template_id = payload.get('template_id')
        data = payload.get('data', [])
        columns = payload.get('columns', [])
        
        if not data:
            raise HTTPException(status_code=400, detail="Nenhum dado fornecido")
        
        df = pd.DataFrame(data)
        changes = []
        
        if template_id == 'normalize_contacts':
            # Normalizar contatos
            antes = len(df)
            
            # Remover duplicatas
            df = df.drop_duplicates()
            if len(df) < antes:
                changes.append(f"Removidas {antes - len(df)} duplicatas")
            
            # Limpar emails
            for col in df.columns:
                if 'email' in col.lower():
                    df[col] = df[col].str.lower().str.strip()
                    changes.append(f"Emails normalizados em '{col}'")
            
            # Padronizar nomes
            for col in df.columns:
                if 'nome' in col.lower() or 'name' in col.lower():
                    df[col] = df[col].str.title()
                    changes.append(f"Nomes padronizados em '{col}'")
        
        elif template_id == 'commercial_base':
            # Base comercial
            antes = len(df)
            
            # Limpar CNPJ
            for col in df.columns:
                if 'cnpj' in col.lower():
                    df[col] = df[col].str.replace(r'[^0-9]', '', regex=True)
                    changes.append(f"CNPJ limpo em '{col}'")
            
            # Padronizar empresas
            for col in df.columns:
                if 'empresa' in col.lower() or 'company' in col.lower():
                    df[col] = df[col].str.upper().str.strip()
                    changes.append(f"Empresas padronizadas em '{col}'")
            
            # Ordenar
            if 'empresa' in df.columns:
                df = df.sort_values('empresa')
                changes.append("Ordenado por empresa")
            
            # Remover duplicatas
            df = df.drop_duplicates()
            if len(df) < antes:
                changes.append(f"Removidas {antes - len(df)} duplicatas")
        
        elif template_id == 'powerbi_ready':
            # Preparar para Power BI
            antes = len(df)
            
            # Remover linhas vazias
            df = df.dropna(how='all')
            if len(df) < antes:
                changes.append(f"Removidas {antes - len(df)} linhas vazias")
            
            # Remover colunas totalmente vazias
            antes_cols = len(df.columns)
            df = df.dropna(axis=1, how='all')
            if len(df.columns) < antes_cols:
                changes.append(f"Removidas {antes_cols - len(df.columns)} colunas vazias")
            
            changes.append("Dados prontos para Power BI")
        
        elif template_id == 'clean_all':
            # Limpeza completa
            antes = len(df)
            
            # Remover linhas vazias
            df = df.dropna(how='all')
            changes.append(f"Removidas {antes - len(df)} linhas vazias")
            
            # Remover duplicatas
            antes = len(df)
            df = df.drop_duplicates()
            changes.append(f"Removidas {antes - len(df)} duplicatas")
            
            # Remover caracteres especiais
            for col in df.columns:
                if df[col].dtype == 'object':
                    df[col] = df[col].str.replace(r'[^a-zA-Z0-9\s@._-]', '', regex=True)
            changes.append("Caracteres especiais removidos")
        
        else:
            raise HTTPException(status_code=400, detail="Template não encontrado")
        
        # Substituir NaN
        df = df.replace({pd.NA: None, pd.NaT: None})
        df = df.where(pd.notna(df), None)
        
        return {
            "data": df.to_dict('records'),
            "changes": changes
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
EOF

# ==================== UPDATE BACKEND MAIN ====================

cat > backend/app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import spreadsheet, ml, health, ai_commands, templates

app = FastAPI(title="Smart Spreadsheet Formatter API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(spreadsheet.router, prefix="/api/spreadsheet", tags=["spreadsheet"])
app.include_router(ml.router, prefix="/api/ml", tags=["ml"])
app.include_router(ai_commands.router, prefix="/api/ml", tags=["ai"])
app.include_router(templates.router, prefix="/api/transform", tags=["templates"])

@app.get("/")
async def root():
    return {
        "message": "Smart Spreadsheet Formatter API",
        "version": "0.3.0",
        "status": "running",
        "features": ["ai-commands", "templates", "history", "preview"],
        "docs": "/docs"
    }
EOF

# ==================== UPDATE APP.JSX ====================

cat > frontend/src/App.jsx << 'EOF'
import { useState } from 'react'
import FileUploader from './components/FileUploader'
import SpreadsheetEditor from './components/SpreadsheetEditor'
import ColumnManager from './components/ColumnManager'
import ChatCommand from './components/ChatCommand'
import ExportOptions from './components/ExportOptions'
import TransformTemplates from './components/TransformTemplates'
import TransformHistory from './components/TransformHistory'
import PreviewModal from './components/PreviewModal'
import MLSuggestions from './components/MLSuggestions'
import { useSpreadsheet } from './hooks/useSpreadsheet'

function App() {
  const { data, columns, selectedColumns, loadData, setSelectedColumns } = useSpreadsheet()
  const [transformedData, setTransformedData] = useState(null)
  const [history, setHistory] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState(null)

  const currentData = transformedData || data

  const addToHistory = (action, newData, details = null) => {
    const newHistory = history.slice(0, currentIndex + 1)
    newHistory.push({ action, data: newData, details })
    setHistory(newHistory)
    setCurrentIndex(newHistory.length - 1)
    setTransformedData(newData)
  }

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setTransformedData(history[currentIndex - 1].data)
    }
  }

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setTransformedData(history[currentIndex + 1].data)
    }
  }

  const handleClearHistory = () => {
    setHistory([])
    setCurrentIndex(-1)
    setTransformedData(null)
  }

  const handleTemplateApply = (newData, changes) => {
    setPreviewData({ before: currentData, after: newData, changes })
    setShowPreview(true)
    // Aplicar após fechar preview
    addToHistory('Template aplicado', newData, changes.join(', '))
  }

  const handleAITransform = (newData) => {
    addToHistory('Comando IA', newData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
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
            {currentData.length > 0 && (
              <div className="flex gap-3">
                <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
                  <span className="text-blue-400 font-bold text-lg">{currentData.length}</span>
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
          <div className="lg:col-span-1 space-y-6">
            <FileUploader onDataLoad={loadData} />
            
            <TransformTemplates 
              data={currentData}
              columns={columns}
              onApplyTemplate={handleTemplateApply}
            />
            
            <TransformHistory
              history={history}
              currentIndex={currentIndex}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClearHistory}
            />
            
            <ChatCommand 
              data={currentData} 
              columns={columns}
              onTransform={handleAITransform}
            />
            
            <ColumnManager 
              columns={columns} 
              data={currentData}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
            />
            
            <ExportOptions
              data={currentData}
              selectedColumns={selectedColumns}
              filename="planilha_formatada"
            />
            
            <MLSuggestions data={currentData} columns={columns} />
          </div>

          <div className="lg:col-span-3">
            <SpreadsheetEditor data={currentData} columns={columns} />
          </div>
        </div>
      </main>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        before={previewData?.before}
        after={previewData?.after}
        changes={previewData?.changes}
      />
    </div>
  )
}

export default App
EOF

touch backend/app/api/routes/templates.py

echo ""
echo "=========================================="
echo "✅ TOP 3 MELHORIAS IMPLEMENTADAS!"
echo "=========================================="
echo ""
echo "📋 Templates de Transformações Prontas"
echo "🔄 Histórico + Undo/Redo"
echo "👁️ Preview Antes/Depois"
echo ""
echo "🔄 Reinicie os servidores!"
echo "=========================================="
