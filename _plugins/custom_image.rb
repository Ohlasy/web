require_relative "imgproxy_sign"

module Jekyll
    class CustomImageTag < Liquid::Tag
        def initialize(tag_name, markup, tokens)
            super
            @src = markup.scan(/src="([^"]+)"/).flatten.first
            @alt = markup.scan(/alt="([^"]+)"/).flatten.first
            @caption = markup.scan(/caption="([^"]+)"/).flatten.first
            @author = markup.scan(/author="([^"]+)"/).flatten.first
        end
        def render(context)
            alt = @alt ? @alt : @caption
            output = "<img srcset=\"#{signed_thumb_url(@src, 3000)} 3000w, #{signed_thumb_url(@src, 2000)} 2000w, #{signed_thumb_url(@src, 1000)} 1000w, #{signed_thumb_url(@src, 500)} 500w\" src=\"#{@src}\" alt=\"#{alt}\" class=\"img-responsive img-popup\">"
            if @caption && @author
                output += "<span class=\"img-meta\">#{@caption} <span class=\"img-author\">  foto: #{@author}</span></span>"
            elsif @caption
                output += "<span class=\"img-meta\">#{@caption}</span>"
            elsif @author
                output += "<span class=\"img-meta\"><span class=\"img-author\">foto: #{@author}</span></span>"
            end
            return output
        end
    end
end

Liquid::Template.register_tag('photo', Jekyll::CustomImageTag)
