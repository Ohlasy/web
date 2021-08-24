#
# Master image store / i.ohlasy.info
#
# This is where we store image “masters”, ie. full-resolution photos. An S3 bucket behind
# a CloudFront distribution. Most of the time we don’t refer to these images directly, but
# through a rescaling service (see below) that creates appropriate lower-resolution images.
#

# S3 bucket
resource "aws_s3_bucket" "img" {
  bucket = "i.ohlasy.info"
  acl    = "public-read"
  website {
    index_document = "index.html"
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "i-ohlasy-info" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  aliases = ["i.ohlasy.info"]

  origin {
    domain_name = aws_s3_bucket.img.bucket_domain_name
    origin_id   = "S3-i.ohlasy.info"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-i.ohlasy.info"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.i-ohlasy-info.arn
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
  }
}

# DNS record for the distribution
resource "aws_route53_record" "i-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "i.ohlasy.info"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.i-ohlasy-info.domain_name
    zone_id                = aws_cloudfront_distribution.i-ohlasy-info.hosted_zone_id
    evaluate_target_health = false
  }
}

# SSL cert
resource "aws_acm_certificate" "i-ohlasy-info" {
  provider          = aws.us-east-1
  domain_name       = "i.ohlasy.info"
  validation_method = "DNS"
}

# DNS cert validation record
resource "aws_route53_record" "validation-i-ohlasy-info" {
  for_each = {
    for dvo in aws_acm_certificate.i-ohlasy-info.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name    = each.value.name
  records = [each.value.record]
  ttl     = 300
  type    = each.value.type
  zone_id = aws_route53_zone.ohlasy-info.zone_id
}

# Make sure the SSL cert is valid
resource "aws_acm_certificate_validation" "i-ohlasy-info" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.i-ohlasy-info.arn
  validation_record_fqdns = [for record in aws_route53_record.validation-i-ohlasy-info : record.fqdn]
}

#
# Low-res image cache
#

# CloudFront distribution
resource "aws_cloudfront_distribution" "nahledy-ohlasy-info" {
  enabled         = true
  is_ipv6_enabled = true
  price_class     = "PriceClass_100"

  aliases = ["nahledy.ohlasy.info"]

  origin {
    domain_name = "ohlasy.info"
    origin_id   = "ohlasy.info"
    origin_path = "/api/resize"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ohlasy.info"

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 31536000
    default_ttl            = 31536000
    max_ttl                = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.nahledy-ohlasy-info.arn
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
  }
}

# DNS record for the distribution
resource "aws_route53_record" "nahledy-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "nahledy.ohlasy.info"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.nahledy-ohlasy-info.domain_name
    zone_id                = aws_cloudfront_distribution.nahledy-ohlasy-info.hosted_zone_id
    evaluate_target_health = false
  }
}

# SSL cert
resource "aws_acm_certificate" "nahledy-ohlasy-info" {
  provider          = aws.us-east-1
  domain_name       = "nahledy.ohlasy.info"
  validation_method = "DNS"
}

# DNS cert validation record
resource "aws_route53_record" "validation-nahledy-ohlasy-info" {
  for_each = {
    for dvo in aws_acm_certificate.nahledy-ohlasy-info.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name    = each.value.name
  records = [each.value.record]
  ttl     = 300
  type    = each.value.type
  zone_id = aws_route53_zone.ohlasy-info.zone_id
}

# Make sure the SSL cert is valid
resource "aws_acm_certificate_validation" "nahledy-ohlasy-info" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.nahledy-ohlasy-info.arn
  validation_record_fqdns = [for record in aws_route53_record.validation-nahledy-ohlasy-info : record.fqdn]
}
