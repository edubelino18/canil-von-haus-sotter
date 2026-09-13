# Canil Von Haus Sotter — site

Site estático (HTML/CSS/JS puro) publicado no GitHub Pages. Não depende de nenhum servidor, banco de dados ou build — para atualizar, basta editar o arquivo certo direto pelo GitHub (pelo navegador, sem precisar de nada instalado) e o site atualizado sobe sozinho em 1–2 minutos.

## Estrutura

- `index.html` — todo o conteúdo de texto do site (títulos, parágrafos, perguntas frequentes).
- `styles.css` — cores, fontes e layout.
- `app.js` — menu mobile, botões de WhatsApp e a galeria de fotos (lightbox).
- `assets/` — todas as fotos e a logo.

## Como atualizar um texto

1. No GitHub, abra `index.html`.
2. Clique no ícone de lápis (Edit) no canto superior direito do arquivo.
3. Altere o texto desejado (fique dentro das tags, sem apagar os `<...>`).
4. Role até o fim da página e clique em **Commit changes**.

## Como trocar uma foto

1. Prepare a nova foto já no tamanho/formato desejado (idealmente `.webp` ou `.jpg`).
2. Na pasta `assets/`, clique em **Add file → Upload files** e suba a nova foto com o **mesmo nome** da que será substituída (ex: `hero-real.webp`) — o GitHub avisa que vai sobrescrever, confirme.
3. Pronto, não precisa mexer em mais nada.

Para adicionar uma foto nova (não substituir), suba com um nome novo e adicione uma tag `<img src="assets/nome-da-foto.webp" ...>` no `index.html` seguindo o padrão das fotos já existentes.

## Como trocar o número de WhatsApp

No arquivo `app.js`, altere a primeira linha:

```js
const WHATSAPP_NUMBER = "554199625634";
```

## Publicação (GitHub Pages)

Em **Settings → Pages** deste repositório, defina "Deploy from a branch", branch `main`, pasta `/ (root)`. Qualquer commit na branch `main` publica automaticamente a versão nova.
