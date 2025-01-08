import fs from 'fs'
import { sync as globSync } from 'glob'
import csv from 'async-csv'
import YAML from 'yaml'

export const getJson = (path) => JSON.parse(fs.readFileSync(path))

export const collectJsons = (glob_path) => {
    const files = globSync(glob_path)
    return files.map(getJson)
}

export const getYaml = (path) => YAML.parse(fs.readFileSync(path, 'utf8'))

export const collectYamls = (glob_path) => {
    const files = glob.sync(glob_path)
    return files.map(getYaml)
}

export const getText = (path) => fs.readFileSync(path, 'utf8')

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