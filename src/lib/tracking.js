if (
    typeof dataLayer === "undefined" ||
    typeof dataLayer.push === "undefined"
) {
    var dataLayer = {
        push: (cfg) => {
            console.log("%c tracking:" + cfg.action, "font-size:1rem;font-weight:bold")
            console.table(cfg)
        }
    }
}