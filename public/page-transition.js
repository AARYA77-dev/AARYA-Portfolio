(() => {
    const tiles = ".from-left .tile";

    // 1. Enter: reveal page by sliding tiles out to the right
    if (sessionStorage.getItem("transition")) {
        sessionStorage.removeItem("transition");
        document.documentElement.classList.remove("page-transitioning");

        gsap.fromTo(tiles, 
            { width: "100%", left: "0%" },
            {
                duration: 0.4,
                left: "100%",
                stagger: -0.05,
                ease: "power4.inOut",
                onComplete: () => gsap.set(tiles, { width: "0%", left: "0%" })
            }
        );
    }

    // 2. Exit: slide tiles in from the left on internal link click
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link || link.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return;

        const currentPath = location.pathname.replace(/\/index\.html$/, "/");
        const targetPath = url.pathname.replace(/\/index\.html$/, "/");
        if (currentPath === targetPath) return;

        e.preventDefault();
        gsap.to(tiles, {
            duration: 0.4,
            width: "100%",
            left: "0%",
            stagger: 0.05,
            ease: "power4.inOut",
            onComplete: () => {
                sessionStorage.setItem("transition", "1");
                location.href = link.href;
            }
        });
    });

    // Reset tiles if restored from browser back/forward cache
    window.addEventListener("pageshow", (e) => {
        if (e.persisted) gsap.set(tiles, { width: "0%", left: "0%" });
    });
})();
