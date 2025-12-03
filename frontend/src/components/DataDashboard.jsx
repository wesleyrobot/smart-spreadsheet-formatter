import { useState, useEffect } from 'react'
import { BarChart3, PieChart, TrendingUp, AlertTriangle, CheckCircle, XCircle, Users, Database, Filter, Download } from 'lucide-react'

export default function DataDashboard({ data, columns }) {
  const [stats, setStats] = useState(null)
  const [validationResults, setValidationResults] = useState([])

  useEffect(() => {
    if (data && data.length > 0) {
      analisarDados()
    }
  }, [data, columns])

  const analisarDados = () => {
    const totalLinhas = data.length
    const totalColunas = columns.length

    // Análise por coluna
    const analisesColunas = columns.map(col => {
      const valores = data.map(row => row[col])
      const naoVazios = valores.filter(v => v !== null && v !== undefined && String(v).trim() !== '')
      const vazios = totalLinhas - naoVazios.length
      const percentualPreenchido = ((naoVazios.length / totalLinhas) * 100).toFixed(1)

      // Detectar tipo de dado
      let tipo = 'texto'
      const amostra = naoVazios[0]
      if (amostra) {
        if (String(amostra).match(/^\d+$/)) tipo = 'número'
        else if (String(amostra).match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) tipo = 'email'
        else if (String(amostra).match(/^\d{10,}$/)) tipo = 'telefone'
        else if (String(amostra).match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)) tipo = 'cnpj'
      }

      // Valores únicos
      const unicos = new Set(naoVazios.map(v => String(v))).size

      return {
        nome: col,
        tipo,
        total: totalLinhas,
        preenchidos: naoVazios.length,
        vazios,
        percentualPreenchido: parseFloat(percentualPreenchido),
        unicos,
        duplicatas: naoVazios.length - unicos
      }
    })

    // Detectar problemas
    const problemas = []

    // Emails inválidos
    const colsEmail = analisesColunas.filter(a => a.tipo === 'email' || a.nome.toLowerCase().includes('email'))
    colsEmail.forEach(col => {
      const emailsInvalidos = data.filter(row => {
        const email = row[col.nome]
        return email && !String(email).match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      }).length
      
      if (emailsInvalidos > 0) {
        problemas.push({
          tipo: 'erro',
          categoria: 'Email',
          mensagem: `${emailsInvalidos} emails com formato inválido`,
          coluna: col.nome,
          severidade: 'alta'
        })
      }
    })

    // Colunas muito vazias
    analisesColunas.forEach(col => {
      if (col.percentualPreenchido < 50) {
        problemas.push({
          tipo: 'aviso',
          categoria: 'Dados vazios',
          mensagem: `${col.vazios} células vazias (${(100 - col.percentualPreenchido).toFixed(1)}%)`,
          coluna: col.nome,
          severidade: col.percentualPreenchido < 30 ? 'alta' : 'média'
        })
      }
    })

    // Muitas duplicatas
    analisesColunas.forEach(col => {
      if (col.duplicatas > totalLinhas * 0.3) {
        problemas.push({
          tipo: 'info',
          categoria: 'Duplicatas',
          mensagem: `${col.duplicatas} valores duplicados`,
          coluna: col.nome,
          severidade: 'baixa'
        })
      }
    })

    // Detectar nomes com números
    const colsNome = analisesColunas.filter(a => 
      a.nome.toLowerCase().includes('nome') || 
      a.nome.toLowerCase().includes('name')
    )
    colsNome.forEach(col => {
      const nomesComNumero = data.filter(row => {
        const nome = String(row[col.nome] || '')
        return nome.match(/\d/)
      }).length
      
      if (nomesComNumero > 0) {
        const percentual = ((nomesComNumero / totalLinhas) * 100).toFixed(1)
        problemas.push({
          tipo: 'aviso',
          categoria: 'Qualidade',
          mensagem: `${nomesComNumero} nomes contêm números (${percentual}%)`,
          coluna: col.nome,
          severidade: percentual > 20 ? 'média' : 'baixa'
        })
      }
    })

    setStats({
      totalLinhas,
      totalColunas,
      analisesColunas,
      problemas,
      qualidadeGeral: calcularQualidadeGeral(analisesColunas, problemas)
    })

    setValidationResults(problemas)
  }

  const calcularQualidadeGeral = (colunas, problemas) => {
    const mediaPreenchimento = colunas.reduce((acc, col) => acc + col.percentualPreenchido, 0) / colunas.length
    const problemasAlta = problemas.filter(p => p.severidade === 'alta').length
    const problemasMedia = problemas.filter(p => p.severidade === 'média').length

    let qualidade = mediaPreenchimento
    qualidade -= problemasAlta * 10
    qualidade -= problemasMedia * 5

    if (qualidade > 80) return { nivel: 'Excelente', cor: 'green', valor: qualidade }
    if (qualidade > 60) return { nivel: 'Boa', cor: 'blue', valor: qualidade }
    if (qualidade > 40) return { nivel: 'Regular', cor: 'yellow', valor: qualidade }
    return { nivel: 'Baixa', cor: 'red', valor: qualidade }
  }

  if (!stats) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-6">
        <div className="text-center text-slate-400">
          📊 Carregue dados para ver o dashboard
        </div>
      </div>
    )
  }

  const { totalLinhas, totalColunas, analisesColunas, problemas, qualidadeGeral } = stats

  return (
    <div className="space-y-6">
      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-blue-300">{totalLinhas}</span>
          </div>
          <p className="text-sm text-slate-300">Total de Linhas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-purple-300">{totalColunas}</span>
          </div>
          <p className="text-sm text-slate-300">Colunas</p>
        </div>

        <div className={`bg-gradient-to-br from-${qualidadeGeral.cor}-500/20 to-${qualidadeGeral.cor}-600/20 border border-${qualidadeGeral.cor}-500/30 rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className={`w-8 h-8 text-${qualidadeGeral.cor}-400`} />
            <span className={`text-2xl font-bold text-${qualidadeGeral.cor}-300`}>{qualidadeGeral.valor.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-slate-300">Qualidade: {qualidadeGeral.nivel}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <span className="text-2xl font-bold text-red-300">{problemas.length}</span>
          </div>
          <p className="text-sm text-slate-300">Problemas Detectados</p>
        </div>
      </div>

      {/* ANÁLISE POR COLUNA */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          Análise por Coluna
        </h3>
        <div className="space-y-3">
          {analisesColunas.map((col, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-200">{col.nome}</span>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {col.tipo}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    col.percentualPreenchido > 80 ? 'text-green-400' : 
                    col.percentualPreenchido > 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {col.percentualPreenchido}%
                  </span>
                  <span className="text-xs text-slate-500 ml-1">preenchido</span>
                </div>
              </div>
              
              {/* Barra de progresso */}
              <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${
                    col.percentualPreenchido > 80 ? 'bg-green-500' : 
                    col.percentualPreenchido > 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${col.percentualPreenchido}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs text-slate-400">
                <div>
                  <CheckCircle className="w-3 h-3 inline text-green-400 mr-1" />
                  {col.preenchidos} preenchidos
                </div>
                <div>
                  <XCircle className="w-3 h-3 inline text-red-400 mr-1" />
                  {col.vazios} vazios
                </div>
                <div>
                  <Users className="w-3 h-3 inline text-blue-400 mr-1" />
                  {col.unicos} únicos
                </div>
                <div>
                  <AlertTriangle className="w-3 h-3 inline text-yellow-400 mr-1" />
                  {col.duplicatas} duplicatas
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEMAS DETECTADOS */}
      {problemas.length > 0 && (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Problemas Detectados
          </h3>
          <div className="space-y-2">
            {problemas.map((prob, idx) => {
              const severidadeColors = {
                alta: 'from-red-500/20 to-orange-500/20 border-red-500/30',
                média: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
                baixa: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
              }
              const icons = {
                erro: <XCircle className="w-5 h-5 text-red-400" />,
                aviso: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
                info: <CheckCircle className="w-5 h-5 text-blue-400" />
              }
              return (
                <div key={idx} className={`p-3 rounded-lg border bg-gradient-to-r ${severidadeColors[prob.severidade]}`}>
                  <div className="flex items-start gap-3">
                    {icons[prob.tipo]}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-200">{prob.categoria}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded">
                          {prob.coluna}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{prob.mensagem}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
