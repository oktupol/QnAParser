export class Question {
    constructor(public question: string, private _answers: string[]) {}

    get answers(): string[] {
        return [...this._answers];
    }
}
