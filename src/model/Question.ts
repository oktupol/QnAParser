import { SortFunctions, SortFunction } from '../util/SortFunctions';

export class Question {
    constructor(
        public question: string,
        public index: number,
        private _answers: string[],
        private sortFunction: SortFunction = SortFunctions.defaultSortFunction
    ) {}

    get answers(): string[] {
        const sortedAnswers: string[] = [];

        for (const answer of this._answers) {
            if (!sortedAnswers.includes(answer)) {
                sortedAnswers.push(answer);
            }
        }

        sortedAnswers.sort(this.sortFunction);
        return sortedAnswers.map(a => a.trim()).filter(a => a.length > 0);
    }
}
