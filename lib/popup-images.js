jQuery.getScript('/node_modules/fancybox/dist/js/jquery.fancybox.pack.js', function() {
    // Load the Fancybox styles
    $('<link>').appendTo('head').attr({
        type: 'text/css',
        rel: 'stylesheet'
    }).attr('href', '/node_modules/fancybox/dist/css/jquery.fancybox.css');
    // Wrap each img.img-popup in a a.fancybox
    $("img.img-popup").each(function(i, elem) {
        $(elem).removeClass('fancybox');
        $(elem).wrap($('<a/>', {
            'href': $(elem).attr('src'),
            'class': 'fancybox',
            'rel': 'fotky',
        }));
    });
    // Attach Fancybox
    $(".fancybox").fancybox();
});
