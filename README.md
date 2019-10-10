[![Netlify Status](https://api.netlify.com/api/v1/badges/fecaf98d-dab6-4ca9-9dbf-6e1ce8fbeaf4/deploy-status)](https://app.netlify.com/sites/ohlasy/deploys)

## Licencování

Kód je uvolněn pod [licencí MIT](https://opensource.org/licenses/MIT). Na texty článků se vztahuje licence [Creative Commons BY–NC–ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) – stručně řečeno je můžete volně šířit, ale pouze pokud odkážete na jejich zdroj, nebudete je nijak měnit a nebudete je využívat komerčně.

## Technická infrastruktura

### www.ohlasy.info

* Samotný web, statická stránka hostovaná přes [Netlify](https://www.netlify.com). Pouze HTML a související data, zejména tedy nikoliv fotky a větší data.

* O generování webu z podkladů se stará [Jekyll](http://jekyllrb.com). Související soubory: [\_config.yml](https://github.com/Ohlasy/web/blob/gh-pages/_config.yml) a myslím že všechny adresáře začínající podtržítkem.

* Po pushnutí nového commitu na GitHub (nebo úpravě souboru přes webové rozhraní GitHubu) se spustí Netlify a postará se o přeložení a nasazení nové verze webu.

### i.ohlasy.info

Úložiště fotek, AWS S3 + AWS CloudFront kvůli HTTPS.

### data.ohlasy.info

Úložiště větších dat, například příloh, záznamů a podobně. AWS S3 + AWS CloudFront kvůli HTTPS.
