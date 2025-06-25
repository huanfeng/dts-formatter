'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { languages, commands, ExtensionContext, window } from 'vscode';
import { DtsFormatterProvider } from './DtsFormatterProvider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	console.log("ACTIVATE");
	let provider = languages.registerDocumentFormattingEditProvider('devicetree', new DtsFormatterProvider());
	let command = commands.registerCommand('dts-formatter.format', () => {
		const editor = window.activeTextEditor;
		if (editor) {
			commands.executeCommand('editor.action.formatDocument');
		} else {
			window.showWarningMessage('Open a DTS file to format');
		}
	});
	context.subscriptions.push(provider, command);
}

export function deactivate() {
}