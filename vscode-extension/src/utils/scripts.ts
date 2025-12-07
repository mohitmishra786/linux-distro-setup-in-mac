import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getConfig, getWorkspaceRoot } from './config';
import { Distribution } from '../types/distro';

const execAsync = promisify(exec);

export async function executeScript(
    scriptName: string,
    args: string[],
    outputChannel: vscode.OutputChannel
): Promise<{ success: boolean; output: string }> {
    const config = getConfig();
    const root = getWorkspaceRoot();
    
    if (!root) {
        throw new Error('No workspace folder open');
    }

    const scriptsPath = config.scriptsPath.startsWith('/')
        ? config.scriptsPath
        : path.join(root, config.scriptsPath);

    const scriptPath = path.join(scriptsPath, scriptName);
    const command = `"${scriptPath}" ${args.map(arg => `"${arg}"`).join(' ')}`;

    outputChannel.appendLine(`Executing: ${command}`);
    outputChannel.appendLine('');

    try {
        const { stdout, stderr } = await execAsync(command, {
            cwd: root,
            maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        });

        const output = stdout + (stderr ? '\n' + stderr : '');
        outputChannel.append(output);
        return { success: true, output };
    } catch (error: any) {
        const errorOutput = error.stdout + '\n' + error.stderr;
        outputChannel.append(errorOutput);
        return { success: false, output: errorOutput };
    }
}

export function getScriptPath(scriptName: string): string {
    const config = getConfig();
    const root = getWorkspaceRoot() || '';
    const scriptsPath = config.scriptsPath.startsWith('/')
        ? config.scriptsPath
        : path.join(root, config.scriptsPath);
    return path.join(scriptsPath, scriptName);
}

export function isScriptExecutable(scriptPath: string): boolean {
    try {
        const fs = require('fs');
        const stats = fs.statSync(scriptPath);
        // Check if file exists and is executable (Unix) or just exists (Windows)
        return stats.isFile();
    } catch {
        return false;
    }
}

