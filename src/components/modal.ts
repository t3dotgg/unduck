export function Modal(props: { title: string; children: string }) {
  return `
    <dialog id="modal">
      <h1>${props.title}</h1>
      <div>${props.children}</div>
      <form method="dialog">
        <button>Close</button>
      </form>
    </dialog>
  `;
}

export function openModal(content: string) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      ${content}
    </div>
  `;
  document.body.appendChild(modal);

  const dialog = modal.querySelector<HTMLDialogElement>("#modal");
  if (dialog) {
    dialog.showModal();
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  modal.querySelector("button")?.addEventListener("click", () => {
    modal.remove();
  });
}
