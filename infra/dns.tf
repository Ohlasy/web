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

# SPF + Google Site Verification

resource "aws_route53_record" "ohlasy-info-TXT" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "ohlasy.info"
  type    = "TXT"
  ttl     = "300"
  records = [
    "v=spf1 include:sparkpostmail.com include:spf.messagingengine.com ?all",
    "google-site-verification=PgAoSyHpGcMP8-Dd8glLopr-PlTuOeqmjK8kSf6CMc0"
  ]
}

# Ecomail

resource "aws_route53_record" "ecomail-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "ecomail._domainkey.ohlasy.info"
  type    = "TXT"
  ttl     = "300"
  records = [
    "v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0diuxLOeJJuRRu6v4Xnau70JIEEFGnkiiu6PK3i+1pGKyoLOyJFzk+Ah8zRoujJSzv95nxtDYERVpGxfgu+JXkV3ZDJucMkd/SxKIQ8pJ0Uk1MKKkUFnYgvOxW5Umq8VNpstZZfjhCRcYgb1Iw+oFabBbfShIM98yuaN7Q7KKcQIDAQAB"
  ]
}

# Fastmail

resource "aws_route53_record" "ohlasy-info-MX" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "ohlasy.info"
  type    = "MX"
  ttl     = "300"
  records = ["10 in1-smtp.messagingengine.com.", "20 in2-smtp.messagingengine.com."]
}

resource "aws_route53_record" "ohlasy-info-fastmail-1" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "fm1._domainkey.ohlasy.info"
  type    = "CNAME"
  ttl     = "300"
  records = ["fm1.ohlasy.info.dkim.fmhosted.com"]
}

resource "aws_route53_record" "ohlasy-info-fastmail-2" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "fm2._domainkey.ohlasy.info"
  type    = "CNAME"
  ttl     = "300"
  records = ["fm2.ohlasy.info.dkim.fmhosted.com"]
}

resource "aws_route53_record" "ohlasy-info-fastmail-3" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "fm3._domainkey.ohlasy.info"
  type    = "CNAME"
  ttl     = "300"
  records = ["fm3.ohlasy.info.dkim.fmhosted.com"]
}

# Web

resource "aws_route53_record" "ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "ohlasy.info"
  type    = "A"
  ttl     = "300"
  records = ["76.76.21.21"]
}

# GitHub

resource "aws_route53_record" "ohlasy-info-github" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "_github-challenge-ohlasy.ohlasy.info"
  type    = "TXT"
  ttl     = "300"
  records = ["b136a895da"]
}
