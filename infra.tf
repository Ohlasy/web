#
# General Config
#

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
  backend "s3" {
    bucket = "ohlasy-terraform-state"
    key    = "terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-central-1"
}

# We use the us-east-1 region to store SSL certificates
# (It’s the only region certs can be stored in.)
provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

#
# Data Storage / data.ohlasy.info
#
# This is where we store “attachments” or large files we need a nice public URL to.
# It’s an S3 bucket behind a CloudFront distribution.
#

resource "aws_s3_bucket" "data" {
  bucket = "data.ohlasy.info"
  acl    = "public-read"
  website {
    index_document = "index.html"
  }
}

resource "aws_acm_certificate" "data-ohlasy-info" {
  provider          = aws.us-east-1
  domain_name       = "data.ohlasy.info"
  validation_method = "DNS"
}

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
    acm_certificate_arn      = aws_acm_certificate.data-ohlasy-info.arn
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
  }
}

#
# Master image store / i.ohlasy.info
#
# This is where we store image “masters”, ie. full-resolution photos. An S3 bucket behind
# a CloudFront distribution. Most of the time we don’t refer to these images directly, but
# through a rescaling service (see below) that creates appropriate lower-resolution images.
#

resource "aws_s3_bucket" "img" {
  bucket = "i.ohlasy.info"
  acl    = "public-read"
  website {
    index_document = "index.html"
  }
}

resource "aws_acm_certificate" "i-ohlasy-info" {
  provider          = aws.us-east-1
  domain_name       = "i.ohlasy.info"
  validation_method = "DNS"
}

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

#
# Low-res image cache
#

resource "aws_acm_certificate" "nahledy-ohlasy-info" {
  provider          = aws.us-east-1
  domain_name       = "nahledy.ohlasy.info"
  validation_method = "DNS"
}

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
