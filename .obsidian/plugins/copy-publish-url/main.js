const { Plugin, Notice } = require("obsidian");

const BASE_URL = "https://p5yduckQiu.github.io/psyduck-life";
const CONTENT_PREFIX = "生活/";

module.exports = class CopyPublishUrlPlugin extends Plugin {
  async onload() {
    // 命令：Ctrl/Cmd+P 可调用，也可绑快捷键
    this.addCommand({
      id: "copy-publish-url",
      name: "复制当前笔记的发布链接",
      checkCallback: (checking) => {
        const url = this.buildUrl();
        if (url) {
          if (!checking) this.copyUrl(url);
          return true;
        }
        return false;
      },
    });

    // 按钮：左侧 Ribbon 的链接图标
    this.addRibbonIcon("link", "复制当前笔记的发布链接", () => {
      const url = this.buildUrl();
      if (url) {
        this.copyUrl(url);
      } else {
        new Notice("当前笔记不在「生活」发布范围内");
      }
    });
  }

  // 返回当前笔记的发布 URL，不在发布范围则返回 null
  buildUrl() {
    const file = this.app.workspace.getActiveFile();
    if (!file || !file.path.startsWith(CONTENT_PREFIX)) return null;
    let rel = file.path.slice(CONTENT_PREFIX.length);
    rel = rel.replace(/\.md$/, "");
    rel = rel.split(" ").join("-");
    // 逐段百分号编码，避免链接里出现汉字等非 ASCII 字符
    const encoded = rel.split("/").map(encodeURIComponent).join("/");
    return `${BASE_URL}/${encoded}`;
  }

  async copyUrl(url) {
    let copied = false;

    // 桌面端走异步剪贴板 API；移动端常不可用，失败则降级
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch (e) {
        copied = false;
      }
    }

    if (!copied) {
      copied = this.fallbackCopy(url);
    }

    if (copied) {
      new Notice(`已复制发布链接：${url}`);
    } else {
      new Notice("复制失败，请手动复制：" + url);
    }
  }

  // 移动端 / WKWebView 降级：临时 textarea + execCommand
  fallbackCopy(text) {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(el);
    return ok;
  }
};