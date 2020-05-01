import { Question } from '../model/Question';
import { SortFunction } from '../util/SortFunctions';

export class QuestionFormatter {
    private sortedAnswers: string[] = [];
    public pages: string[] = [];

    constructor(
        private question: Question,
        private pageLength: number,
        private includeTitleInEveryPage = false,
        private sortFn: SortFunction = (a, b) => a.length - b.length
    ) {
        this.initializeAnswers();
        this.initializePages();
    }

    private initializeAnswers(): void {
        this.sortedAnswers = this.question.answers.map(a => a.trim()).filter(a => a.length > 0);

        this.sortedAnswers.sort(this.sortFn);
    }

    private initializePages(): void {
        let firstPage = true;
        let nextPage = '';
        let i = 1;

        while (this.sortedAnswers.length > 0) {
            if (nextPage.length === 0 && (firstPage || this.includeTitleInEveryPage)) {
                // Print question as page header
                nextPage += '*Q: ' + this.question.question.trim() + '*\n';
                firstPage = false;
            }

            nextPage += '\n*' + i++ + ':* ' + this.sortedAnswers.shift();

            if (nextPage.length >= this.pageLength) {
                this.pages.push(nextPage);
                nextPage = '';
            }
        }

        if (nextPage.trim().length >= 0) {
            this.pages.push(nextPage);
        }
    }
}
