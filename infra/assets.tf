#
# Asset Storage / data.ohlasy.info
#
# This is where we store “attachments” or large files we need a nice public URL to.
# It’s an S3 bucket behind a CloudFront distribution.
#

# S3 bucket
resource "aws_s3_bucket" "data" {
  bucket = "data.ohlasy.info"
  acl    = "public-read"
  website {
    index_document = "index.html"
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "data-ohlasy-info" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  aliases = ["data.ohlasy.info"]

  origin {
    domain_name = aws_s3_bucket.data.bucket_domain_name
    origin_id   = "S3-data.ohlasy.info"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-data.ohlasy.info"

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
    acm_certificate_arn      = aws_acm_certificate_validation.data-ohlasy-info.certificate_arn
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
  }
}

# DNS record for the distribution
resource "aws_route53_record" "data-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "data.ohlasy.info"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.data-ohlasy-info.domain_name
    zone_id                = aws_cloudfront_distribution.data-ohlasy-info.hosted_zone_id
    evaluate_target_health = false
  }
}

# SSL cert
resource "aws_acm_certificate" "data-ohlasy-info" {
  provider          = aws.us-east-1
  domain_name       = "data.ohlasy.info"
  validation_method = "DNS"
}

# DNS cert validation record
resource "aws_route53_record" "validation-data-ohlasy-info" {
  for_each = {
    for dvo in aws_acm_certificate.data-ohlasy-info.domain_validation_options : dvo.domain_name => {
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
resource "aws_acm_certificate_validation" "data-ohlasy-info" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.data-ohlasy-info.arn
  validation_record_fqdns = [for record in aws_route53_record.validation-data-ohlasy-info : record.fqdn]
}
