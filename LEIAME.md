# Landing Embaixadoras Go Woman

Página única (HTML, CSS e JS, sem build). Pasta pronta para subir no GitHub Pages.

## 1. Ligar a planilha (5 minutos)

1. Entre na conta Google da Go Woman e crie uma planilha nova (nome sugerido: "Fichas Embaixadoras").
2. Abra **Extensões > Apps Script**, apague o que estiver lá e cole o conteúdo de `apps-script.gs`.
3. No topo do script, preencha `EMAIL_AVISO` com o e-mail que deve receber o aviso de cada ficha (ou deixe vazio).
4. Clique em **Implantar > Nova implantação > Tipo: App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Autorize o acesso quando o Google pedir (aparece o aviso "app não verificado": Avançado > Acessar).
6. Copie a **URL do app da Web** (termina em `/exec`).
7. No `index.html`, procure `CONFIG` perto do fim e cole a URL em `ENDPOINT`. Preencha também `WHATSAPP` com o número da Secretaria Executiva (ex.: `5512999999999`).
8. Envie uma ficha de teste pela página e confira se a linha apareceu na aba **Fichas**.

Se você editar o script depois, use **Implantar > Gerenciar implantações > Editar > Nova versão**. A URL continua a mesma.

## 2. Publicar no GitHub Pages

1. Crie um repositório e envie estes arquivos (`index.html`, `img/`, `fonts/`, `apps-script.gs`, `LEIAME.md`).
2. Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em alguns minutos a página abre em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Observações

- **Modo teste:** com `ENDPOINT` vazio, a página funciona mas não envia nada (os dados aparecem só no console do navegador).
- **Fontes:** a Aileron e a Times New Roman MT Condensed são licenciadas. Em repositório público, qualquer pessoa consegue baixar os arquivos da pasta `fonts/`. Se isso for um problema, use repositório privado (Pages em repo privado exige plano pago do GitHub) ou verifique a licença de uso web.
- **Privacidade:** a planilha guarda dados pessoais. Compartilhe só com quem precisa e considere deixar o `apps-script.gs` fora do repositório público (ele não tem senhas, mas não precisa estar lá).
- **Limite de e-mails:** contas Google gratuitas enviam até 100 e-mails por dia pelo script.
- **Contribuição:** o valor (R$ 1.750,30) está em dois lugares do `index.html`: busque por `1.750,30` e `1750,30`.
