# Talents-a
## Conceito
O sistema Talents A é um sistema para demonstração de como implementar portabilidade de acordo com a LGPD. Para que meus dados sejam importados de um sistema para o outro é necessário:
- Requisitar a permissão do usuário para compartilhar seus dados
- Expor de maneira clara quais dados serão exportados
- Garantir a autenticidade do sistema que deseja importar os dados

### Portabilidade de dados
O sistema Talenst-a importa os dados do sistema EasyTerms. O fluxo ocorre da seguinte maneira:
  1. Talents-a redireciona o usuário para o sistema origem (EasyTerms) para que o usuário se autentique e permita o compartilhamento de dados
  2. O sistema origem então fornece um token descartável para o sistema destino (Talents-a) para que ele requisite um token específico de portabilidade ao sistema origem. Após receber a resposta, esse token é armazenado para futuras requisições
  3. O usuário, através do sistema origem, pode revogar essa autorização bloqueando o sistema destino de acessar seus dados

### Autenticidade
O sistema que deseja acessar os dados compartilhados deve ser conhecido pelo sistema origem. O sistema origem deve ser capaz de reconhecer um sistema conhecido através do envio de um certificado SSL, que comprove sua identidade

## Como rodar
### Dependências
- Node.js

### Rodando o projeto
Instale as dependencias
`npm install`

Rode o projeto
Para desenvolvimento
```bash
npm run dev
```

```bash
npm run build

npm start
```
