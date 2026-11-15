(function () {
  if (typeof window.tpayHasFbclid === "function" && window.tpayHasFbclid()) return;
  var home = typeof tpayPath === "function" ? tpayPath("/") : "/";
  window.location.replace(home);
})();