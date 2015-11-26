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
        "perex": {{ article.excerpt | strip_html | jsonify }},
        "serial": {{ article.serial | jsonify }},
        "relativeURL": {{ article.url | jsonify }}
    }
    {% if forloop.last == false %},{% endif %}
{% endfor %}
]
