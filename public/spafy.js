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

      Array.from(d.links)
        .filter(
          (link) =>
            link.hostname === location.hostname &&
            !link.hash &&
            !link.hasAttribute("download") &&
            link.target !== "_blank"
        )
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

      const constructPage = () => {
        d.documentElement.animate(
          {
            opacity: [1, 0],
          },
          1000
        );
        fetch(location.href)
          .then((res) => res.text())
          .then((html) => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            d.documentElement.replaceWith(doc.documentElement);
            for (const script of d.scripts) {
              const newScript = document.createElement("script");
              newScript.textContent = script.textContent;
              for (const attr of script.attributes) {
                newScript.setAttribute(attr.name, attr.value);
              }
              script.replaceWith(newScript);
            }
            d.documentElement.animate(
              {
                opacity: [0, 1],
              },
              1000
            );
          });
      };

      w.addEventListener("popstate", () => {
        constructPage();
      });

      w.navigate = (href) => {
        if (location.href !== href && location.pathname !== href) {
          history.pushState({}, d.title, href);
          constructPage();
        }
      };

      w.prefetch = (href) => {
        if (!d.querySelector('link[href="' + href + '"]')) {
          const link = d.createElement("link");
          link.href = href;
          link.rel = "prefetch";
          link.setAttribute("onload", "console.log('prefetched')");
          d.head.appendChild(link);
        }
      };
    },
    { timeout: 2000 }
  );
})(this, this.document);
