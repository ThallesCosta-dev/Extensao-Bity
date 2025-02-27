# Bitcoin Price Tracker - Extensão Chrome

## Descrição
Uma extensão para o Google Chrome que permite acompanhar o preço do Bitcoin em tempo real nas moedas BRL (Real Brasileiro) e USD (Dólar Americano). A extensão oferece um gráfico interativo dos últimos 30 minutos e permite calcular o valor total de seus Bitcoins.

## Funcionalidades

### Principais recursos
- Monitoramento em tempo real do preço do Bitcoin
- Alternância entre BRL e USD
- Gráfico interativo dos últimos 30 minutos
- Cálculo do valor total de seus Bitcoins
- Atualização automática a cada 10 segundos
- Indicador de variação de preço (positivo/negativo)

### Visualização de dados
- Gráfico de linha interativo
- Tooltips com informações detalhadas
- Efeito visual de hover no gráfico
- Formatação de valores monetários

## Instalação

1. Faça o download ou clone este repositório
2. Abra o Chrome e acesse `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactação"
5. Selecione a pasta do projeto

## Como usar

1. Clique no ícone da extensão na barra de ferramentas do Chrome
2. Selecione a moeda desejada (BRL/USD) no seletor
3. Insira a quantidade de Bitcoins que você possui (opcional)
4. Observe o gráfico e as informações atualizadas em tempo real

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Chart.js para visualização de gráficos
- API Binance para dados em tempo real
- Chrome Storage API para persistência de dados

## Estrutura do projeto
```bash
bitcoin-price-tracker/
├── manifest.json
├── popup.html
├── popup.js
├── styles.css
├── background.js
└── assets/
└── icons/
```
## APIs utilizadas

- Binance API
  - Endpoint para BRL: `api.binance.com/api/v3/klines?symbol=BTCBRL`
  - Endpoint para USD: `api.binance.com/api/v3/klines?symbol=BTCUSDT`

## Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
