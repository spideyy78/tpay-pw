(function () {
  var KEY = "tpay_ad_query";

  function adQueryFromSearch(search) {
    var p = new URLSearchParams(search || "");
    if (p.has("fbclid")) return search || "";
    if (p.get("utm_source") === "ig" && p.has("utm_campaign")) return search || "";
    if (p.get("utm_medium") === "paid" && p.has("utm_source")) return search || "";
    return "";
  }

  var fromUrl = adQueryFromSearch(window.location.search);
  if (fromUrl) {
    try {
      sessionStorage.setItem(KEY, fromUrl.replace(/^\?/, ""));
    } catch (e) {}
  }

  window.tpayStoredQuery = function () {
    try {
      var s = sessionStorage.getItem(KEY);
      return s ? "?" + s : "";
    } catch (e) {
      return "";
    }
  };

  window.tpayHasAdParams = function () {
    return !!(adQueryFromSearch(window.location.search) || tpayStoredQuery());
  };
})();