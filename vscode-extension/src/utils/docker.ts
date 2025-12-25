import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getConfig } from './config';
import { showValidationErrorIfNeeded } from './validation';

const execAsync = promisify(exec);

export async function checkDockerRunning(): Promise<boolean> {
    try {
        await execAsync('docker ps');
        return true;
    } catch (error) {
        return false;
    }
}

export async function checkContainersRunning(): Promise<boolean> {
    try {
        const { stdout } = await execAsync('docker ps --format "{{.Names}}" | grep linux-book');
        return stdout.trim().length > 0;
    } catch (error) {
        return false;
    }
}

export async function startContainers(): Promise<boolean> {
    // Validate DistroLab installation first
    if (!(await showValidationErrorIfNeeded())) {
        return false;
    }

    const config = getConfig();
    const distroLabPath = config.distroLabPath;
    const dockerComposePath = path.join(distroLabPath, 'docker-compose.yml');

    try {
        vscode.window.showInformationMessage('Starting Docker containers...');
        await execAsync(`docker-compose -f "${dockerComposePath}" up -d`, { cwd: distroLabPath });
        vscode.window.showInformationMessage('Docker containers started successfully');
        return true;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to start containers: ${error.message}`);
        return false;
    }
}

export async function stopContainers(): Promise<boolean> {
    // Validate DistroLab installation first
    if (!(await showValidationErrorIfNeeded())) {
        return false;
    }

    const config = getConfig();
    const distroLabPath = config.distroLabPath;
    const dockerComposePath = path.join(distroLabPath, 'docker-compose.yml');

    try {
        vscode.window.showInformationMessage('Stopping Docker containers...');
        await execAsync(`docker-compose -f "${dockerComposePath}" stop`, { cwd: distroLabPath });
        vscode.window.showInformationMessage('Docker containers stopped');
        return true;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to stop containers: ${error.message}`);
        return false;
    }
}

