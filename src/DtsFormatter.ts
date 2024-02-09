export class DtsFormatter {
	private tabStr: string;

	constructor(tabChar: string = "tab", tabSize: number = 1) {
		this.tabStr = (tabChar === "tab" ? "\t" : " ").repeat(tabSize);
	}

	format(data: string, path: string = ''): [string, boolean] {
		let output: string[] = [];
		let tab: number = 0;
		let error: boolean = false;

		data.split('\n').forEach((record, lineIndex) => {
			let line: number = lineIndex + 1;
			let tokenCommentStart: number = record.indexOf('//');
			let commentToken: string = '';

			if (tokenCommentStart !== -1) {
				commentToken = record.slice(tokenCommentStart);
				record = record.slice(0, tokenCommentStart);
			}

			let codeToken: string = record.trim();

			if (codeToken.startsWith('#if') || codeToken.startsWith('#else') || codeToken.startsWith('#endif')) {
				output.push(record + commentToken);
				return;
			}

			let openBraceTokens: number = codeToken.split('{').length - 1;
			let closeBraceTokens: number = codeToken.split('}').length - 1;
			tab -= closeBraceTokens;
			tab = Math.max(0, tab);
			output.push(this.tabStr.repeat(tab) + codeToken + commentToken);
			tab += openBraceTokens;
		});

		error = (tab !== 0);
		if (error && path) {
			console.error(`File ${path}: error: brace mismatch: ${tab}.`);
		}
		return [output.join('\n'), error];
	}
}

function main() {
	let error: boolean = false;
	let tabChar: string = "tab";
	let tabSize: number = 1;
	let args: string[] = process.argv.slice(2);

	if (args.length > 0) {
		tabChar = args[0];
	}

	if (args.length > 1) {
		tabSize = parseInt(args[1], 10);
	}

	let formatter: DtsFormatter = new DtsFormatter(tabChar, tabSize);

	// Assuming using Node.js `readline` or similar to read from stdin
	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false
	});

	let data: string = '';
	rl.on('line', (line: string) => {
		data += line + '\n';
	});

	rl.on('close', () => {
		let [result, err] = formatter.format(data);

		if (!err) {
			process.stdout.write(result);
		} else {
			error = true;
		}

		process.exit(error ? 1 : 0);
	});
}

if (require.main === module) {
	main();
}
