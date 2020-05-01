import fs from 'fs';
import csvParse from 'csv-parse/lib/sync';
import { Question } from '../model/Question';

export class QnaParser {
    public questions: Question[] = [];

    constructor(private fileName: string) {
        this.populate();
    }

    private populate(): void {
        const qnaFile = fs.readFileSync(this.fileName);
        const rawRecords = csvParse(qnaFile, {
            delimiter: ',',
            skip_empty_lines: true,
        }) as string[][];

        // removing timestamp

        rawRecords.forEach(r => r.splice(0, 1));

        // separating questions from answers

        const questions = rawRecords[0];

        const answers = rawRecords.splice(1);

        questions.forEach(question => {
            this.questions.push(
                new Question(
                    question,
                    answers.map(a => a.shift() as string)
                )
            );
        });
    }
}
