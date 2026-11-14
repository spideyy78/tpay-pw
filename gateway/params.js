(function () {
  var KEYS = [
    "fbclid",
    "utm_medium",
    "utm_source",
    "utm_id",
    "utm_content",
    "utm_term",
    "utm_campaign"
  ];
  var qs = new URLSearchParams(window.location.search);
  var root = document.getElementById("params");
  if (!root) return;
  KEYS.forEach(function (key) {
    var val = qs.get(key);
    if (!val) return;
    var dt = document.createElement("dt");
    dt.textContent = key;
    var dd = document.createElement("dd");
    dd.textContent = val;
    root.appendChild(dt);
    root.appendChild(dd);
  });
})();