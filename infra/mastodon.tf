# Caching CDN in front of our Mastodon media bucket hosted on Hetzner
resource "bunnynet_pullzone" "mastodon-media" {
  name                  = "mastodon-media"
  cache_stale           = ["offline", "updating"]
  safehop_enabled       = true
  safehop_retry_count   = 2
  safehop_retry_delay   = 1
  use_background_update = true

  origin {
    type = "OriginUrl"
    url  = "https://nbg1.your-objectstorage.com/boskovice-social-media"
  }

  routing {
    zones = ["EU", "US"]
  }
}

# Custom host name for the CDN above
resource "bunnynet_pullzone_hostname" "media-boskovice-social" {
  force_ssl   = false
  name        = "media.boskovice.social"
  pullzone    = 6060469
  tls_enabled = true
}
