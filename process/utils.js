import fs from 'fs'
import { glob } from 'glob'
import csv from 'async-csv'

export const getJson = (path) => JSON.parse(fs.readFileSync(path))

export const collectJsons = (glob_path) => {
    const files = glob.sync(glob_path)
    return files.map(getJson)
}

export const getCsv = async (path) => {
    const string = fs.readFileSync(path, 'utf-8')
    return csv.parse(string, {
        bom: true,
        columns: true,
        relax_column_count: true,
    })
}

export const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 4), function (err) {
        if (err) throw err;
        console.log('    JSON written to', path);
    });
}

