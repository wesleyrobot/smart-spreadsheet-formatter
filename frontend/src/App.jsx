import { useState } from 'react'

function App() {
  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>🚀 Smart Spreadsheet Formatter</h1>
      <p>Formatador inteligente com ML/DL</p>
      <div style={{marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px'}}>
        <h2>Status: ✅ Estrutura criada com sucesso!</h2>
        <p>Próximos passos:</p>
        <ul>
          <li>Integrar Handsontable</li>
          <li>Implementar upload de Excel/CSV</li>
          <li>Conectar com backend</li>
          <li>Adicionar ML features</li>
        </ul>
      </div>
    </div>
  )
}

export default App
