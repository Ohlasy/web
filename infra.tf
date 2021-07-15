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

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

resource "aws_s3_bucket" "data" {
  bucket = "data.ohlasy.info"
  acl    = "public-read"
  website {
    index_document = "index.html"
  }
}

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
