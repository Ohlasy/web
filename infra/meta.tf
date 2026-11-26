terraform {
  required_version = ">= 1.6.0"

  required_providers {
    bunnynet = {
      source  = "BunnyWay/bunnynet"
      version = "~> 0.20"
    }
  }

  backend "s3" {
    bucket = "ohlasy-infra-state"
    key    = "terraform.tfstate"
    region = "de"

    endpoints = {
      s3 = "https://de-s3.storage.bunnycdn.com"
    }

    use_path_style              = true
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
  }
}
