import * as vscode from 'vscode';
import { compileRun, compileRunDistro, testAll } from './commands/compileRun';
import { setupDistributions } from './commands/setup';
import { selectDistro, createStatusBarItem, dispose as disposeStatusBar } from './commands/distroSelect';
import { startContainers, stopContainers } from './utils/docker';
import { autoDetectDistroLabPath, validateDistroLabInstallation } from './utils/validation';
import { getConfig } from './utils/config';

export function activate(context: vscode.ExtensionContext) {
    console.log('DistroLab extension is now active!');

    // Create status bar item
    const statusBarItem = createStatusBarItem();
    context.subscriptions.push(statusBarItem);

    // Register commands
    const commands = [
        vscode.commands.registerCommand('distrolab.compileRun', () => compileRun()),
        vscode.commands.registerCommand('distrolab.compileRunDistro', () => compileRunDistro()),
        vscode.commands.registerCommand('distrolab.testAll', () => testAll()),
        vscode.commands.registerCommand('distrolab.setup', () => setupDistributions()),
        vscode.commands.registerCommand('distrolab.selectDistro', () => selectDistro()),
        vscode.commands.registerCommand('distrolab.startContainers', () => startContainers()),
        vscode.commands.registerCommand('distrolab.stopContainers', () => stopContainers()),
        vscode.commands.registerCommand('distrolab.configurePath', () => configureDistroLabPath())
    ];

    commands.forEach(command => context.subscriptions.push(command));

    // Check and configure DistroLab path on activation
    checkDistroLabPathOnActivation();
}

async function configureDistroLabPath(): Promise<void> {
    const config = getConfig();
    const currentPath = config.distroLabPath;
    
    // Try auto-detection
    const detectedPath = autoDetectDistroLabPath();
    
    const message = detectedPath 
        ? `Found DistroLab installation at: ${detectedPath}\n\nUse this path?`
        : `Enter the full path to your linux-distro-setup-in-mac directory:`;
    
    if (detectedPath) {
        const useDetected = await vscode.window.showInformationMessage(
            message,
            'Yes',
            'Enter Manually',
            'Cancel'
        );
        
        if (useDetected === 'Yes') {
            await vscode.workspace.getConfiguration('distrolab').update(
                'distroLabPath',
                detectedPath,
                vscode.ConfigurationTarget.Global
            );
            vscode.window.showInformationMessage(`DistroLab path configured: ${detectedPath}`);
            return;
        } else if (useDetected === 'Cancel') {
            return;
        }
    }
    
    // Manual entry
    const inputPath = await vscode.window.showInputBox({
        prompt: 'Enter the full path to linux-distro-setup-in-mac directory',
        value: currentPath || '',
        placeHolder: '/Users/yourname/Projects/linux-distro-setup-in-mac'
    });
    
    if (inputPath) {
        await vscode.workspace.getConfiguration('distrolab').update(
            'distroLabPath',
            inputPath,
            vscode.ConfigurationTarget.Global
        );
        
        // Validate the path
        const validation = validateDistroLabInstallation();
        if (validation.isValid) {
            vscode.window.showInformationMessage(`DistroLab path configured successfully!`);
        } else {
            vscode.window.showWarningMessage(
                `Path configured, but validation failed: ${validation.missingItems.join(', ')}`
            );
        }
    }
}

async function checkDistroLabPathOnActivation(): Promise<void> {
    const config = getConfig();
    
    // If path not configured, try to auto-detect
    if (!config.distroLabPath) {
        const detectedPath = autoDetectDistroLabPath();
        
        if (detectedPath) {
            const action = await vscode.window.showInformationMessage(
                `DistroLab: Found installation at ${detectedPath}. Configure this path?`,
                'Yes',
                'Configure Manually',
                'Later'
            );
            
            if (action === 'Yes') {
                await vscode.workspace.getConfiguration('distrolab').update(
                    'distroLabPath',
                    detectedPath,
                    vscode.ConfigurationTarget.Global
                );
                vscode.window.showInformationMessage('DistroLab configured successfully!');
            } else if (action === 'Configure Manually') {
                vscode.commands.executeCommand('distrolab.configurePath');
            }
        } else {
            // Show configuration prompt only once per session
            const action = await vscode.window.showWarningMessage(
                'DistroLab: Installation path not configured. Please set the path to your linux-distro-setup-in-mac directory.',
                'Configure Now',
                'Later'
            );
            
            if (action === 'Configure Now') {
                vscode.commands.executeCommand('distrolab.configurePath');
            }
        }
    } else {
        // Validate existing path
        const validation = validateDistroLabInstallation();
        if (!validation.isValid) {
            vscode.window.showWarningMessage(
                `DistroLab: Invalid installation path. ${validation.missingItems.join(', ')}`,
                'Reconfigure'
            ).then(action => {
                if (action === 'Reconfigure') {
                    vscode.commands.executeCommand('distrolab.configurePath');
                }
            });
        }
    }
}

export function deactivate() {
    disposeStatusBar();
}


