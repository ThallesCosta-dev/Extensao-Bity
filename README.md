# Bitcoin BityPrice - Extensão Chrome

## Descrição
Uma extensão para o Chrome que exibe em tempo real o preço do Bitcoin (BTC) em BRL e USD diretamente na barra de ferramentas do navegador.

## Funcionalidades Principais
- 🔄 Atualização automática do preço a cada 10 segundos
- 📊 Gráfico interativo com histórico de preços dos últimos 30 minutos
- 💱 Suporte para múltiplas moedas (BRL e USD)
- 🔔 Badge com preço compacto na barra de ferramentas
- ✨ Animações e efeitos visuais suaves
- 📈 Indicador de variação de preço com código de cores

## Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript
- Chart.js para visualização de dados
- APIs:
  - Bitpreco API (cotação BTC-BRL)
  - Binance API (dados históricos para o gráfico)

## Instalação
1. Clone este repositório
2. Abra o Chrome e navegue até `chrome://extensions/`
3. Ative o "Modo do desenvolvedor"
4. Clique em "Carregar sem compactação"
5. Selecione a pasta do projeto

## Estrutura do Projeto
```
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── background.js
├── chart.js
└── icon48.png
```

## Recursos Visuais
- Interface moderna e responsiva
- Tema escuro
- Efeitos de hover no gráfico
- Animações suaves de transição
- Formatação de números para melhor legibilidade

## Permissões Necessárias
- `storage`: Para armazenar preferências do usuário
- Acesso à API da Binance para dados históricos

## Como Usar
1. Clique no ícone da extensão na barra de ferramentas
2. Visualize o preço atual do Bitcoin
3. Alterne entre BRL e USD usando o seletor
4. Passe o mouse sobre o gráfico para ver detalhes específicos
5. Observe as mudanças de preço em tempo real

## Contribuição
Contribuições são bem-vindas! Por favor, sinta-se à vontade para submeter pull requests.

## Licença
Este projeto está sob a licença MIT.

---
Desenvolvido com 💙 para a comunidade crypto
