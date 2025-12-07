import * as vscode from 'vscode';
import * as path from 'path';
import { executeScript } from '../utils/scripts';
import { checkDockerRunning, checkContainersRunning, startContainers } from '../utils/docker';
import { Distribution } from '../types/distro';
import { getConfig, getWorkspaceRoot } from '../utils/config';

let outputChannel: vscode.OutputChannel | undefined;

export function getOutputChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('DistroLab');
    }
    return outputChannel;
}

export async function compileRun(distribution?: Distribution): Promise<void> {
    const channel = getOutputChannel();
    channel.show(true);
    channel.clear();

    // Check Docker
    if (!(await checkDockerRunning())) {
        vscode.window.showErrorMessage('Docker is not running. Please start Docker Desktop.');
        return;
    }

    // Check containers
    if (!(await checkContainersRunning())) {
        const start = await vscode.window.showWarningMessage(
            'Docker containers are not running. Start them now?',
            'Yes',
            'No'
        );
        if (start === 'Yes') {
            await startContainers();
        } else {
            return;
        }
    }

    // Get active file
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active file to compile');
        return;
    }

    const filePath = activeEditor.document.uri.fsPath;
    const root = getWorkspaceRoot();
    
    if (!root) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    // Get relative path from workspace root
    const relativePath = path.relative(root, filePath);
    
    // Determine distribution
    const distro = distribution || getConfig().defaultDistro;

    channel.appendLine(`Compiling and running: ${relativePath}`);
    channel.appendLine(`Distribution: ${distro}`);
    channel.appendLine('');

    // Execute compile-and-run script
    const result = await executeScript('compile-and-run.sh', [distro, relativePath], channel);

    if (result.success) {
        vscode.window.showInformationMessage(`Successfully compiled and ran in ${distro}`);
    } else {
        vscode.window.showErrorMessage(`Failed to compile/run in ${distro}. Check output for details.`);
    }
}

export async function compileRunDistro(): Promise<void> {
    const { DISTRIBUTIONS } = await import('../types/distro');
    const distro = await vscode.window.showQuickPick(DISTRIBUTIONS, {
        placeHolder: 'Select Linux distribution'
    });

    if (distro) {
        await compileRun(distro as Distribution);
    }
}

export async function testAll(): Promise<void> {
    const channel = getOutputChannel();
    channel.show(true);
    channel.clear();

    // Check Docker
    if (!(await checkDockerRunning())) {
        vscode.window.showErrorMessage('Docker is not running. Please start Docker Desktop.');
        return;
    }

    // Check containers
    if (!(await checkContainersRunning())) {
        const start = await vscode.window.showWarningMessage(
            'Docker containers are not running. Start them now?',
            'Yes',
            'No'
        );
        if (start === 'Yes') {
            await startContainers();
        } else {
            return;
        }
    }

    // Get active file
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active file to test');
        return;
    }

    const filePath = activeEditor.document.uri.fsPath;
    const root = getWorkspaceRoot();
    
    if (!root) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const relativePath = path.relative(root, filePath);

    channel.appendLine(`Testing across all distributions: ${relativePath}`);
    channel.appendLine('');

    // Execute run-all-distros script
    const result = await executeScript('run-all-distros.sh', ['--compile', relativePath], channel);

    if (result.success) {
        vscode.window.showInformationMessage('Testing completed across all distributions');
    } else {
        vscode.window.showWarningMessage('Some distributions failed. Check output for details.');
    }
}

