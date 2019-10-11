module Jekyll
  module ThumbURL
    def thumb_url(input)
      "https://thumbs-cdn.ohlasy.info/TODO/fit/640/9999/sm/0/plain/#{input}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::ThumbURL)