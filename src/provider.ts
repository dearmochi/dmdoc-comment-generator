"use strict";

import * as vscode from 'vscode';
import * as commaSeparatedTokens from 'comma-separated-tokens';
import CommentProcCommand from './command';

const regexProc: RegExp = /(\w+)?\/proc\/(\w+)\((.+)?\)/;

export default class DMDocCommentGeneratorActionProvider implements vscode.CodeActionProvider {
    private commentProcCommand: CommentProcCommand = new CommentProcCommand();

    constructor(context: vscode.ExtensionContext) {
        const commentProcDisposable: vscode.Disposable = vscode.commands.registerCommand(this.commentProcCommand.command, this.generateProcDocumentation);
        context.subscriptions.push(commentProcDisposable);
    }

    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        const selectedLine: vscode.TextLine = document.lineAt(range.start.line);
        const result: Array<string> | null = regexProc.exec(selectedLine.text);
        if (result === null) {
            return;
        }
        
        const commentProcAction: vscode.CodeAction = new vscode.CodeAction(this.commentProcCommand.title, vscode.CodeActionKind.QuickFix);
        commentProcAction.command = this.commentProcCommand;

        return [commentProcAction];
    }

    private generateProcDocumentation() {
        const document: vscode.TextDocument = vscode.window.activeTextEditor!.document!;
        const selection: vscode.Selection = vscode.window.activeTextEditor!.selection!;
        const selectedLine: vscode.TextLine = document.lineAt(selection.start.line);
        const result: Array<string> | null = regexProc.exec(selectedLine.text);
        if (result === null) {
            vscode.window.showErrorMessage("The cursor must be on a line containing a proc definition");
            return;
        }

        const args: string[] = result.length === 4 ? commaSeparatedTokens.parse(result[3]) : [];
        const lineStart: vscode.Position = new vscode.Position(selection.start.line, 0);
        const lineBefore: vscode.TextLine | null = selection.start.line > 0 ? document.lineAt(selection.start.line - 1) : null;
        const lineBeforeText: string | undefined = lineBefore?.text;
        const shortDesc: string = lineBeforeText ? lineBeforeText.substr(2).replace(/^\/+|\/+$/, "").trim() :"Short description of the proc";
        const hasShortDesc: boolean = lineBeforeText !== undefined && lineBeforeText.startsWith("//");

        // The comment we'll put
        let comment = "/**\n";
            comment += "  * " + shortDesc + "\n";
            comment += "  *\n";
            comment += "  * Longer detailed paragraph about the proc\n";
            comment += "  * including any relevant detail\n";
        if (args.length > 0) {
            comment += "  * Arguments:\n";
        }

        args.forEach((arg: string, index: number) => {
            const argName: string = arg.split("=")[0].split("/").pop()!.split(" as ")[0].trim();
            comment += "  * * " + argName + " - Argument " + (index + 1) + "\n";
        });

        comment += "  */\n";

        // Do the edit and select the short desc
        vscode.window.activeTextEditor!.edit((editBuilder: vscode.TextEditorEdit) => {
            // Get rid of the short comment that was before this proc
            if (hasShortDesc) {
                editBuilder.delete(lineBefore!.rangeIncludingLineBreak);
            }
            editBuilder.insert(lineStart, comment);
        }).then((value: boolean) => {
            if (vscode.window.activeTextEditor) {
                const newSelection = hasShortDesc ? 
                                        new vscode.Selection(lineStart.line + 2, 4, lineStart.line + 3, 33) : 
                                        new vscode.Selection(lineStart.line + 1, 4, lineStart.line + 1, 33);
                vscode.window.activeTextEditor.selection = newSelection;
            }
            return true;
        }, (reason: any) => {
            vscode.window.showErrorMessage("Failed to generate proc documentation: " + reason);
            return false;
        });
    }
}