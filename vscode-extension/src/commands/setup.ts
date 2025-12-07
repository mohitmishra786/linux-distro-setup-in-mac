import * as vscode from 'vscode';
import { executeScript } from '../utils/scripts';
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

    // Execute setup script via Makefile
    const root = require('../utils/config').getWorkspaceRoot();
    if (!root) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    try {
        channel.appendLine('Running: make setup');
        const { stdout, stderr } = await execAsync('make setup', { cwd: root });
        channel.append(stdout);
        if (stderr) {
            channel.append('\n' + stderr);
        }
        vscode.window.showInformationMessage('Setup completed successfully');
    } catch (error: any) {
        channel.append(error.stdout || '');
        channel.append('\n' + (error.stderr || ''));
        vscode.window.showWarningMessage('Setup completed with some warnings. Check output for details.');
    }
}

