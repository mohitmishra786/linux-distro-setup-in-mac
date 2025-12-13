import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { checkDockerRunning, startContainers } from '../utils/docker';
import { getOutputChannel } from './compileRun';

export async function setupDistributions(): Promise<void> {
    const channel = getOutputChannel();
    channel.show(true);
    channel.clear();

    // Check Docker
    if (!(await checkDockerRunning())) {
        vscode.window.showErrorMessage('Docker is not running. Please start Docker Desktop.');
        return;
    }

    // Start containers if not running
    await startContainers();

    const proceed = await vscode.window.showWarningMessage(
        'This will install build tools in all distributions. This may take several minutes. Continue?',
        'Yes',
        'No'
    );

    if (proceed !== 'Yes') {
        return;
    }

    channel.appendLine('Setting up all distributions...');
    channel.appendLine('This may take several minutes...');
    channel.appendLine('');

    // Execute setup script via Makefile with progress tracking
    const root = require('../utils/config').getWorkspaceRoot();
    if (!root) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    // Show progress with real-time streaming
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Setting up distributions',
        cancellable: false
    }, async (progress) => {
        progress.report({ increment: 0, message: 'Starting setup...' });

        try {
            channel.appendLine('Running: make setup');
            
            // Execute make setup directly with real-time streaming
            return new Promise<void>((resolve) => {
                const childProcess = spawn('make', ['setup'], { cwd: root, shell: true });
                let currentDistro = 0;

                childProcess.stdout?.on('data', (data: Buffer) => {
                    const text = data.toString();
                    // Strip ANSI codes and append to channel
                    const cleanText = text.replace(/\x1b\[[0-9;]*m/g, '');
                    channel.append(cleanText);
                    
                    // Parse progress in real-time
                    const lines = cleanText.split('\n');
                    for (const line of lines) {
                        const match = line.match(/\[(\d+)\/(\d+)\]\s+Setting up\s+(\S+)/);
                        if (match) {
                            const current = parseInt(match[1]);
                            const total = parseInt(match[2]);
                            const distro = match[3];
                            
                            const increment = ((current - currentDistro) / total) * 100;
                            progress.report({
                                increment: increment,
                                message: `[${current}/${total}] Setting up ${distro}...`
                            });
                            currentDistro = current;
                        }
                    }
                });

                childProcess.stderr?.on('data', (data: Buffer) => {
                    const text = data.toString();
                    const cleanText = text.replace(/\x1b\[[0-9;]*m/g, '');
                    channel.append(cleanText);
                });

                childProcess.on('close', (code: number) => {
                    progress.report({ increment: 100, message: 'Setup complete' });
                    if (code === 0) {
                        vscode.window.showInformationMessage('Setup completed successfully');
                    } else {
                        vscode.window.showWarningMessage('Setup completed with some warnings. Check output for details.');
                    }
                    resolve();
                });
            });
        } catch (error: any) {
            channel.append(error.stdout || '');
            channel.append('\n' + (error.stderr || ''));
            vscode.window.showWarningMessage('Setup completed with some warnings. Check output for details.');
        }
    });
}

