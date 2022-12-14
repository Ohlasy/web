## Licencování

Kód je uvolněn pod [licencí MIT](https://opensource.org/licenses/MIT). Na texty článků se vztahuje licence [Creative Commons BY–NC–ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) – stručně řečeno je můžete volně šířit, ale pouze pokud odkážete na jejich zdroj, nebudete je nijak měnit a nebudete je využívat komerčně.

## Technické řešení

Web je statický, hostovaný na [Vercelu](https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss) a generovaný pomocí [Next.js](https://nextjs.org). Zde je uložené pouze HTML a související data, zejména tedy nikoliv fotky a větší data.

Po pushnutí nového commitu na GitHub (nebo úpravě souboru přes webové rozhraní GitHubu) se spustí Vercel a postará se o přeložení a nasazení nové verze webu.

## Fotky

Fotky nejsou uložené v repository, protože jich máme moc a jsou příliš velké. Plné rozlišení je uložené v AWS S3 a klientům nabízíme několik různých menších rozlišení, které pak generujeme/konvertujeme za běhu a kešujeme.

Ve výsledku tedy fotky chodí směrem od klienta cestou prohlížeč → CDN (nahledy.ohlasy.info) → náhledová služba (`/api/resize`) → CDN (i.ohlasy.info) → S3. Ta poslední CDN (i.ohlasy.info) by asi šla vynechat, ale takhle máme k dispozici i pěkná HTTPS URL k obrázkům v původním rozlišení.

Podrobně je infrastruktura popsaná v souboru [infra.tf](https://github.com/Ohlasy/web/blob/master/infra.tf).

## Další servery

### data.ohlasy.info

Úložiště větších dat, například příloh, záznamů a podobně. AWS S3 + AWS CloudFront.

### forum.ohlasy.info

Virtuální server u [Digital Ocean](https://digitalocean.com), ručně instalovaná instance [Discourse](https://www.discourse.org).

[![Powered by Vercel](/assets/vercel.svg?raw=true)](https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss)