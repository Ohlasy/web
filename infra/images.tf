# Caching CDN in front of our image bucket hosted on Hetzner
resource "bunnynet_pullzone" "ohlasy-images" {
  name                  = "ohlasy-images"
  block_post_requests   = true
  block_root_path       = true
  cache_expiration_time = 31919000
  cache_stale           = ["offline", "updating"]
  safehop_enabled       = true
  use_background_update = true

  origin {
    type = "OriginUrl"
    url  = "https://nbg1.your-objectstorage.com/ohlasy-images"
  }

  routing {
    zones = ["EU", "US"]
  }
}

# Custom host name for the CDN above
resource "bunnynet_pullzone_hostname" "ohlasy-images-i" {
  pullzone    = bunnynet_pullzone.ohlasy-images.id
  name        = "i.ohlasy.info"
  tls_enabled = true
  force_ssl   = false
}

# Image resizing service running from a Docker container
resource "bunnynet_compute_container_app" "imgproxy" {
  name             = "imgproxy"
  version          = 2
  regions_allowed  = ["DE"]
  regions_required = ["DE"]
  autoscaling_min  = 1
  autoscaling_max  = 5

  container {
    name              = "imgproxy"
    image_registry    = 1156
    image_namespace   = "imgproxy"
    image_name        = "imgproxy"
    image_tag         = "v4.0.25-amd64"
    image_digest      = "sha256:405b563a1fe604ccdac7375b2bfd2286f1024dfe858785d4d185312dfaeeef26"
    image_pull_policy = "IfNotPresent"

    env {
      name  = "IMGPROXY_ALLOWED_SOURCES"
      value = "https://i.ohlasy.info/,https://*.kulturaboskovice.cz/"
    }

    # Serve modern formats based on the client's Accept header, even without an
    # explicit URL flag. imgproxy sets `Vary: Accept` on negotiated responses.
    env {
      name  = "IMGPROXY_AUTO_AVIF"
      value = "true"
    }
    env {
      name  = "IMGPROXY_AUTO_WEBP"
      value = "true"
    }
    env {
      name  = "IMGPROXY_ENFORCE_AVIF"
      value = "true"
    }
    env {
      name  = "IMGPROXY_ENFORCE_WEBP"
      value = "true"
    }

    endpoint {
      name = "http-alt"
      type = "CDN"

      cdn {
        origin_ssl = false
      }

      port {
        container = 8080
      }
    }
  }
}

# Caching CDN in front of our image resizing service above
resource "bunnynet_pullzone" "imgproxy" {
  name            = "mc-pgmhpyx75w"
  block_root_path = true
  cache_enabled   = true
  strip_cookies   = false

  # Vary the cache key by the browser's supported image format so that
  # Accept-header-negotiated WebP/AVIF variants are cached separately and we
  # never serve a modern format to a client that can't decode it.
  cache_vary = ["webp", "avif"]

  origin {
    type                  = "ComputeContainer"
    container_app_id      = "OSM39sU62F8i84S"
    container_endpoint_id = "OSM39sU62F8i84S-http-alt-iRMsFvAN69"
  }

  routing {}
}

# Custom host name for the resize CDN above
resource "bunnynet_pullzone_hostname" "imgproxy-thumbs" {
  pullzone    = bunnynet_pullzone.imgproxy.id
  name        = "thumbs.ohlasy.info"
  tls_enabled = true
  force_ssl   = false
}
