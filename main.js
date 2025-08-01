import "./style.css";
const btnLight = document.getElementById("btnLight");
const btnDark = document.getElementById("btnDark");

btnDark.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.add("dark");
});

btnLight.addEventListener("click", (e) => {
  e.preventDefault();

  document.body.classList.remove("dark");
});
