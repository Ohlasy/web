function renderAd(ad) {
  const link = document.createElement("a");
  const img = document.createElement("img");

  link.href = ad.url;
  img.src = ad.image;
  img.className = "img-responsive";
  img.alt = ad.alt || "";

  link.append(img);

  return link;
}

function compareAds(a, b) {
  var ap = a.priority || 0;
  var bp = b.priority || 0;
  if (ap > bp) {
    return -1;
  } else if (bp > ap) {
    return +1;
  } else {
    return Math.random() > 0.5 ? -1 : 1;
  }
}

function isValidAd(ad) {
  return ad && ad.image;
}

async function loadAds() {
  try {
    const response = await fetch("/api/bannery");
    const adList = await response.json();
    var list = adList.filter(isValidAd).sort(compareAds);
    // Repeat the ads if there’s not enough of them to fill the page
    list = list.concat(list);
    for (const container of document.getElementsByClassName("box")) {
      var ad = list.shift();
      container.append(renderAd(ad));
    }
  } catch (err) {
    console.error(err);
  }
}

loadAds();
