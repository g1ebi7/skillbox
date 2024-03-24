export function render(episode, planetsArr, speciesArr) {
  if (planetsArr) {
    const planets = planetsArr.map((item) => " " + item.name);
    const species = speciesArr.map((item) => " " + item.name);
    const container = document.createElement("div");
    container.classList.add("container", "py-4");
    container.innerHTML = `
    <a href="index.html" type="button" class="btn btn-primary mb-4 go-link">Go to the main page</a>
     <h1>${episode.title}</h1>
     <p class="lead">ID: ${episode.episode_id}</p>
     <p class="lead">${episode.opening_crawl}</p>
     <h2>Planets:</h2>
     <p class="lead">${planets}</p>
     <h2>Species:</h2>
     <p class="lead">${species}</p>

   `;
    return container;
  }
  return "";
}
