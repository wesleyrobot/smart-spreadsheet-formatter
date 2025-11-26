import { useState } from 'react'
import { Save, FolderOpen } from 'lucide-react'
import SaveProjectModal from './SaveProjectModal'
import LoadProjectModal from './LoadProjectModal'

export default function ProjectManager({ data, columns, onLoad }) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl p-4">
        <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          💾 Gerenciar Projetos
        </h3>
        
        <div className="space-y-2">
          <button
            onClick={() => setShowSaveModal(true)}
            disabled={!data || data.length === 0}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:from-slate-700 disabled:to-slate-700 transition font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Projeto
          </button>

          <button
            onClick={() => setShowLoadModal(true)}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition font-medium flex items-center justify-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            Carregar Projeto
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-300">
          💡 Seus projetos são salvos no Supabase e nunca serão perdidos!
        </div>
      </div>

      <SaveProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        data={data}
        columns={columns}
      />

      <LoadProjectModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onLoad={onLoad}
      />
    </>
  )
}
