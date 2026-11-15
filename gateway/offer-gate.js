(function () {
  if (typeof window.tpayHasFbclid === "function" && window.tpayHasFbclid()) {
    var q = window.location.search;
    if (!q && typeof window.tpayStoredQuery === "function") {
      q = window.tpayStoredQuery();
      if (q) {
        window.location.replace(window.location.pathname + q);
      }
    }
    return;
  }
  var home = typeof tpayPath === "function" ? tpayPath("/") : "/";
  var qs = typeof window.tpayStoredQuery === "function" ? window.tpayStoredQuery() : "";
  window.location.replace(home + (qs ? qs.replace(/^\?/, "?") : ""));
})();