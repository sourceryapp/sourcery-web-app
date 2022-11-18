function sortByTimePropertyAsc (a, b) {
    if (!a.time || !b.time) {
        return 0
    }

    if (a.time > b.time) {
        return 1
    }

    if (a.time < b.time) {
        return -1
    }

    return 0
}

function sortByTimePropertyDesc (a, b) {
    if (!a.time || !b.time) {
        return 0
    }

    if (a.time > b.time) {
        return -1
    }

    if (a.time < b.time) {
        return 1
    }

    return 0
}

function sortGroupedByProp (objs, prop) {
    let items = []

    const ref = {}
    objs.forEach((x) => {
        if (!ref[x[prop]]) {
            ref[x[prop]] = [x]
        } else {
            ref[x[prop]].push(x)
        }
    })

    const ks = Object.keys(ref)
    ks.forEach((k) => {
        items = items.concat(ref[k])
    })

    return items
}

export default ({ app }, inject) => {
    const sourcerySorts = (() => {
        return {
            sortByTimePropertyAsc,
            sortByTimePropertyDesc,
            sortGroupedByProp
        }
    })()

    inject('sourcerySorts', sourcerySorts)
}

export {
    sortByTimePropertyAsc,
    sortByTimePropertyDesc,
    sortGroupedByProp
}
