jQuery.getScript('/lib/fancybox/source/jquery.fancybox.pack.js', function() {
    // Load the Fancybox styles
    $('<link>').appendTo('head').attr({
        type: 'text/css',
        rel: 'stylesheet'
    }).attr('href', '/lib/fancybox/source/jquery.fancybox.css');
    // Wrap each img.img-popup in a a.fancybox
    $("img.img-popup").each(function(i, elem) {
        $(elem).removeClass('fancybox');
        $(elem).wrap($('<a/>', {
            'href': $(elem).attr('src'),
            'class': 'fancybox',
        }));
    });
    // Attach Fancybox
    $(".fancybox").fancybox();
});
