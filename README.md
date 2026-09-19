# Canil Von Haus Sótter — site

Site estático (HTML/CSS/JS puro) publicado no GitHub Pages. Não depende de nenhum servidor, banco de dados ou build — para atualizar, basta editar o arquivo certo direto pelo GitHub (pelo navegador, sem precisar de nada instalado) e o site atualizado sobe sozinho em 1–2 minutos.

## Estrutura

- `index.html` — todo o conteúdo de texto do site (títulos, parágrafos, seções).
- `styles.css` — cores, fontes e layout.
- `app.js` — menu mobile, botões de WhatsApp, rotação das fotos de capa e a galeria de fotos (lightbox).
- `assets/` — todas as fotos, organizadas em uma pasta por seção do site:
  - `assets/site/` — logo, favicon e a imagem de prévia de compartilhamento (`og-cover.webp`).
  - `assets/sobre/`, `assets/criacao/`, `assets/adestramento/`, `assets/hospedagem/`, `assets/contato/` — fotos de cada seção.

Dentro da pasta de cada seção, os nomes seguem sempre o mesmo padrão:
- `capa-1.webp`, `capa-2.webp`, `capa-3.webp`... — fotos da "capa" (hero) daquela seção. Quando há mais de uma, elas ficam alternando automaticamente a cada alguns segundos.
- `detalhe-1.webp`, `detalhe-2.webp` — as duas fotos de detalhe no fim da seção (clicáveis para ampliar).

Todas as fotos usam o formato `.webp` (mais leve que `.jpg` na mesma qualidade visual, o que deixa o site mais rápido). Ao trocar uma foto, converta para `.webp` antes de subir — praticamente qualquer editor de imagem ou conversor online faz isso.

Além do arquivo principal, a maioria das fotos tem uma segunda versão menor com `-800` no nome (ex: `capa-1-800.webp`, 800px de largura) — o navegador escolhe sozinho qual baixar (a pequena em celular, a grande em telas maiores). Isso é o que deixa o carregamento mais rápido no celular. **Se for trocar uma foto que tem essa versão `-800`, troque as duas** (mesmo conteúdo, só tamanhos diferentes) — senão quem acessa pelo celular continua vendo a foto antiga.

## Como atualizar um texto

1. No GitHub, abra `index.html`.
2. Clique no ícone de lápis (Edit) no canto superior direito do arquivo.
3. Altere o texto desejado (fique dentro das tags, sem apagar os `<...>`).
4. Role até o fim da página e clique em **Commit changes**.

## Como trocar uma foto existente

1. Prepare a nova foto já convertida para `.webp` e no tamanho desejado.
2. Vá até a pasta da seção certa (ex: `assets/adestramento/`), clique em **Add file → Upload files** e suba a nova foto com o **mesmo nome** da que será substituída (ex: `detalhe-1.webp`) — o GitHub avisa que vai sobrescrever, confirme.
3. Se existir um arquivo `-800` com esse mesmo nome (ex: `detalhe-1-800.webp`), repita o upload também para ele, com uma versão redimensionada para 800px de largura.
4. Mais fácil: peça pro Claude Code fazer a troca — ele já sabe gerar a versão `-800` certinha e evita esse tipo de esquecimento.

## Como adicionar mais uma foto rotativa na capa de uma seção

1. Suba a foto na pasta da seção com o próximo número disponível, por exemplo `assets/criacao/capa-2.webp`.
2. No `index.html`, encontre a seção correspondente e localize o bloco `<div class="section-hero-image hero-slideshow">`. Adicione uma nova linha logo abaixo da `<img>` que já existe ali, seguindo o mesmo padrão, só trocando o número do arquivo:
   ```html
   <img src="assets/criacao/capa-2.webp" alt="..." width="960" height="1280" loading="lazy" decoding="async">
   ```
3. Pronto — com duas ou mais fotos nesse bloco, o site passa a alternar entre elas automaticamente (a cada 6 segundos, com transição suave).

## Como trocar o número de WhatsApp

Os links de WhatsApp ficam prontos direto no `index.html`, no formato `https://wa.me/55419...?text=...`. Use "Localizar e substituir" (Ctrl+F) para achar `5541999625634` e trocar por `55DDNNNNNNNNN` (código do país + DDD + número, sem espaços ou símbolos) em todas as ocorrências — são 5 links no total (3 botões de seção, 1 no rodapé/contato e o ícone flutuante).

## Publicação (GitHub Pages)

Em **Settings → Pages** deste repositório, defina "Deploy from a branch", branch `main`, pasta `/ (root)`. Qualquer commit na branch `main` publica automaticamente a versão nova.

O site fica no ar em **https://vsotter.com.br** (domínio próprio, registrado no Registro.br). O arquivo `CNAME` na raiz do repositório é o que diz ao GitHub Pages para responder por esse domínio — não apague nem renomeie esse arquivo. O DNS do domínio aponta para os servidores do GitHub Pages (registros configurados no painel do Registro.br).
