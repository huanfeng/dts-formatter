'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DtsFormatter } from './dts_formatter';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let provider = vscode.languages.registerDocumentFormattingEditProvider('dts', new DtsFormatter());
	let command = vscode.commands.registerCommand('dts-formatter.format', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.document.languageId == 'dts') {
			vscode.commands.executeCommand('editor.action.formatDocument');
		} else {
			vscode.window.showWarningMessage('Open a DTS file to format');
		}
	});
	context.subscriptions.push(provider);
	context.subscriptions.push(command);
}

export function deactivate() {
}