import { useState, useEffect } from 'react'
import { X, FolderOpen, Loader, Calendar, FileText, Trash2 } from 'lucide-react'
import axios from 'axios'

export default function LoadProjectModal({ isOpen, onClose, onLoad }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    if (isOpen) {
      loadProjects()
    }
  }, [isOpen])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8000/api/projects/')
      setProjects(response.data)
    } catch (error) {
      alert('Erro ao carregar projetos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadProject = async (project) => {
    onLoad(project.current_data, project.columns, project.name)
    onClose()
  }

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation()
    if (!confirm('Deletar este projeto?')) return

    try {
      await axios.delete(`http://localhost:8000/api/projects/${projectId}`)
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (error) {
      alert('Erro ao deletar: ' + error.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Meus Projetos</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">Nenhum projeto salvo</h3>
              <p className="text-sm text-slate-500">Salve seu primeiro projeto para vê-lo aqui</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedProject === project.id
                      ? 'bg-blue-500/10 border-blue-500/50'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {project.row_count} linhas
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-sm text-slate-500 mt-2">{project.description}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  
                  {selectedProject === project.id && (
                    <button
                      onClick={() => handleLoadProject(project)}
                      className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition font-medium"
                    >
                      Carregar Projeto
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
