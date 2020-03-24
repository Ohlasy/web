// https://support.google.com/analytics/answer/1136920
// https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
function trackLink(link, category, action, label) {
  try {
    ga("send", "event", category, action, label);
  } catch (err) {
    console.error(err);
  }
  setTimeout(function() {
    document.location.href = link.href;
  }, 100);
  return false;
}

function renderAd(ad) {
  const link = document.createElement("a");
  link.href = ad.url;

  if (ad.name) {
    link.onclick = function(event) {
      event.preventDefault();
      trackLink(this, "reklama", "klik", ad.name);
    };
  }

  const img = document.createElement("img");
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
    const response = await fetch("/api/ads.js");
    const adList = await response.json();
    var list = adList.filter(isValidAd).sort(compareAds);
    // Repeat the ads if there’s not enough of them to fill the page
    list = list.concat(list);
    for (const container of document.getElementsByClassName("box")) {
      // Insert ad
      var ad = list.shift();
      container.append(renderAd(ad));
      // Log ad view
      if (ad.name) {
        try {
          ga("send", "event", "reklama", "zobrazení", ad.name);
        } catch (err) {
          console.error(err);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

loadAds();
