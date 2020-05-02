import fs from 'fs';
import { XmlEntities } from 'html-entities';
import { SortFunction } from './util/SortFunctions';
import { QnaParser } from './service/QnaParser';
import { Question } from './model/Question';

export class QnaPublisher {
    private parser: QnaParser;
    private encoder: XmlEntities;

    private static readonly ADDITION_MARKER = '<!-- ADDITION MARKER -->';

    constructor(private fileName: string, private outFileName: string, private sortFunction: SortFunction) {
        this.parser = new QnaParser(this.fileName, this.sortFunction);
        this.encoder = new XmlEntities();
    }

    public publish(): void {
        const sessionHtml = this.session2Html();
        let outFileContent = fs.readFileSync(this.outFileName).toString();

        outFileContent = outFileContent.replace(
            QnaPublisher.ADDITION_MARKER,
            QnaPublisher.ADDITION_MARKER + '\n\n' + sessionHtml
        );

        fs.writeFileSync(this.outFileName, outFileContent);
    }

    private session2Html(): string {
        let result = `<h2>${this.createSessionHeader()}</h2>`;

        result += '\n';
        result += this.parser.questions.map(question => this.question2Html(question)).join('\n');

        return result;
    }

    private createSessionHeader(): string {
        return new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    private question2Html(question: Question): string {
        let result = `<h3>${this.encoder.encode(question.question)}</h3>`;

        result += '<ol>';

        result += question.answers.map(answer => `<li>${this.encoder.encode(answer)}</li>`).join('\n');

        result += '</ol>';

        return result;
    }
}
