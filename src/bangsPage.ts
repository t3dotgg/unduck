import "./global.css";

export function renderBangPage() {
    const app = document.querySelector<HTMLDivElement>("#app")!;
    app.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
        <div class="content-container">
          <h1>Bang Page</h1>
          <p>Welcome to the bang page!</p>
        </div>
        <footer class="footer">
          <a href="https://t3.chat" target="_blank">t3.chat</a>
          •
          <a href="https://x.com/theo" target="_blank">theo</a>
          •
          <a href="https://github.com/t3dotgg/unduck" target="_blank">github</a>
        </footer>
      </div>
    `;
  }