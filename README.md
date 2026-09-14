# Para Érica

Experiência de aniversário em React, TypeScript e Vite. Fotos e fontes locais; sem backend.

## Executar

```sh
npm install
npm run dev
```

## Publicar

```sh
npm run build
```

### GitHub Pages

O workflow `.github/workflows/deploy.yml` instala as dependências com `npm ci`, compila o site e publica `dist` em cada push para `main`. Também permite execução manual na aba Actions.

No repositório, selecione **Settings → Pages → Build and deployment → Source → GitHub Actions** antes da primeira execução. Após enviar o commit, acompanhe **Actions → Deploy GitHub Pages**.

URL deste repositório: https://MuriloRamos007.github.io/erica/

A base é inferida de `GITHUB_REPOSITORY` no workflow e de `git remote get-url origin` localmente. Para o remote atual, o resultado é `/erica/`. Repositórios de usuário (`usuario.github.io`) usam `/`; cópias sem Git usam caminhos relativos. As fotos permanecem em `public/photos`, fontes são empacotadas pelo Vite e a música utiliza `BASE_URL`. Nenhum roteador é necessário.

Para revisar o build localmente:

```sh
npm ci
npm run build
npm run preview
```

Abra o endereço exibido pelo Vite, acrescentando `/erica/`. Para executar os testes existentes contra a produção, com Chrome instalado, use em outro terminal PowerShell:

```powershell
$env:TEST_URL = "http://127.0.0.1:4173/erica/"
npm run verify
node scripts/motion-check.mjs
```

As capturas e os relatórios em `verification/` são locais e ficam fora do Git. `public/` permanece versionado integralmente.

### Outros servidores estáticos

As configurações da Vercel e Netlify continuam disponíveis. Para hospedar na raiz, use o comando de build `npx tsc -b && npx vite build --base=/`, com diretório de saída `dist`.

## Música opcional

Adicione `music.mp3` na pasta `public` e gere o build novamente. O controle aparece somente quando o arquivo existe. A reprodução só é solicitada após interação; é possível pausar e retomar. Sem o arquivo, a experiência funciona em silêncio.

## Fotos

As 25 imagens originais foram examinadas. Dez fotos foram selecionadas em versões WebP de até 480, 960 e 1440 pixels, sem ampliar os originais e sem alterar a pasta de origem. `photo-inventory.json` registra os formatos e dimensões. Para recriar as versões locais, use `npm run photos -- "C:/Users/muril/Pictures/imagens do site"`.

## Experiência

O poema e a carta ficam em `src/data`. O coração recebe uma das 24 partes por verso observado e a carta só é liberada após a conclusão. Fotos abrem em diálogo acessível com Escape e foco contido. O reinício desmonta a experiência, cancela temporizadores e zera o progresso. A preferência por movimento reduzido é respeitada.
