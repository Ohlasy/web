require 'digest/sha1'

def signed_thumb_url(src_url, width)

    hash_secret = ENV["IMGPROXY_KEY"]

    if hash_secret == nil
        raise "Env variable IMGPROXY_KEY not set, cannot sign image URLs"
    end

    payload = "#{src_url}:#{width}:#{hash_secret}"
    proof = Digest::SHA1.hexdigest(payload)

    return "https://nahledy.ohlasy.info/?src=#{src_url}&width=#{width}&proof=#{proof}"
end
