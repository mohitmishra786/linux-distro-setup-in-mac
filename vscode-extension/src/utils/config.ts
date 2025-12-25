import * as vscode from 'vscode';
import * as path from 'path';
import { DistroLabConfig, Distribution } from '../types/distro';

export function getConfig(): DistroLabConfig {
    const config = vscode.workspace.getConfiguration('distrolab');
    return {
        defaultDistro: config.get<Distribution>('defaultDistro', 'ubuntu'),
        autoSetup: config.get<boolean>('autoSetup', true)
    };
}

/**
 * Get the extension's installation directory
 */
export function getExtensionPath(): string {
    const ext = vscode.extensions.getExtension('mohitmishra.distrolab');
    if (!ext) {
        throw new Error('DistroLab extension not found');
    }
    return ext.extensionPath;
}

/**
 * Get the bundled resources directory
 */
export function getBundledPath(): string {
    return path.join(getExtensionPath(), 'bundled');
}

/**
 * Get the workspace root (where user's files are)
 */
export function getWorkspaceRoot(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return undefined;
    }
    return workspaceFolders[0].uri.fsPath;
}
