## Licencování

Kód je uvolněn pod [licencí MIT](https://opensource.org/licenses/MIT). Na texty článků se vztahuje licence [Creative Commons BY–NC–ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) – stručně řečeno je můžete volně šířit, ale pouze pokud odkážete na jejich zdroj, nebudete je nijak měnit a nebudete je využívat komerčně.

## Technické řešení

Web je statický, hostovaný na [Netlify](https://www.netlify.com) a generovaný pomocí [Jekylla](http://jekyllrb.com). Zde je uložené pouze HTML a související data, zejména tedy nikoliv fotky a větší data.

Po pushnutí nového commitu na GitHub (nebo úpravě souboru přes webové rozhraní GitHubu) se spustí Netlify a postará se o přeložení a nasazení nové verze webu:

[![Netlify Status](https://api.netlify.com/api/v1/badges/fecaf98d-dab6-4ca9-9dbf-6e1ce8fbeaf4/deploy-status)](https://app.netlify.com/sites/ohlasy/deploys)

## Fotky

Fotky nejsou uložené v repository, protože mají stovky a stovky megabajtů, což by nefungovalo dobře. Plné rozlišení je uložené v AWS S3 a klientům nabízíme několik různých menších rozlišení, které pak generujeme/konvertujeme za běhu ([imgproxy](https://github.com/imgproxy/imgproxy) u Digital Ocean) a kešujeme (AWS CloudFront).

Ve výsledku tedy fotky chodí směrem od klienta cestou prohlížeč → CDN (thumbs-cdn.ohlasy.info) → náhledový server (thumbs.ohlasy.info) → CDN (i.ohlasy.info) → S3. Ta poslední CDN (i.ohlasy.info) by asi šla vynechat, ale takhle máme k dispozici i pěkná HTTPS URL k obrázkům v původním rozlišení.

## Další servery

### data.ohlasy.info

Úložiště větších dat, například příloh, záznamů a podobně. AWS S3 + AWS CloudFront kvůli HTTPS.

### forum.ohlasy.info

Virtuální server u [Digital Ocean](https://digitalocean.com), ručně instalovaná instance [Discourse](https://www.discourse.org).