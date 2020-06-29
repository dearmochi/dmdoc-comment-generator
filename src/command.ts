"use strict";

import * as vscode from 'vscode';

export default class CommentProcCommand implements vscode.Command {
    title = "Generate proc documentation";
    command = "dmdoc-comment-generator.genProcDoc";
}