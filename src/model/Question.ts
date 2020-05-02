import { SortFunctions, SortFunction } from '../util/SortFunctions';

export class Question {
    constructor(
        public question: string,
        private _answers: string[],
        private sortFunction: SortFunction = SortFunctions.defaultSortFunction
    ) {}

    get answers(): string[] {
        const sortedAnswers = [...this._answers];
        sortedAnswers.sort(this.sortFunction);
        return sortedAnswers.map(a => a.trim()).filter(a => a.length > 0);
    }
}
