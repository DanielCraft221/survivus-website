(() => {
  "use strict";

  const copyButton = document.querySelector("[data-copy]");
  const copyStatus = document.querySelector("#copy-status");
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (!copyButton || !copyStatus) return;

  const setStatus = (message, isError = false) => {
    copyStatus.textContent = message;
    copyStatus.classList.toggle("is-error", isError);
  };

  const copyText = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) throw new Error("Copy command was not successful.");
  };

  copyButton.addEventListener("click", async () => {
    const address = copyButton.dataset.copy;
    if (!address) return;

    try {
      await copyText(address);
      copyButton.classList.add("is-copied");
      copyButton.setAttribute("aria-label", "Endereço de e-mail copiado");
      setStatus("Endereço de e-mail copiado.");

      window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        copyButton.setAttribute("aria-label", "Copiar endereço de e-mail");
      }, 2200);
    } catch {
      setStatus(
        "Não foi possível copiar o endereço. Selecione-o e copie manualmente.",
        true,
      );
    }
  });
})();
