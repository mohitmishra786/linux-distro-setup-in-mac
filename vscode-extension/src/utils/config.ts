import * as vscode from 'vscode';
import * as path from 'path';
import { DistroLabConfig, Distribution } from '../types/distro';

export function getConfig(): DistroLabConfig {
    const config = vscode.workspace.getConfiguration('distrolab');
    return {
        distroLabPath: config.get<string>('distroLabPath', ''),
        dockerComposePath: config.get<string>('dockerComposePath', './docker-compose.yml'),
        scriptsPath: config.get<string>('scriptsPath', './scripts'),
        defaultDistro: config.get<Distribution>('defaultDistro', 'ubuntu'),
        autoSetup: config.get<boolean>('autoSetup', true)
    };
}

export function getWorkspaceRoot(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return undefined;
    }
    return workspaceFolders[0].uri.fsPath;
}

export function resolvePath(relativePath: string): string {
    const root = getWorkspaceRoot();
    if (!root) {
        return relativePath;
    }
    // Handle both relative and absolute paths
    if (relativePath.startsWith('/') || relativePath.match(/^[A-Z]:/)) {
        return relativePath;
    }
    return path.join(root, relativePath);
}

