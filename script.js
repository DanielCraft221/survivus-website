(() => {
  "use strict";

  const container = document.querySelector(".social-container");
  if (!container) return;

  let botaoAberto = null;

  function colapsar(botao) {
    botao.classList.remove("expandido");
    botao.setAttribute("aria-expanded", "false");
  }

  function expandir(botao) {
    botao.classList.add("expandido");
    botao.setAttribute("aria-expanded", "true");
  }

  function fecharBotaoAberto() {
    if (botaoAberto) {
      colapsar(botaoAberto);
      botaoAberto = null;
    }
  }

  container.addEventListener("click", (event) => {
    const botao = event.target.closest(".social-btn");
    if (!botao) return;

    if (botao === botaoAberto) return;

    event.preventDefault();

    if (botaoAberto) colapsar(botaoAberto);

    expandir(botao);
    botaoAberto = botao;
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".social-btn")) {
      fecharBotaoAberto();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      fecharBotaoAberto();
    }
  });
})();
