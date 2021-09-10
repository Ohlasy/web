
# Web

resource "aws_route53_record" "ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "ohlasy.info"
  type    = "A"
  ttl     = "300"
  records = ["76.76.21.21"]
}

resource "aws_route53_record" "archiv-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "archiv.ohlasy.info"
  type    = "CNAME"
  ttl     = "300"
  records = ["cname.vercel-dns.com"]
}

resource "aws_route53_record" "auth-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "auth.ohlasy.info"
  type    = "CNAME"
  ttl     = "300"
  records = ["cname.vercel-dns.com"]
}

resource "aws_route53_record" "forum-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "forum.ohlasy.info"
  type    = "A"
  ttl     = "300"
  records = ["104.248.131.208"]
}

resource "aws_route53_record" "wiki-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "wiki.ohlasy.info"
  type    = "CNAME"
  ttl     = "300"
  records = ["cname.vercel-dns.com"]
}

resource "aws_route53_record" "www-ohlasy-info" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "www.ohlasy.info"
  type    = "CNAME"
  ttl     = "300"
  records = ["cname.vercel-dns.com"]
}

# GitHub

resource "aws_route53_record" "ohlasy-info-github" {
  zone_id = aws_route53_zone.ohlasy-info.zone_id
  name    = "_github-challenge-ohlasy.ohlasy.info"
  type    = "TXT"
  ttl     = "300"
  records = ["b136a895da"]
}
