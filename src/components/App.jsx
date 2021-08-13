import { h } from "preact";

export default function App() {
  requestIdleCallback(
    () => {
      let timeoutIDArray = [];
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            entry.isIntersecting
              ? (timeoutIDArray[i] = setTimeout(() => {
                  createPrefetchLink(entry.target);
                }, 500))
              : clearTimeout(timeoutIDArray[i]);
          });
        },
        { threshold: 0.25 }
      );

      document
        .querySelectorAll('a[href^="/":not([download])')
        .forEach((link) => {
          link.addEventListener("mouseover", () => {
            createPrefetchLink(link);
          });

          link.addEventListener("click", (e) => {
            if (!window.event.ctrlKey) {
              e.preventDefault();
              fetchHTML(link.href);
            }
          });
          observer.observe(link);
        });

      const fetchHTML = (href) => {
        if (location.href !== href && location.pathname !== href) {
          fetch(href)
            .then((res) => res.text())
            .then((html) => {
              const doc = new DOMParser().parseFromString(html, "text/html");
              document.documentElement.replaceWith(doc.documentElement);
              for (const script of document.scripts) {
                eval(script.innerHTML);
              }
              history.pushState({}, doc.title, href);
            });
        }
      };

      const createPrefetchLink = (element) => {
        const { href } = element;
        if (!document.querySelector('link[href="' + href + '"]')) {
          const prefetchLink = document.createElement("link");
          prefetchLink.href = href;
          prefetchLink.rel = "prefetch";
          document.head.appendChild(prefetchLink);
        }
      };
    },
    { timeout: 2000 }
  );
  return <h1>Hello World!</h1>;
}
