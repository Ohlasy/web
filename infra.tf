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
