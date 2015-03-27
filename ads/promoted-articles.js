---
why: Jekyll, please parse this file
---

[
{% for path in site.data.promoted-articles %}
    {% for candidate in site.posts %}
        {% if candidate.url == path %}
            {
                "url": "{{ path }}",
                "title": "{{ candidate.title }}",
                "image": "{{ candidate.cover-photo }}"
            },
        {% endif %}
    {% endfor %}
{% endfor %}
    {}
]
