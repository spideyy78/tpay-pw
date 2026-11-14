(function () {
  if (window.location.search || !window.TPAY_DEFAULT_QUERY) return;
  window.location.replace(window.location.pathname + window.TPAY_DEFAULT_QUERY);
})();