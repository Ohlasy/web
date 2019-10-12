require_relative "imgproxy_sign"

module Jekyll
  module ThumbURL
    def thumb_url(photo_url, size)
      if photo_url != nil
        return signed_thumb_url(photo_url, size)
      else
        return ""
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ThumbURL)