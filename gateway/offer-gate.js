(function () {
  if (typeof window.tpayMaySeeOffer === "function" && window.tpayMaySeeOffer()) return;
  var home = typeof tpayPath === "function" ? tpayPath("/") : "/";
  window.location.replace(home);
})();