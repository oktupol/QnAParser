import chalk from 'chalk';

export class Util {
    public static parseMarkdown(input: string): string {
        return input.replace(/(_|\*|~)(\S.*\S)(\1)/g, (match, ...groups) => {
            const modifier = groups[0];
            const content = groups[1];

            switch (modifier) {
                case '*':
                    return chalk.bold(content);
                case '_':
                    return chalk.italic(content);
                case '~':
                    return chalk.strikethrough(content);
                default:
                    return match;
            }
        });
    }

    public static errorIfNull(variable: string | null, errorMessage: string): variable is string {
        this.errorIf(variable === null, errorMessage);
        return true;
    }

    public static errorIf(condition: boolean, errorMessage: string): void {
        if (condition) {
            console.error(chalk.white.bgRed(errorMessage));
            process.exit(1);
        }
    }
}
