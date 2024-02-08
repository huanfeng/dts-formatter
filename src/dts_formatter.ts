import {
    DocumentFormattingEditProvider,
    TextDocument, CancellationToken,
    ProviderResult, TextEdit, window, workspace,
    FormattingOptions, Range, Position
} from 'vscode';

import { DtsFormatterPy } from './format_script';

export class DtsFormatter implements DocumentFormattingEditProvider {
    private document: TextDocument;
    private script: DtsFormatterPy = new DtsFormatterPy();

    provideDocumentFormattingEdits(document: TextDocument,
        options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {
        
        // Retrieve all text in document
        let text = document.getText();
        this.document = document;

        if (text.length == 0) {
            window.showWarningMessage("There is no text to format");
            return [];
        }

        // Get the tabsize before each format attempt, to 
        // ensure using the updated value
        let config = workspace.getConfiguration('dts_formatter');
        let tab_size = config.get<number>('tab_size');
        let tab_char = config.get<string>('tab_char');

        return this.script.format(text, tab_char, tab_size).then(() => {
            // Replace the entire document content with the formatted text
            const range = new Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );
            return [TextEdit.replace(range, this.script.data)];
        }).catch(error => {
            window.showWarningMessage("Couldn't format the document: " + error);
            return [];
        });
    }
}
