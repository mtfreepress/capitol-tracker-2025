

export const getDistrictNumber = (key) => {
    return +key.replace('-', '').replace('SD', '').replace('HD', '')
}

export const getCorrespondingSenateDistrictNumber = (hd) => {
    if (hd === null) return null
    const number = getDistrictNumber(hd)
    return Math.ceil(number / 2)
}