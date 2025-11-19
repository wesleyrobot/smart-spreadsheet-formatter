# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Smart Spreadsheet Formatter!

## 📋 Como Contribuir

### 1. Fork o Repositório
```bash
# Clique em "Fork" no GitHub
# Depois clone seu fork
git clone https://github.com/SEU_USUARIO/smart-spreadsheet-formatter.git
```

### 2. Crie uma Branch
```bash
# Criar branch para sua feature
git checkout -b feature/minha-feature

# Ou para correção de bug
git checkout -b fix/meu-bug
```

### 3. Faça suas Alterações

- Escreva código limpo e comentado
- Siga os padrões de código do projeto
- Teste suas alterações

### 4. Commit suas Mudanças
```bash
# Adicionar arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"
```

**Padrão de mensagens:**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas gerais

### 5. Push para o GitHub
```bash
git push origin feature/minha-feature
```

### 6. Abra um Pull Request

- Vá para o repositório original no GitHub
- Clique em "New Pull Request"
- Descreva suas alterações

## 🐛 Reportar Bugs

Abra uma [issue](https://github.com/wesleyrobot/smart-spreadsheet-formatter/issues) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, browser, versões)

## 💡 Sugerir Features

Abra uma [issue](https://github.com/wesleyrobot/smart-spreadsheet-formatter/issues) com:

- Descrição da feature
- Por que ela seria útil
- Exemplos de uso

## 📝 Padrões de Código

### Python (Backend)
```python
# Use type hints
def process_data(data: list[dict]) -> pd.DataFrame:
    """
    Processa dados da planilha.
    
    Args:
        data: Lista de dicionários com dados
        
    Returns:
        DataFrame processado
    """
    pass

# Use docstrings
# Siga PEP 8
```

### JavaScript/React (Frontend)
```javascript
// Use componentes funcionais
// Use TypeScript quando possível
// Documente componentes complexos

/**
 * Componente de upload de arquivo
 * @param {Function} onDataLoad - Callback com dados carregados
 */
export default function FileUploader({ onDataLoad }) {
  // ...
}
```

## ✅ Checklist antes do PR

- [ ] Código testado localmente
- [ ] Sem erros no console
- [ ] Comentários em código complexo
- [ ] README atualizado (se necessário)
- [ ] Commit messages seguem padrão

## 🙏 Obrigado!

Toda contribuição é bem-vinda!
