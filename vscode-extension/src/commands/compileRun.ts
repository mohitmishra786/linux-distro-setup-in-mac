import * as vscode from 'vscode';
import * as path from 'path';
import { executeScript, executeScriptStream } from '../utils/scripts';
import { checkDockerRunning, checkContainersRunning, startContainers, validateWorkspace } from '../utils/docker';
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
    // Validate workspace first
    const validation = validateWorkspace();
    if (!validation.valid) {
        const message = `Workspace validation failed. Missing: ${validation.missing.join(', ')}.\n\nPlease open the linux-distro-setup-in-mac project folder (the folder containing docker-compose.yml and Makefile).`;
        vscode.window.showErrorMessage(message);
        return;
    }

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

    // Execute compile-and-run script with real-time progress tracking
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Compiling and running in ${distro}`,
        cancellable: false
    }, async (progress) => {
        progress.report({ increment: 0, message: 'Starting...' });

        let lastStep = 0;
        let lastTotal = 4;

        const result = await executeScriptStream(
            'compile-and-run.sh',
            [distro, relativePath],
            channel,
            (line: string) => {
                // Match [1/4], [2/4], etc. in real-time
                const stepMatch = line.match(/\[(\d+)\/(\d+)\]\s+(.+)/);
                if (stepMatch) {
                    const step = parseInt(stepMatch[1]);
                    const total = parseInt(stepMatch[2]);
                    const message = stepMatch[3].trim();
                    lastStep = step;
                    lastTotal = total;
                    
                    const percent = (step / total) * 100;
                    progress.report({
                        increment: percent - ((lastStep - 1) * (100 / total)),
                        message: `[${step}/${total}] ${message}`
                    });
                }
            }
        );

        if (result.success) {
            progress.report({ increment: 100, message: 'Complete' });
            vscode.window.showInformationMessage(`Successfully compiled and ran in ${distro}`);
        } else {
            progress.report({ increment: 100, message: 'Failed' });
            vscode.window.showErrorMessage(`Failed to compile/run in ${distro}. Check output for details.`);
        }
    });
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
    // Validate workspace first
    const validation = validateWorkspace();
    if (!validation.valid) {
        const message = `Workspace validation failed. Missing: ${validation.missing.join(', ')}.\n\nPlease open the linux-distro-setup-in-mac project folder (the folder containing docker-compose.yml and Makefile).`;
        vscode.window.showErrorMessage(message);
        return;
    }

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

    const distributions = [
        'ubuntu', 'ubuntu-latest', 'debian', 'fedora', 'alpine', 'archlinux', 'centos',
        'opensuse-leap', 'opensuse-tumbleweed', 'rocky-linux', 'almalinux',
        'oraclelinux', 'amazonlinux', 'gentoo', 'kali-linux'
    ];
    const totalDistros = distributions.length;

    // Execute run-all-distros script with real-time progress tracking
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Testing across all distributions',
        cancellable: false
    }, async (progress) => {
        progress.report({ increment: 0, message: 'Starting tests...' });

        let currentDistro = 0;
        let successful = 0;
        let failed = 0;
        let detectedTotal = totalDistros;

        const result = await executeScriptStream(
            'run-all-distros.sh',
            ['--compile', relativePath],
            channel,
            (line: string) => {
                // Match [1/15] Testing: ubuntu in real-time
                const testMatch = line.match(/\[(\d+)\/(\d+)\]\s+Testing:\s+(\S+)/);
                if (testMatch) {
                    const current = parseInt(testMatch[1]);
                    const total = parseInt(testMatch[2]);
                    const distro = testMatch[3];
                    detectedTotal = total;
                    
                    const increment = ((current - currentDistro) / total) * 100;
                    progress.report({
                        increment: increment,
                        message: `[${current}/${total}] Testing ${distro}...`
                    });
                    currentDistro = current;
                }
                
                // Match success/failure in real-time
                if (line.includes('[OK]') || line.includes('SUCCESS')) {
                    successful++;
                }
                if (line.includes('[FAIL]') || line.includes('FAILED')) {
                    failed++;
                }
            }
        );

        const finalTotal = detectedTotal || totalDistros;
        if (result.success) {
            progress.report({ increment: 100, message: `Complete: ${successful}/${finalTotal} successful` });
            vscode.window.showInformationMessage(`Testing completed: ${successful}/${finalTotal} distributions successful`);
        } else {
            progress.report({ increment: 100, message: `Complete: ${failed} failed` });
            vscode.window.showWarningMessage(`Some distributions failed (${failed}/${finalTotal}). Check output for details.`);
        }
    });
}

