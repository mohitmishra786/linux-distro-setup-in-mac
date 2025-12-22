import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getConfig, getWorkspaceRoot } from './config';

const execAsync = promisify(exec);

// Validate that required files exist in the workspace
export function validateWorkspace(): { valid: boolean; missing: string[] } {
    const root = getWorkspaceRoot();
    if (!root) {
        return { valid: false, missing: ['No workspace folder open'] };
    }

    const requiredFiles = [
        { path: 'docker-compose.yml', name: 'docker-compose.yml' },
        { path: 'Makefile', name: 'Makefile' },
        { path: 'scripts', name: 'scripts directory' }
    ];

    const missing: string[] = [];
    for (const file of requiredFiles) {
        const fullPath = path.join(root, file.path);
        if (!fs.existsSync(fullPath)) {
            missing.push(file.name);
        }
    }

    return { valid: missing.length === 0, missing };
}

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
    // Validate workspace first
    const validation = validateWorkspace();
    if (!validation.valid) {
        const message = `Workspace validation failed. Missing: ${validation.missing.join(', ')}. Please open the linux-distro-setup-in-mac project folder.`;
        vscode.window.showErrorMessage(message);
        return false;
    }

    const config = getConfig();
    const root = getWorkspaceRoot();
    if (!root) {
        vscode.window.showErrorMessage('No workspace folder open');
        return false;
    }

    const dockerComposePath = config.dockerComposePath.startsWith('/') 
        ? config.dockerComposePath 
        : path.join(root, config.dockerComposePath);

    // Double-check file exists
    if (!fs.existsSync(dockerComposePath)) {
        vscode.window.showErrorMessage(`docker-compose.yml not found at: ${dockerComposePath}. Please ensure you have opened the correct workspace folder.`);
        return false;
    }

    try {
        vscode.window.showInformationMessage('Starting Docker containers...');
        await execAsync(`docker-compose -f "${dockerComposePath}" up -d`);
        vscode.window.showInformationMessage('Docker containers started successfully');
        return true;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to start containers: ${error.message}`);
        return false;
    }
}

export async function stopContainers(): Promise<boolean> {
    const config = getConfig();
    const root = getWorkspaceRoot();
    if (!root) {
        return false;
    }

    const dockerComposePath = config.dockerComposePath.startsWith('/') 
        ? config.dockerComposePath 
        : path.join(root, config.dockerComposePath);

    try {
        vscode.window.showInformationMessage('Stopping Docker containers...');
        await execAsync(`docker-compose -f "${dockerComposePath}" stop`);
        vscode.window.showInformationMessage('Docker containers stopped');
        return true;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to stop containers: ${error.message}`);
        return false;
    }
}

