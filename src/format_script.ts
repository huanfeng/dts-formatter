import { spawn } from 'child_process';
import { join } from 'path';
import { window } from 'vscode';

export class DtsFormatterPy {
	data: string;
	err: string;

	format(text: string, tab_char: string, tab_size: number): Promise<string> {
		return new Promise((resolve, reject) => {
			const scriptPath = join(__dirname, "dts_formatter.py");
			const formatter = spawn(scriptPath, [tab_char, tab_size.toString()]);

			this.data = '';
			this.err = '';

			formatter.stdout.on('data', (chunk) => {
				this.data += chunk.toString();
			});

			formatter.stderr.on('data', (chunk) => {
				this.err += chunk.toString();
			});

			formatter.on('error', (error) => {
				reject(error);
			});

			formatter.on('close', (code) => {
				if (code === 0) {
					resolve(this.data);
				} else {
					reject(new Error(this.err || `Formatter exited with code ${code}`));
				}
			});

			// Send the text for formatting
			formatter.stdin.write(text);
			formatter.stdin.end();
		});
	}
}
