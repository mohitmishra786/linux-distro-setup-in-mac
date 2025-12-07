import * as vscode from 'vscode';
import { DISTRIBUTIONS, Distribution } from '../types/distro';

let statusBarItem: vscode.StatusBarItem | undefined;

export function createStatusBarItem(): vscode.StatusBarItem {
    if (!statusBarItem) {
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.command = 'distrolab.selectDistro';
        statusBarItem.tooltip = 'Click to select default Linux distribution';
    }
    updateStatusBar();
    return statusBarItem;
}

function updateStatusBar(): void {
    if (!statusBarItem) {
        return;
    }
    const config = vscode.workspace.getConfiguration('distrolab');
    const distro = config.get<string>('defaultDistro', 'ubuntu');
    statusBarItem.text = `$(server) ${distro}`;
    statusBarItem.show();
}

export async function selectDistro(): Promise<void> {
    const distro = await vscode.window.showQuickPick(DISTRIBUTIONS, {
        placeHolder: 'Select default Linux distribution',
        canPickMany: false
    });

    if (distro) {
        const config = vscode.workspace.getConfiguration('distrolab');
        await config.update('defaultDistro', distro, vscode.ConfigurationTarget.Workspace);
        updateStatusBar();
        vscode.window.showInformationMessage(`Default distribution set to: ${distro}`);
    }
}

export function dispose(): void {
    if (statusBarItem) {
        statusBarItem.dispose();
        statusBarItem = undefined;
    }
}

