import fs from 'fs'
import glob from 'glob'

export const getJson = (path) => JSON.parse(fs.readFileSync(path))

export const collectJsons = (glob_path) => {
    const files = glob.sync(glob_path)
    return files.map(getJson)
}

export const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 4), function (err) {
        if (err) throw err;
        console.log('    JSON written to', path);
    });
}

