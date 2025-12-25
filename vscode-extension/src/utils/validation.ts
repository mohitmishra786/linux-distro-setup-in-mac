import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getBundledPath } from './config';

export interface ValidationResult {
    isValid: boolean;
    missingItems: string[];
}

/**
 * Validates that bundled files exist in the extension
 */
export function validateBundledFiles(): ValidationResult {
    const bundledPath = getBundledPath();
    const missingItems: string[] = [];

    // Check for docker-compose.yml
    if (!fs.existsSync(path.join(bundledPath, 'docker-compose.yml'))) {
        missingItems.push('docker-compose.yml');
    }

    // Check for Makefile
    if (!fs.existsSync(path.join(bundledPath, 'Makefile'))) {
        missingItems.push('Makefile');
    }

    // Check for scripts directory
    if (!fs.existsSync(path.join(bundledPath, 'scripts'))) {
        missingItems.push('scripts directory');
    }

    return {
        isValid: missingItems.length === 0,
        missingItems
    };
}

/**
 * Shows an error message if validation fails
 * @returns true if validation passed, false otherwise
 */
export async function showValidationErrorIfNeeded(): Promise<boolean> {
    const validation = validateBundledFiles();
    
    if (!validation.isValid) {
        const missing = validation.missingItems.join(', ');
        const message = `DistroLab: Extension installation is corrupted. Missing: ${missing}.\n\n` +
            `Please reinstall the extension.`;
        
        vscode.window.showErrorMessage(message, 'OK');
        return false;
    }

    return true;
}
