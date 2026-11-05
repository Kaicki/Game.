# Arcade Nuvem

Catálogo independente de jogos HTML5, com identidade visual própria e reprodução integrada por iframe.

## Arquivos

- `index.html` — estrutura do catálogo e da tela de jogo.
- `styles.css` — identidade visual e layout responsivo.
- `app.js` — catálogo, pesquisa, filtros, navegação e integração dos jogos.

## Executar

1. Extraia o ZIP.
2. Abra `index.html` em um navegador moderno.
3. Para testar por servidor local, rode `python -m http.server 8000` na pasta e abra `http://localhost:8000`.

## Jogos e URLs já cadastradas

O catálogo inicial contém dez jogos com URLs de reprodução preenchidas:
- Koutack — Famobi
- Fireboy & Watergirl 7 — GameDistribution
- Traffic — Famobi
- Ramp — Famobi
- Om Nom Run — Famobi
- 2048 — Famobi
- Crazy Caves — Famobi
- Dream Mania: Happy Match — GameDistribution
- 3D Super Rolling Ball Race — GameDistribution
- Tap Block Puzzle — GameDistribution

As URLs foram obtidas em páginas de catálogo que apresentam opções/códigos de incorporação. Isso não significa que todos os títulos sejam jogos do catálogo oficial do Friv. São jogos HTML5 de provedores externos, adequados para um portal independente. Verifique e mantenha as permissões, os termos, créditos e anúncios exigidos por cada provedor antes de publicar o site.

## Como a reprodução funciona

Cada objeto no array `games` possui `gameUrl`. Ao abrir um jogo, a tela de catálogo é ocultada e o endereço é carregado em um iframe. Ao voltar ao catálogo ou trocar de jogo, o iframe anterior é descarregado.

Por segurança básica, o código aceita somente HTTPS e os hosts `play.famobi.com` e `html5.gamedistribution.com`. Se um provedor bloquear incorporação por política de frame, o usuário verá um link para abrir o jogo em uma nova aba.

## Adicionar outro jogo

Adicione um objeto ao array `games` em `app.js`, usando:
`id`, `title`, `category`, `description`, `emoji`, `bg`, `kind: "external"`, `tag` e `gameUrl`.

Só use URLs de incorporação fornecidas pelo titular ou distribuidor e inclua o domínio do provedor na lista `allowedHosts` apenas depois de verificar sua autorização e seus requisitos técnicos.
