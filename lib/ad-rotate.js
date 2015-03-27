$(function() {

    // https://support.google.com/analytics/answer/1136920
    // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
    function trackLink(link, category, action, label) {
        try {
            ga('send', 'event', category, action, label);
        } catch (err) {}
        setTimeout(function() {
            document.location.href = link.href;
        }, 100);
        return false;
    }

    function renderAd(ad) {
        var link = $('<a/>', {"href": ad.url});
        var isArticlePromo = !!ad.title;
        var imageClass = isArticlePromo ? 'cover' : 'img-responsive';

        if (ad.name) {
            link.click(function(event) {
                event.preventDefault();
                trackLink(this, 'reklama', 'klik', ad.name)
            });
        }

        link.append($('<img/>', {
            "src": ad.image,
            "class": imageClass,
            "alt": ad.alt || ad.title || ''
        }));

        if (ad.title) {
            link.append($('<p/>', {
                "text": ad.title
            }));
        }

        return link;
    }

    function compareAds(a, b) {
        var ap = a.priority || 0;
        var bp = b.priority || 0;
        if (ap > bp) {
            return -1;
        } else if (bp > ap) {
            return +1;
        } else {
            return (Math.random() > 0.5) ? -1 : 1;
        }
    }

    function isValidAd(ad) {
        return ad && ad.image;
    }

    var representedTitles = {};
    $('.article-preview h2').each(function(i, head) {
        representedTitles[head.innerHTML] = 1;
    });

    $.getJSON('/ads/index.js', function(adList) {
        $.getJSON('/ads/promoted-articles.js', function(articleList) {
            var list = adList.concat(articleList).filter(isValidAd).sort(compareAds);
            $('.box').each(function(index, container) {
                // Insert ad
                var ad;
                do {
                    ad = list.shift();
                } while (ad.title && representedTitles[ad.title]);
                $(container).append(renderAd(ad));
                // Log ad view
                if (ad.name) {
                    try {
                        ga('send', 'event', 'reklama', 'zobrazení', ad.name);
                    } catch (err) {}
                }
            });
        })
    });

});
