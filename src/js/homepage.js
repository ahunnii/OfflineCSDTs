let url;
window.onload = () => {
  const currentCategory = checkCurrentHomepageCategory();

  if (currentCategory == "/cultures/") {
    $("section.activeSection")
      .removeClass("activeSection")
      .attr("hidden", true);
    $("section#cultureTools").addClass("activeSection").attr("hidden", false);
    $("button.btn-primary")
      .addClass("btn-secondary")
      .removeClass("btn-primary");
    $("button#cultureBtn").addClass("btn-primary").removeClass("btn-secondary");
    return;
  }

  if (currentCategory == "/math/") {
    $("section.activeSection")
      .removeClass("activeSection")
      .attr("hidden", true);
    $("section#mathTools").addClass("activeSection").attr("hidden", false);
    $("button.btn-primary")
      .addClass("btn-secondary")
      .removeClass("btn-primary");
    $("button#mathBtn").addClass("btn-primary").removeClass("btn-secondary");
    return;
  }

  if (currentCategory == "/biology/") {
    $("section.activeSection")
      .removeClass("activeSection")
      .attr("hidden", true);
    $("section#biologyTools").addClass("activeSection").attr("hidden", false);
    $("button.btn-primary")
      .addClass("btn-secondary")
      .removeClass("btn-primary");
    $("button#biologyBtn").addClass("btn-primary").removeClass("btn-secondary");

    return;
  }

  $("section.activeSection").removeClass("activeSection").attr("hidden", true);
  $("section#computingTools").addClass("activeSection").attr("hidden", false);
  $("button.btn-primary").addClass("btn-secondary").removeClass("btn-primary");
  $("button#computingBtn").addClass("btn-primary").removeClass("btn-secondary");
};

function checkCurrentHomepageCategory() {
  url = new URL(window.location);
  const urlParams = window.location.pathname;
  return urlParams == "/" ? null : urlParams;
}

$("#computingBtn").on("click", function () {
  $("button.btn-primary").addClass("btn-secondary").removeClass("btn-primary");
  $("button#computingBtn").addClass("btn-primary").removeClass("btn-secondary");
  $("section.activeSection").removeClass("activeSection").attr("hidden", true);
  $("section#computingTools").addClass("activeSection").attr("hidden", false);
  //url.searchParams.set('category', 'computing');
  window.history.pushState({}, "", "/computing/");
});
$("#cultureBtn").on("click", function () {
  $("button.btn-primary").addClass("btn-secondary").removeClass("btn-primary");
  $("button#cultureBtn").addClass("btn-primary").removeClass("btn-secondary");
  $("section.activeSection").removeClass("activeSection").attr("hidden", true);
  $("section#cultureTools").addClass("activeSection").attr("hidden", false);
  //url.searchParams.set('category', 'culture');
  window.history.pushState({}, "", "/cultures/");
});
$("#mathBtn").on("click", function () {
  $("button.btn-primary").addClass("btn-secondary").removeClass("btn-primary");
  $("button#mathBtn").addClass("btn-primary").removeClass("btn-secondary");
  $("section.activeSection").removeClass("activeSection").attr("hidden", true);
  $("section#mathTools").addClass("activeSection").attr("hidden", false);
  //url.searchParams.set('category', 'math');
  window.history.pushState({}, "", "/math/");
});
$("#biologyBtn").on("click", function () {
  $("button.btn-primary").addClass("btn-secondary").removeClass("btn-primary");
  $("button#biologyBtn").addClass("btn-primary").removeClass("btn-secondary");
  $("section.activeSection").removeClass("activeSection").attr("hidden", true);
  $("section#biologyTools").addClass("activeSection").attr("hidden", false);
  // url.searchParams.set('category', 'biology');
  window.history.pushState({}, "", "/biology/");
});

let comingSoon = [];
