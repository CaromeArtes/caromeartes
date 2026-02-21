# Guia de Uso e Deploy - Catálogo CaromeArtes

Este guia explica como rodar o projeto localmente, personalizar o conteúdo e publicar na internet via GitHub Pages.

## 1. Rodando Localmente

Para visualizar o site no seu computador:

1.  Abra o terminal na pasta do projeto.
2.  Instale as dependências (se ainda não fez):
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Acesse o link mostrado (geralmente `http://localhost:5173/caromeartes/`).

## 2. Personalização

### Alterar Produtos
Edite o arquivo `src/data/products.js`.
- Adicione, remova ou edite os objetos na lista.
- Imagens: Coloque suas fotos na pasta `public/images/` e atualize o caminho no arquivo (ex: `/images/minha-foto.jpg`).

### Alterar Categorias
Edite `src/data/categories.js`.

### Alterar Imagens do Banner (Hero)
Edite `src/components/layout/Hero.jsx`.
- Modifique a array `slides` com novos URLs de imagem e textos.

### Configurar WhatsApp
Edite `src/components/layout/WhatsAppButton.jsx` e `src/components/product/ProductCard.jsx`.
- Troque o número `5511999999999` pelo seu número real (incluindo DDI 55 e DDD).

## 3. Publicando na Internet (GitHub Pages)

O projeto já está configurado para deploy automático via script.

1.  **Pré-requisitos**:
    - O repositório deve estar no GitHub.
    - O arquivo `vite.config.js` deve ter a propriedade `base` correta (atualmente `/caromeartes/`). Se o nome do repositório for diferente, ajuste lá.

2.  **Fazer o Deploy**:
    No terminal, rode:
    ```bash
    npm run deploy
    ```
    Isso vai criar uma pasta `dist` com o site otimizado e enviar para o branch `gh-pages` do GitHub.

3.  **Configurar no GitHub**:
    - Vá na página do repositório no GitHub.
    - Clicke em **Settings** > **Pages**.
    - Em **Source**, selecione `Deploy from a branch`.
    - Em **Branch**, selecione `gh-pages` e pasta `/ (root)`.
    - Clique em **Save**.

Após alguns minutos, seu site estará disponível no link fornecido pelo GitHub (ex: `https://seu-usuario.github.io/caromeartes/`).

## 4. Dicas de SEO e Vendas

- **Imagens**: Use imagens leves (formato WebP é ideal) para o site carregar rápido.
- **Títulos**: Capriche nos nomes e descrições dos produtos.
- **WhatsApp**: Responda rápido! O botão leva o cliente direto para você.
