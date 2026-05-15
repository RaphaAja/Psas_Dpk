const pages =
  document.querySelectorAll(".page");

function showPage(pageId) {

  pages.forEach(page => {
    page.classList.remove("active");
  });

  const targetPage =
    document.getElementById(pageId);

  if (targetPage) {
    targetPage.classList.add("active");
  }
}

window.onload = () => {

  setTimeout(() => {

    showPage("loginPage");

  }, 2000);

};