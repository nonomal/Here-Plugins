const os = require("os")
const _ = require("underscore")

function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0K';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '' + sizes[i];
}

function netUsage() {
    // console.debug("netUsage")
    os.netStat()
    .then((json) => {
        console.verbose(json)

        const deltain = formatBytes(Number(json["deltain"])) + '/s'
        const deltaout = formatBytes(Number(json["deltaout"])) + '/s'
        const totalin = json["totalin_string"]

        // Menu Bar
        here.menuBar.set({
            title: {
                text: deltaout.padStart(6, " ") + "⇡",
                useMonospaceFont: true
            },
            detail: {
                text: deltain.padStart(6, " ") + "⇣",
                useMonospaceFont: true
            }
        })

        // Mini Window
        here.miniWindow.set({
            title: "Network Speed",
            detail: "Total Download: " + totalin,
            accessory: {
                title: "⇣" + deltain,
                detail: "⇡" + deltaout
            }
        })

        // Dock
        here.dock.set({
            title: "⇣" + deltain,
            detail: "⇡" + deltaout
        })
    })
    .catch((error) => {
        console.error(JSON.stringify(error))
        here.miniWindow.set({ title: JSON.stringify(error) })
    })
}


here.onLoad(() => {
    netUsage()
    setInterval(netUsage, 3000)
})