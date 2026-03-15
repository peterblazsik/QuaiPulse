try {
  var t = JSON.parse(localStorage.getItem("quaipulse-ui") || "{}");
  if (t.state && t.state.theme) {
    document.documentElement.setAttribute("data-theme", t.state.theme);
  }
} catch (e) {}
