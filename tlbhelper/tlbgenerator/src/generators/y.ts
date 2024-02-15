import { Address, Cell } from "ton-core";

export function fromBase64(base64: String, loadFunction: any) {
    let cell = Cell.fromBase64(base64.toString())
    let loadedType = loadFunction(cell.beginParse());
    return typeToJson(loadedType);
}

function typeToJson(obj: any) {
    let result: any = {}
    if (obj.kind) {
        result['kind'] = obj.kind;
    }
    if (typeof obj === 'number' || typeof obj === 'bigint' || typeof obj === 'string') {
        result = obj
    } else if (obj instanceof Address) {
        result = obj.toRawString();
    } else {
        Object.keys(obj).forEach(function(key) {
            result[key] = typeToJson(obj[key]);
        });
    }
    return result;
}