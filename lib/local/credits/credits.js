if (typeof(jQuery) == 'undefined') {
    console.log("Credits.js: jQuery not available, please check your setup.");
} else {
    jQuery(document).ready(function() {
        $("img[data-author]").each(function(index, image) {
            var author = $(image).attr("data-author");
            var wrapper = $("<div/>", {
                "class": "img-author-wrapper",
                "data-author": author,
            });
            $(image).wrap(wrapper);
        });
    });
}
