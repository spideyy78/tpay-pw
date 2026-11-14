(function () {
  var params = new URLSearchParams(window.location.search);
  if (params.get("fast") === "1") {
    params.delete("fast");
    var q = params.toString();
    var dest = typeof tpayPath === "function"
      ? tpayPath(isMobileView() ? "/offer/" : "/")
      : isMobileView() ? "/offer/" : "/";
    window.location.replace(dest + (q ? "?" + q : ""));
    return;
  }

  function isMobileView() {
    return (
      window.matchMedia &&
      window.matchMedia("(max-width: 480px)").matches
    );
  }

  var fill = document.getElementById("fill");
  if (!fill) return;
  var bar = fill.parentNode;
  var stepEl = document.getElementById("step");
  var pctEl = document.getElementById("pct");
  var elEl = document.getElementById("elapsed");
  var note = document.querySelector(".note");
  var checks = document.querySelectorAll(".check");
  var start = Date.now();
  var redirected = false;

  var messages = [
    [0, "Initializing secure channel…"],
    [3, "Negotiating TLS handshake…"],
    [7, "Verifying access policy…"],
    [12, "Probing available routes…"],
    [18, "Selecting fastest route…"],
    [25, "Route is busy, retrying…"],
    [33, "Waiting for gateway response…"],
    [45, "Still working, hang tight…"]
  ];
  var resolveAt = [9, 20, 38];
  var done = [false, false, false];
  var slowShown = false;
  var msgIdx = -1;
  var shown = 0;

  function nextPath() {
    var q = window.location.search.replace(/^\?/, "");
    var base = typeof tpayPath === "function" ? tpayPath("/offer/") : "/offer/";
    return q ? base + "?" + q : base;
  }

  function goNext() {
    if (redirected) return;
    redirected = true;
    fill.style.width = "100%";
    pctEl.textContent = "100";
    setMsg("Redirecting to your page…");
    note.textContent = "Secure route confirmed. Loading content…";
    window.setTimeout(function () {
      window.location.replace(nextPath());
    }, 600);
  }

  function setMsg(text) {
    stepEl.classList.add("swap");
    window.setTimeout(function () {
      stepEl.textContent = text;
      stepEl.classList.remove("swap");
    }, 250);
  }

  function curve(t) {
    return 96 * (1 - Math.exp(-t / 28));
  }

  function allChecksDone() {
    return done[0] && done[1] && done[2];
  }

  function frame() {
    if (redirected) return;
    var t = (Date.now() - start) / 1000;
    var p = curve(t) - (Math.sin(t * 1.3) > 0.85 ? 1.2 : 0);
    shown = Math.max(shown, Math.min(96, p));

    fill.style.width = shown.toFixed(1) + "%";
    pctEl.textContent = Math.floor(shown);
    elEl.textContent = Math.floor(t);
    bar.setAttribute("aria-valuenow", Math.floor(shown));

    for (var m = messages.length - 1; m >= 0; m--) {
      if (t >= messages[m][0]) {
        if (m !== msgIdx) {
          msgIdx = m;
          setMsg(messages[m][1]);
        }
        break;
      }
    }

    for (var c = 0; c < checks.length; c++) {
      if (!done[c] && t >= resolveAt[c]) {
        done[c] = true;
        checks[c].classList.add("done", "on");
        checks[c].querySelector("b").textContent =
          checks[c].getAttribute("data-final");
      }
    }

    if (!slowShown && t >= 30) {
      slowShown = true;
      note.classList.add("slow");
      note.textContent =
        "This is taking longer than usual. Please keep this tab open — we're still connecting.";
    }

    if (isMobileView() && allChecksDone() && t >= resolveAt[2] + 0.5) {
      goNext();
      return;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();