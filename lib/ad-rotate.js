$(function() {

    // https://support.google.com/analytics/answer/1136920
    // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
    var trackLink = function(link, category, action, label) {
        try {
            ga('send', 'event', category, action, label);
        } catch (err) {}
        setTimeout(function() {
            document.location.href = link.href;
        }, 100);
        return false;
    }

    $.getJSON('/ads/index.js', function(adList) {
        // Sanity check
        if (!$.isArray(adList)) {
            return;
        }
        // Pick random ad
        var ad = adList[Math.floor(Math.random()*adList.length)];
        // Create the link
        var image = $('<img/>', {
            "src": ad.image,
            "class": 'img-responsive',
            "alt": ad.alt || '',
        });
        var link = $('<a/>', {"href": ad.url});
        link.append(image);
        link.click(function(event) {
            event.preventDefault();
            trackLink(this, 'reklama', 'klik', ad.name)
        });
        link.appendTo("#ad-wrapper");
        // Log ad view
        try {
            ga('send', 'event', 'reklama', 'zobrazení', ad.name);
        } catch (err) {}
    });

});
