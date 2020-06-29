import * as vscode from 'vscode';
import DMDocCommentGeneratorActionProvider from './provider';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.languages.registerCodeActionsProvider("dm", new DMDocCommentGeneratorActionProvider(context));
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
