### Praktické odkazy

* [Návod na vkládání článků](https://github.com/Ohlasy/ohlasy/blob/master/vkladani-clanku.md)
* [Návod na vkládání fotografií](https://github.com/Ohlasy/ohlasy/blob/master/vkladani-fotografii.md)
* [Návod na značkování textu](https://github.com/Ohlasy/ohlasy/blob/master/markdown.md)

[![Build Status](https://travis-ci.org/Ohlasy/web.svg?branch=gh-pages)](https://travis-ci.org/Ohlasy/web)

### Technické řešení

* O generování webu z podkladů se stará [Jekyll](http://jekyllrb.com). Související soubory: [\_config.yml](https://github.com/Ohlasy/web/blob/gh-pages/_config.yml) a myslím že všechny adresáře začínající podtržítkem.

* Po pushnutí nového commitu na GitHub (nebo úpravě souboru přes webové rozhraní GitHubu) se spustí [Travis](https://travis-ci.org), který stáhne čerstvou kopii repository, nainstaluje v čistém kontejneru všechen potřebný software a web přeloží. Související soubory: [.travis.yml](https://github.com/Ohlasy/web/blob/gh-pages/.travis.yml).

* Pokud se web přeloží dobře, Travis nakonec spustí skript [s3_website](https://github.com/laurilehmijoki/s3_website), který vygenerované soubory nahraje do [Amazon S3](https://aws.amazon.com/s3/). Související soubory: [s3_website.yml](https://github.com/Ohlasy/web/blob/gh-pages/s3_website.yml).

### Licencování

Kód je uvolněn pod [licencí MIT](https://opensource.org/licenses/MIT). Na texty článků se vztahuje licence [Creative Commons BY–NC–ND](https://creativecommons.org/licenses/by-nc-nd/4.0/) – stručně řečeno je můžete volně šířit, ale pouze pokud odkážete na jejich zdroj, nebudete je nijak měnit a nebudete je využívat komerčně.
