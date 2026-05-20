# Market Radar - Rennova

Sistema de coleta centralizada de inteligências competitivas para a Rennova.

## Como fazer o Deploy no Vercel

1. Você tem a pasta do projeto pronta aqui: `/home/claude/market-radar`

2. Próximos passos:
   - Acesse https://vercel.com
   - Clique em "New Project"
   - Clique em "Import Git Repository" 
   - Se não tiver um repositório Git, crie um no GitHub primeiro:
     - Vá em https://github.com/new
     - Crie um repositório chamado "market-radar-rennova"
     - Copie o repositório localmente
     - Copie os arquivos de /home/claude/market-radar
     - Faça commit e push

3. Depois no Vercel:
   - Selecione o repositório
   - Clique em "Deploy"
   - Pronto! Vercel vai gerar um link tipo: https://market-radar-rennova.vercel.app

## Estrutura do Projeto

```
market-radar/
├── pages/
│   └── index.js (Formulário principal)
├── package.json
├── next.config.js
└── .gitignore
```

## O que o formulário faz

- Coleta inteligências de preço, tech, eventos, campanhas
- Envia automaticamente pra planilha Google Sheets
- Sem login necessário
- Interface responsiva (funciona em mobile também)
