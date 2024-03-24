export function render(data) {
  let episodes = data.results;

  function compareNumeric(a, b) {
    let firstId = a.episode_id;
    let secondId = b.episode_id;
    if (firstId > secondId) return 1;
    if (firstId == secondId) return 0;
    if (firstId < secondId) return -1;
  }

  episodes = episodes.sort(compareNumeric);

  const container = document.createElement("div");
  container.classList.add(
    "container-sm",
    "d-flex",
    "justify-content-between",
    "flex-wrap",
    "py-4"
  );

  data.results.forEach((episode) => {
    let episodeNumber = episode.episode_id;

    if (episodeNumber <= 3) {
      episodeNumber = episodeNumber + 3;
    } else {
      episodeNumber = episodeNumber - 3;
    }

    const episodeCard = document.createElement("div");
    const image = document.createElement("img");
    const cardBody = document.createElement("div");
    const title = document.createElement("h5");
    const price = document.createElement("p");
    const detailsBtn = document.createElement("a");

    episodeCard.style.width = "40%";
    episodeCard.classList.add("card", "m-2");
    image.classList.add("card-img-top");
    cardBody.classList.add("card-body");
    title.classList.add("card-title");
    price.classList.add("card-text");
    detailsBtn.classList.add("btn", "btn-primary", "go-link");

    image.src =
      "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3RhciUyMHdhcnN8ZW58MHx8MHx8fDA%3D";
    image.alt = episode.title;
    title.textContent = episode.title;
    price.textContent = episode.price;
    detailsBtn.textContent = "Подробнее";
    detailsBtn.href = `?episodeNum=${episodeNumber}`;

    episodeCard.append(image);
    episodeCard.append(cardBody);
    cardBody.append(title);
    cardBody.append(price);
    cardBody.append(detailsBtn);

    container.append(episodeCard);
  });

  return container;
}
