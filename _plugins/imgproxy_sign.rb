require "openssl"
require "base64"

def sign_path(path)

    key = ENV["IMGPROXY_KEY"]
    salt = ENV["IMGPROXY_SALT"]

    if key == nil || salt == nil
        raise "Env variable IMGPROXY_KEY or IMGPROXY_SALT not set, cannot sign image URLs"
    end

    key = [key].pack("H*")
    salt = [salt].pack("H*")

    digest = OpenSSL::Digest.new("sha256")
    return Base64.urlsafe_encode64(OpenSSL::HMAC.digest(digest, key, "#{salt}#{path}")).tr("=", "")
end

def signed_thumb_url(src_url, width)

    encoded_url = Base64.urlsafe_encode64(src_url).tr("=", "").scan(/.{1,16}/).join("")
    path = "/fit/#{width}/9999/sm/0/#{encoded_url}.jpg"
    hmac = sign_path(path)

    return "https://thumbs-cdn.ohlasy.info/#{hmac}#{path}"
end
