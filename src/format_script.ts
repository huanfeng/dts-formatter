import { ChildProcess, spawn } from 'child-process-promise';
import { join } from 'path';
import { window } from 'vscode';

export class DtsFormatterPy {
    private formatter: ChildProcess;
    data: string;
    err: string;

    format(text: string, tab_char: string, tab_size: number): Promise<string> {
        const scriptPath = join(__dirname, "dts_formatter.py");

        // Initialize data and err
        this.data = '';
        this.err = '';

        // Spawn the Python process
        const promise = spawn(scriptPath, [tab_char, tab_size.toString()]);


        // Setup the python process
        this.formatter = promise.childProcess;
        this.formatter.stdout.on('data', (data) => this.data = data.toString());
        this.formatter.stderr.on('data', (data) => this.err = data.toString());

        // Send the text for formatting
        this.formatter.stdin.write(text);
        this.formatter.stdin.end();

        // Return a promise that resolves with the formatted data
        return promise;
    }


}

