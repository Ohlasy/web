## Technické řešení

Web je statický, hostovaný na [Vercelu](https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss) a generovaný pomocí [Next.js](https://nextjs.org). Zde je uložené pouze HTML a související data, zejména tedy nikoliv fotky a větší data.

Po pushnutí nového commitu na GitHub (nebo úpravě souboru přes webové rozhraní GitHubu) se spustí Vercel a postará se o přeložení a nasazení nové verze webu.

## Fotky

Fotky nejsou uložené v repozitáři, protože jich máme moc a jsou příliš velké. Plné rozlišení je uložené v AWS S3 a klientům nabízíme několik různých menších rozlišení, které pak generujeme/konvertujeme za běhu a kešujeme (používáme standardní obrázkovou pipeline Vercelu).

## Data

Větší data, například přílohy nebo epizody podcastu, jsou na serveru data.ohlasy.info (AWS S3 + CloudFront).

[![Powered by Vercel](/public/vercel.svg?raw=true)](https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss)
