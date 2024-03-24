const cssPromises = {};

function loadResource(src) {
  //Делаем проверку на тип файла, который загружаем

  if (src.endsWith(".js")) {
    return import(src);
  }

  if (src.endsWith(".css")) {
    if (!cssPromises[src]) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = src;
      cssPromises[src] = new Promise((resolve) => {
        link.addEventListener("load", () => resolve());
      });
      document.head.append(link);
    }
    return cssPromises[src];
  }

  //Если не js и не css то загружаем просто данные которые скорее всего будут с сервера

  return fetch(src).then((res) => res.json());
}

const appContainer = document.getElementById("app");
let searchParams = new URLSearchParams(location.search);
let episodeId = searchParams.get("episodeNum");

function renderPage(modulName, apiUrl, css) {
  Promise.all([modulName, apiUrl, css].map((src) => loadResource(src)))
    .then(([pageModule, data]) => {
      let planets = data.planets;
      let species = data.species;

      if (planets && species) {
        const planetsArr = Promise.all(planets.map((src) => loadResource(src)));

        const speciesArr = Promise.all(species.map((src) => loadResource(src)));

        Promise.all([planetsArr, speciesArr])
          .then(([planets, species]) => {
            appContainer.innerHTML = "";
            appContainer.append(pageModule.render(data, planets, species));
          })
          .then((loaded) => {
            checkUrl();
          });
        return;
      }
      appContainer.innerHTML = "";
      appContainer.append(pageModule.render(data));
    })
    .then((loaded) => {
      checkUrl();
    });
}

function checkUrl() {
  let btns = document.querySelectorAll(".go-link");
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState(null, "", btn.href);
      searchParams = new URLSearchParams(location.search);
      episodeId = searchParams.get("episodeNum");

      checkId(episodeId);
    });
  });
}

function checkId(id) {
  if (id) {
    renderPage(
      "./product-details.js",
      `https://swapi.dev/api/films/${episodeId}`,
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    );
  } else {
    renderPage(
      "./product-list.js",
      "https://swapi.dev/api/films/",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    );
  }
}

checkId(episodeId);

window.addEventListener("popstate", () => {
  console.log("gnomignomi");
  searchParams = new URLSearchParams(location.search);
  episodeId = searchParams.get("episodeNum");
  checkId(episodeId);
});
