---
why: A dummy comment to make Jekyll process this file
---

[
{% for article in site.posts %}
    {
        "title": {{ article.title | jsonify }},
        "author": {{ article.author | jsonify }},
        "category": {{ article.category | jsonify }},
        "pubDate": {{ article.date | jsonify }},
        "cover-photo": {{ article.cover-photo | thumb_url: 640 | jsonify }},
        "perex": {{ article.excerpt | strip_html | jsonify }},
        "serial": {{ article.serial | jsonify }},
        "relativeURL": {{ article.url | jsonify }},
        "tags": {{ article.tags | jsonify }},
        "numberOfWords": {{ article.content | number_of_words }}
    }
    {% if forloop.last == false %},{% endif %}
{% endfor %}
]
