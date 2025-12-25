import * as vscode from 'vscode';
import { compileRun, compileRunDistro, testAll } from './commands/compileRun';
import { setupDistributions } from './commands/setup';
import { selectDistro, createStatusBarItem, dispose as disposeStatusBar } from './commands/distroSelect';
import { startContainers, stopContainers, checkDockerRunning } from './utils/docker';

export function activate(context: vscode.ExtensionContext) {
    console.log('DistroLab extension is now active!');

    // Create status bar item
    const statusBarItem = createStatusBarItem();
    context.subscriptions.push(statusBarItem);

    // Register commands
    const commands = [
        vscode.commands.registerCommand('distrolab.compileRun', () => compileRun()),
        vscode.commands.registerCommand('distrolab.compileRunDistro', () => compileRunDistro()),
        vscode.commands.registerCommand('distrolab.testAll', () => testAll()),
        vscode.commands.registerCommand('distrolab.setup', () => setupDistributions()),
        vscode.commands.registerCommand('distrolab.selectDistro', () => selectDistro()),
        vscode.commands.registerCommand('distrolab.startContainers', () => startContainers()),
        vscode.commands.registerCommand('distrolab.stopContainers', () => stopContainers())
    ];

    commands.forEach(command => context.subscriptions.push(command));

    // Check Docker on activation
    checkDockerOnActivation();
}

async function checkDockerOnActivation(): Promise<void> {
    if (!(await checkDockerRunning())) {
        vscode.window.showWarningMessage(
            'DistroLab: Docker is not running. Please start Docker Desktop to use this extension.',
            'OK'
        );
    }
}

export function deactivate() {
    disposeStatusBar();
}
