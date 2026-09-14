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

Importe esta pasta na Vercel ou Netlify. Comando de build: `npm run build`. Diretório de saída: `dist`. Os arquivos de configuração já estão incluídos. Também é possível hospedar o conteúdo de `dist` em qualquer servidor estático.

## Música opcional

Adicione `music.mp3` na pasta `public` e gere o build novamente. O controle aparece somente quando o arquivo existe. A reprodução só é solicitada após interação; é possível pausar e retomar. Sem o arquivo, a experiência funciona em silêncio.

## Fotos

As 25 imagens originais foram examinadas. Dez fotos foram selecionadas em versões WebP de até 480, 960 e 1440 pixels, sem ampliar os originais e sem alterar a pasta de origem. `photo-inventory.json` registra os formatos e dimensões. Para recriar as versões locais, use `npm run photos -- "C:/Users/muril/Pictures/imagens do site"`.

## Experiência

O poema e a carta ficam em `src/data`. O coração recebe uma das 24 partes por verso observado e a carta só é liberada após a conclusão. Fotos abrem em diálogo acessível com Escape e foco contido. O reinício desmonta a experiência, cancela temporizadores e zera o progresso. A preferência por movimento reduzido é respeitada.
