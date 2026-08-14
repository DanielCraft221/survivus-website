(() => {
  "use strict";

  const copyButtons = document.querySelectorAll("[data-copy]");
  const year = document.querySelector("#year");
  const buttonTimers = new WeakMap();
  const statusTimers = new WeakMap();

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const showStatus = (status, message, isError = false) => {
    if (!status) return;

    window.clearTimeout(statusTimers.get(status));
    status.textContent = message;
    status.classList.toggle("is-error", isError);

    statusTimers.set(
      status,
      window.setTimeout(() => {
        status.textContent = "";
        status.classList.remove("is-error");
      }, 4000),
    );
  };

  const copyWithFallback = (text) => {
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

  const copyText = async (text) => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Some browsers expose the Clipboard API on non-secure pages but reject it.
      }
    }

    copyWithFallback(text);
  };

  copyButtons.forEach((copyButton) => {
    const initialLabel = copyButton.getAttribute("aria-label");
    const statusId = copyButton.dataset.copyStatus || "copy-status";
    const status = document.getElementById(statusId);

    copyButton.addEventListener("click", async () => {
      const text = copyButton.dataset.copy;
      if (!text) return;

      try {
        await copyText(text);
        window.clearTimeout(buttonTimers.get(copyButton));
        copyButton.classList.add("is-copied");
        copyButton.setAttribute("aria-label", `${text} copiado`);
        showStatus(status, `${text} copiado.`);

        buttonTimers.set(
          copyButton,
          window.setTimeout(() => {
            copyButton.classList.remove("is-copied");
            if (initialLabel)
              copyButton.setAttribute("aria-label", initialLabel);
          }, 2200),
        );
      } catch {
        showStatus(
          status,
          "Não foi possível copiar. Selecione o valor e copie manualmente.",
          true,
        );
      }
    });
  });
})();
