const $cart = document.querySelector("#cart");

const toCurrency = (price) =>
  new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);

const toDate = (date) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));

document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});

M.Tabs.init(document.querySelector(".tabs"));

if ($cart) {
  $cart.addEventListener("click", ({ target }) => {
    const { removeId } = target.dataset;

    if (removeId) {
      fetch("/cart/remove?id=" + removeId, {
        method: "delete",
      })
        .then((result) => result.json())
        .then((cart) => {
          if (cart.courses.length) {
            const htmlCourses = cart.courses
              .map((c) => {
                return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td><span class="price">${toCurrency(c.price)}</span></td>
                  <td><button class="btn waves-effect waves-light red" data-remove-id="${
                    c.id
                  }">Удалить</button></td>
                </tr>
              `;
              })
              .join("");
            const htmPrices = `<tr class="tr-price">
                  <td colspan="2">Итого:</td>
                  <td><span class="price">${toCurrency(cart.price)}</span></td>
                  <td></td>
                </tr>`;
            $cart.querySelector("tbody").innerHTML = htmlCourses + htmPrices;
            // $cart.querySelector();
          } else {
            $cart.innerHTML =
              '<div class="card-panel red darken-1">Корзина пуста.</div>';
          }
        });
    }
  });
}
