import { Question } from '../model/Question';

export class QuestionFormatter {
    private answers: string[] = [];
    public pages: string[] = [];

    constructor(private question: Question, private pageLength: number, private includeTitleInEveryPage = false) {
        this.initializeAnswers();
        this.initializePages();
    }

    private initializeAnswers(): void {
        this.answers = this.question.answers;
    }

    private initializePages(): void {
        let firstPage = true;
        let nextPage = '';
        let i = 1;

        while (this.answers.length > 0) {
            if (nextPage.length === 0 && (firstPage || this.includeTitleInEveryPage)) {
                // Print question as page header
                nextPage += '*Q: ' + this.question.question.trim() + '*\n';
                firstPage = false;
            }

            nextPage += '\n*' + i++ + ':* ' + this.answers.shift();

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
