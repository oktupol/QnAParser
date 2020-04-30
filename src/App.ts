import clear from 'clear';
import chalk from 'chalk';
import clipboard from 'clipboardy';
import { QnaParser } from './service/QnaParser';
import { QuestionFormatter } from './service/QuestionFormatter';
import { Util } from './util/Util';
import { KeyboardShortcut } from './interface/KeyboardShortcut';

export class App {
    private parser: QnaParser;

    private pages: string[] = [];

    private static readonly KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
        { key: 'q', action: 'Quit' },
        { key: 'j', action: 'Next page' },
        { key: 'k', action: 'Previous page' },
        { key: 'y', action: 'Copy page into clipboard' },
        { key: 'r', action: 'Reload current page' },
        { key: 'g', action: 'Go to first page' },
        { key: 'G', action: 'Go to last page' },
    ];

    public constructor(
        private fileName: string,
        private pageLength: number,
        private pageHeaders: boolean,
        private currentPage: number,
        private copyAll: boolean,
        private markdown: boolean
    ) {
        this.parser = new QnaParser(this.fileName);
        this.init();
        this.enforcePageLimits();
    }

    private init(): void {
        this.parser.questions.forEach((q) =>
            new QuestionFormatter(q, this.pageLength, this.pageHeaders).pages
                .map((p) => p.trim())
                .filter((p) => p.length > 0)
                .forEach((p) => this.pages.push(p))
        );
    }

    private enforcePageLimits(): void {
        if (this.currentPage < 0) {
            this.currentPage = 0;
        } else if (this.currentPage >= this.pages.length) {
            this.currentPage = this.pages.length - 1;
        }
    }

    public run(): void {
        this.printPage(this.currentPage);
        this.registerKeyboardListener();
    }

    private printPage(page: number, copy = false): void {
        clear();
        console.log(chalk.blueBright(`Current page: ${page + 1}. Total page count: ${this.pages.length}`));

        if (page !== null) {
            if (page < 0 || page >= this.pages.length) {
                console.error(chalk.white.bgRed('Page number not in range'));
                process.exit(1);
            }

            console.log();

            if (this.markdown) {
                console.log(Util.parseMarkdown(this.pages[page]));
            } else {
                console.log(this.pages[page]);
            }

            console.log();

            if (copy || this.copyAll) {
                clipboard.writeSync(this.pages[page]);
                console.log(chalk.white.bgGreen('Copied to clipboard'));
            }

            App.KEYBOARD_SHORTCUTS.forEach(({ key, action }) => {
                console.log(chalk.gray.bold(key) + chalk.gray(': ' + action));
            });
        }
    }

    private registerKeyboardListener(): void {
        const stdin = process.stdin;

        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        stdin.on('data', (key) => {
            let copy = false;

            switch (key.toString()) {
                case '\u0003': // Ctrl+C
                case 'q':
                    process.exit(0);
                case 'j':
                    this.currentPage++;
                    break;
                case 'k':
                    this.currentPage--;
                    break;
                case 'g':
                    this.currentPage = 0;
                    break;
                case 'G':
                    this.currentPage = this.pages.length - 1;
                    break;
                case 'y':
                    copy = true;
                    break;
                case 'r': // reload
                    break;
                default:
                    return;
            }

            this.enforcePageLimits();

            this.printPage(this.currentPage, copy);
        });
    }
}
