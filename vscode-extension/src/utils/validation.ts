import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getConfig } from './config';

export interface ValidationResult {
    isValid: boolean;
    missingItems: string[];
    distroLabPath?: string;
}

/**
 * Validates that DistroLab installation path is configured and files exist
 */
export function validateDistroLabInstallation(): ValidationResult {
    const config = getConfig();
    const missingItems: string[] = [];
    
    // Get the DistroLab installation path
    const distroLabPath = config.distroLabPath;
    
    if (!distroLabPath) {
        return {
            isValid: false,
            missingItems: ['DistroLab installation path not configured'],
            distroLabPath: undefined
        };
    }

    // Check if path exists
    if (!fs.existsSync(distroLabPath)) {
        return {
            isValid: false,
            missingItems: [`DistroLab path does not exist: ${distroLabPath}`],
            distroLabPath
        };
    }

    // Check for docker-compose.yml
    const dockerComposePath = path.join(distroLabPath, 'docker-compose.yml');
    if (!fs.existsSync(dockerComposePath)) {
        missingItems.push('docker-compose.yml in DistroLab path');
    }

    // Check for Makefile
    const makefilePath = path.join(distroLabPath, 'Makefile');
    if (!fs.existsSync(makefilePath)) {
        missingItems.push('Makefile in DistroLab path');
    }

    // Check for scripts directory
    const scriptsPath = path.join(distroLabPath, 'scripts');
    if (!fs.existsSync(scriptsPath)) {
        missingItems.push('scripts directory in DistroLab path');
    }

    return {
        isValid: missingItems.length === 0,
        missingItems,
        distroLabPath
    };
}

/**
 * Shows an error message if validation fails and prompts user to configure
 * @returns true if validation passed, false otherwise
 */
export async function showValidationErrorIfNeeded(): Promise<boolean> {
    const validation = validateDistroLabInstallation();
    
    if (!validation.isValid) {
        const config = getConfig();
        
        let message: string;
        if (!config.distroLabPath) {
            message = 'DistroLab: Installation path not configured.\n\n' +
                'Please set the path to your linux-distro-setup-in-mac directory in settings.\n\n' +
                'Example: /Users/yourname/Projects/linux-distro-setup-in-mac';
        } else {
            const missing = validation.missingItems.join(', ');
            message = `DistroLab: Invalid installation path.\n\n` +
                `Path: ${config.distroLabPath}\n` +
                `Missing: ${missing}\n\n` +
                `Please verify the path points to the linux-distro-setup-in-mac directory.`;
        }
        
        const action = await vscode.window.showErrorMessage(
            message,
            'Open Settings',
            'Dismiss'
        );

        if (action === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'distrolab.distroLabPath');
        }

        return false;
    }

    return true;
}

/**
 * Attempts to auto-detect DistroLab installation path
 */
export function autoDetectDistroLabPath(): string | undefined {
    // Common locations to check
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    const possiblePaths = [
        path.join(homeDir, 'linux-distro-setup-in-mac'),
        path.join(homeDir, 'Projects', 'linux-distro-setup-in-mac'),
        path.join(homeDir, 'Desktop', 'Projects', 'linux-distro-setup-in-mac'),
        path.join(homeDir, 'Desktop', 'linux-distro-setup-in-mac'),
        path.join(homeDir, 'Documents', 'linux-distro-setup-in-mac'),
        path.join(homeDir, 'Desktop', 'Projects', 'Github', 'linux-distro-setup-in-mac'),
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p) && 
            fs.existsSync(path.join(p, 'docker-compose.yml')) &&
            fs.existsSync(path.join(p, 'Makefile')) &&
            fs.existsSync(path.join(p, 'scripts'))) {
            return p;
        }
    }

    return undefined;
}
