document.addEventListener("DOMContentLoaded", function(){
  var toggle = document.getElementById("scheme-toggle");
  
  // Exit early if no theme toggle exists (we removed dark mode)
  if (!toggle) {
    return;
  }

  var scheme = "light";
  var savedScheme = localStorage.getItem("scheme");

  var container = document.getElementsByTagName("html")[0];
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (prefersDark) {
    scheme = "dark";
  }

  if(savedScheme) {
    scheme = savedScheme;
  }

  if(scheme == "dark") {
    darkscheme(toggle, container);
  } else {
    lightscheme(toggle, container);
  }

  toggle.addEventListener("click", () => {
    if (toggle.className === "light") {
      darkscheme(toggle, container);
    } else if (toggle.className === "dark") {
      lightscheme(toggle, container);
    }
  });
});

function darkscheme(toggle, container) {
  localStorage.setItem("scheme", "dark");
  // Use fallback text if feather is not available
  toggle.innerHTML = (typeof feather !== 'undefined' && feather.icons.sun) ? feather.icons.sun.toSvg() : '☀️';
  toggle.className = "dark";
  container.className = "dark";
}

function lightscheme(toggle, container) {
  localStorage.setItem("scheme", "light");
  // Use fallback text if feather is not available  
  toggle.innerHTML = (typeof feather !== 'undefined' && feather.icons.moon) ? feather.icons.moon.toSvg() : '🌙';
  toggle.className = "light";
  container.className = "";
}