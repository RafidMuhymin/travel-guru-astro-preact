import { h } from "preact";

export default function App() {
  ((w, d) => {
    requestIdleCallback(
      () => {
        w.observedHrefs || (w.observedHrefs = []);
        w.fetchedHrefs || (w.fetchedHrefs = []);
        let prefetchTimeoutIDArray = [];

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, i) => {
              entry.isIntersecting
                ? (prefetchTimeoutIDArray[i] = setTimeout(() => {
                    prefetch(entry.target.href);
                  }, 500))
                : clearTimeout(prefetchTimeoutIDArray[i]);
            });
          },
          { threshold: 0.25 }
        );

        document
          .querySelectorAll('a:not([download])[href^="/"')
          .forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
              if (!w.event.ctrlKey) {
                e.preventDefault();
                navigate(anchor.href);
              }
            });

            if (
              observedHrefs.includes(anchor.href) ||
              navigator.connection.saveData
            ) {
              return;
            }
            observedHrefs.push(anchor.href);
            observer.observe(anchor);

            const fetchHTML = (href) => {
              if (fetchedHrefs.includes(href)) {
                return;
              }
              fetchedHrefs.push(href);
              fetch(href);
            };
            anchor.addEventListener("mouseover", () => {
              fetchHTML(anchor.href);
            });
            anchor.addEventListener("touchstart", () => {
              fetchHTML(anchor.href);
            });
          });

        w.navigate = (href) => {
          if (location.href !== href && location.pathname !== href) {
            fetch(href)
              .then((res) => res.text())
              .then((html) => {
                const doc = new DOMParser().parseFromString(html, "text/html");
                d.documentElement.replaceWith(doc.documentElement);
                for (const script of d.scripts) {
                  new Function(script.textContent)();
                }
                history.pushState({}, d.title, href);
              });
          }
        };

        w.prefetch = (href) => {
          if (!d.querySelector('link[href="' + href + '"]')) {
            const link = d.createElement("link");
            link.href = href;
            link.rel = "prefetch";
            d.head.appendChild(link);
          }
        };
      },
      { timeout: 2000 }
    );
  })(this, this.document);
  return <h1>Hello World!</h1>;
}
