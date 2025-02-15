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
