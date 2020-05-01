import md5 from 'md5';

type SortFunctionName = 'length' | 'hash' | 'alphanum' | 'none';
export type SortFunction = (a: string, b: string) => number;

export class SortFunctions {
    public static readonly sortFunctionNames: SortFunctionName[] = ['length', 'hash', 'alphanum', 'none'];

    public static getSortFunction(name: SortFunctionName): SortFunction {
        switch (name) {
            case 'length':
                return (a, b) => a.length - b.length;
            case 'hash':
                return (a, b) => md5(a).localeCompare(md5(b));
            case 'alphanum':
                return (a, b) => a.localeCompare(b);
            case 'none':
                return () => 0;
        }
    }
}
