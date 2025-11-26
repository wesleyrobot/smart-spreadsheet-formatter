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
