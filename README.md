## Licencování

Kód je uvolněn pod [licencí MIT](https://opensource.org/licenses/MIT). Na texty článků se vztahuje licence [Creative Commons BY–NC–ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) – stručně řečeno je můžete volně šířit, ale pouze pokud odkážete na jejich zdroj, nebudete je nijak měnit a nebudete je využívat komerčně.

## Technické řešení

Web je statický, hostovaný na [Vercelu](https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss) a generovaný pomocí [Jekylla](http://jekyllrb.com). Zde je uložené pouze HTML a související data, zejména tedy nikoliv fotky a větší data.

Po pushnutí nového commitu na GitHub (nebo úpravě souboru přes webové rozhraní GitHubu) se spustí Vercel a postará se o přeložení a nasazení nové verze webu.

## Fotky

Fotky nejsou uložené v repository, protože mají stovky a stovky megabajtů, což by nefungovalo dobře. Plné rozlišení je uložené v AWS S3 a klientům nabízíme několik různých menších rozlišení, které pak generujeme/konvertujeme za běhu ([imgproxy](https://github.com/imgproxy/imgproxy) u Digital Ocean) a kešujeme (AWS CloudFront).

Ve výsledku tedy fotky chodí směrem od klienta cestou prohlížeč → CDN (thumbs-cdn.ohlasy.info) → náhledový server (thumbs.ohlasy.info) → CDN (i.ohlasy.info) → S3. Ta poslední CDN (i.ohlasy.info) by asi šla vynechat, ale takhle máme k dispozici i pěkná HTTPS URL k obrázkům v původním rozlišení.

Náhledový server vyžaduje autentizaci, aby ho nemohl používat kdokoliv mimo tohoto webu. Autentizace se dělá kryptografickým podpisem obrázkových URL, viz [dokumentaci imgproxy](https://github.com/imgproxy/imgproxy/blob/master/docs/signing_the_url.md). Aby se tenhle podpis správně vygeneroval během překladu, je nutné nastavit proměnné prostředí `IMGPROXY_KEY` a `IMGPROXY_SALT`. (Pokud nastavené nejsou, překlad webu skončí chybou.) Ve Vercelu jsou oba parametry nastavené.

## Další servery

### data.ohlasy.info

Úložiště větších dat, například příloh, záznamů a podobně. AWS S3 + AWS CloudFront kvůli HTTPS.

### forum.ohlasy.info

Virtuální server u [Digital Ocean](https://digitalocean.com), ručně instalovaná instance [Discourse](https://www.discourse.org).

[![Powered by Vercel](/assets/vercel.svg?raw=true)](https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss)