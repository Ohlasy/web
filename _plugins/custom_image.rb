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
            server_base = "https://thumbs-cdn.ohlasy.info/TODO/fit"
            output = "<img srcset=\"#{server_base}/3000/9999/sm/0/plain/#{@src} 3000w, #{server_base}/2000/9999/sm/0/plain/#{@src} 2000w, #{server_base}/1000/9999/sm/0/plain/#{@src} 1000w, #{server_base}/500/9999/sm/0/plain/#{@src} 500w\" src=\"#{@src}\" alt=\"#{alt}\" class=\"img-responsive img-popup\">"
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
