// Encontrar e substituir a função processarComandoDownload

const processarComandoDownload = (cmd) => {
  const cmdLower = cmd.toLowerCase().trim()
  
  if (!data || data.length === 0) {
    return { isDownload: false }
  }

  // MELHOR DETECÇÃO PARA DIVIDIR EM 49
  if (cmdLower.includes('49') || cmdLower.includes('dividir') || cmdLower.includes('multione baixar')) {
    setTimeout(() => {
      const arquivosBaixados = baixarDivididoEm49(data)
      const msg = {
        role: 'assistant',
        content: `Perfeito, ${userName}! ${arquivosBaixados} arquivos baixados.\n\nFormato MULTIONE:\n• Primeira linha vazia\n• 49 contatos por arquivo\n• Total de ${data.length} linhas divididas`
      }
      typeMessage(msg.content, () => {
        setHistory(prev => [...prev, msg])
        salvarMensagem('assistant', msg.content, 'download')
      })
    }, 500)
    
    return { isDownload: true, message: 'Gerando arquivos MULTIONE divididos em 49 linhas...' }
  }

  // ZIP
  if (cmdLower.includes('zip') || cmdLower.includes('compactar')) {
    const match = cmdLower.match(/(\d+)/)
    const numPartes = match ? parseInt(match[1]) : 8

    setTimeout(async () => {
      const arquivosBaixados = await baixarZIP(data, numPartes)
      const msg = {
        role: 'assistant',
        content: `Pronto, ${userName}! Arquivo ZIP baixado com sucesso.\n\nContém ${arquivosBaixados} planilhas CSV\nArquivo: planilhas_${numPartes}_partes.zip`
      }
      typeMessage(msg.content, () => {
        setHistory(prev => [...prev, msg])
        salvarMensagem('assistant', msg.content, 'download')
      })
    }, 500)
    
    return { isDownload: true, message: 'Compactando arquivos em ZIP...' }
  }

  // CSV
  if (cmdLower === 'baixar csv' || cmdLower === 'csv') {
    setTimeout(() => {
      baixarCSV(data, 'planilha')
      const msg = {
        role: 'assistant',
        content: `Pronto, ${userName}! CSV baixado: planilha.csv`
      }
      typeMessage(msg.content, () => {
        setHistory(prev => [...prev, msg])
        salvarMensagem('assistant', msg.content, 'download')
      })
    }, 500)
    return { isDownload: true, message: 'Baixando CSV...' }
  }

  // DOWNLOAD SIMPLES
  const comandosSimples = ['baixar', 'download', 'salvar', 'exportar']
  const ehComandoSimples = comandosSimples.some(c => cmdLower === c || cmdLower === c + '!' || cmdLower === c + '.')

  if (ehComandoSimples) {
    setTimeout(() => {
      baixarExcel(data, 'planilha_formatada')
      const msg = {
        role: 'assistant',
        content: `Download concluído, ${userName}!\n\nArquivo: planilha_formatada.xlsx\nTotal: ${data.length} linhas`
      }
      typeMessage(msg.content, () => {
        setHistory(prev => [...prev, msg])
        salvarMensagem('assistant', msg.content, 'download')
      })
    }, 500)
    return { isDownload: true, message: 'Preparando download...' }
  }

  return { isDownload: false }
}
