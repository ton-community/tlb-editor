import { Address } from "ton-core";
import { TLBCode } from "./src/ast";
import { TypescriptGenerator } from "./src/generators/typescript/generator";
import { toBase64 } from "./src/generators/x";
import { fromBase64 } from "./src/generators/y";
import { generateCodeWithGenerator } from "./src/main";
import { loadAddressUser, loadInsideAddressUser, loadParamAndTypedArgUser, loadSimple, loadTwoMaybes, loadTwoSimples, loadTypedArgUser, storeAddressUser, storeInsideAddressUser, storeParamAndTypedArgUser, storeSimple, storeTwoMaybes, storeTwoSimples, storeTypedArgUser } from "./test/generated_files/generated_test";


function convertViceVersa(typeName: string, tlbCode: TLBCode, json: any, storeFunction: any, loadFunction: any) {
    let base64 = toBase64(typeName, tlbCode, json, storeFunction)
    let new_json = fromBase64(base64, loadFunction);
    // console.log(new_json)
    return new_json;
}

function f() {
    let x: any = undefined;
    let getGenerator = (tlbCode: TLBCode) => {
        x = new TypescriptGenerator(tlbCode);
        return x;
    }

    generateCodeWithGenerator('test/tlb/test.tlb', 'kek.txt', getGenerator)

    if (x) {
        let tlbCode = x.tlbCode;
        [
            convertViceVersa('Simple', tlbCode, {
                kind: 'Simple',
                a: 0,
                b: 0,
            }, storeSimple, loadSimple),
            convertViceVersa('TypedArgUser', tlbCode, {
                kind: 'TypedArgUser',
                x: {
                    kind: 'TypedArg',
                    arg: {
                        kind: 'Simple',
                        a: 1,
                        b: 0,
                    },
                }
            }, storeTypedArgUser, loadTypedArgUser),
            convertViceVersa('TwoSimples', tlbCode, {
                kind: 'TwoSimples',
                x: {
                    kind: 'Simple',
                    a: 0,
                    b: 0,
                },
                y: {
                    kind: 'Simple',
                    a: 0,
                    b: 0,
                }
            }, storeTwoSimples, loadTwoSimples),
            convertViceVersa('TwoMaybes', tlbCode, {
                kind: 'TwoMaybes',
                one_maybe: {
                    kind: 'Maybe_nothing',
                },
                second_maybe: {
                    kind: 'Maybe_nothing',
                },
            }, storeTwoMaybes, loadTwoMaybes),
            convertViceVersa('ParamAndTypedArgUser', tlbCode, {
                kind: 'ParamAndTypedArgUser',
                x: {
                    kind: 'ParamAndTypedArg',
                    n: 5,
                    arg: {
                        kind: 'Simple',
                        a: 0,
                        b: 0,
                    },
                    c: 0,
                },
            }, storeParamAndTypedArgUser, loadParamAndTypedArgUser),
            convertViceVersa('AddressUser', tlbCode, {
                kind: 'AddressUser',
                src: '0:0000000000000000000000000000000000000000000000000000000000000000',
            }, storeAddressUser, loadAddressUser),
            convertViceVersa('InsideAddressUser', tlbCode, {
                kind: 'InsideAddressUser',
                inside: {
                    kind: 'AddressUser',
                    src: '0:0000000000000000000000000000000000000000000000000000000000000000',
                },
            }, storeInsideAddressUser, loadInsideAddressUser),
        ].forEach(y => { console.log(y) });
    }
}

f();