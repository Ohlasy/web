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
# DNS
#

resource "aws_route53_zone" "ohlasy-info" {
  name          = "ohlasy.info"
  comment       = "Managed by Terraform"
  force_destroy = false
}

resource "aws_route53_record" "ohlasy-info-NS" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "ohlasy.info"
  type    = "NS"
  ttl     = "172800"
  records = ["ns-406.awsdns-50.com.", "ns-1477.awsdns-56.org.", "ns-613.awsdns-12.net.", "ns-1911.awsdns-46.co.uk."]
}

resource "aws_route53_record" "ohlasy-info-SOA" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "ohlasy.info"
  type    = "SOA"
  ttl     = "900"
  records = [
    "ns-406.awsdns-50.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
  ]
}

