import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { getBundledPath } from './config';

// Strip ANSI color codes from string
function stripAnsiCodes(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '').replace(/\x1B\][^\x07]*\x07/g, '');
}

/**
 * Copies a file from anywhere to the bundled code directory and returns the relative path
 */
export function prepareSourceFile(sourceFilePath: string): string {
    const bundledPath = getBundledPath();
    const codeDir = path.join(bundledPath, 'code');
    
    // Ensure code directory exists
    if (!fs.existsSync(codeDir)) {
        fs.mkdirSync(codeDir, { recursive: true });
    }
    
    // Get just the filename
    const fileName = path.basename(sourceFilePath);
    const destPath = path.join(codeDir, fileName);
    
    // Copy the file
    fs.copyFileSync(sourceFilePath, destPath);
    
    // Return relative path from bundled directory
    return `code/${fileName}`;
}

/**
 * Execute script with real-time streaming output and show actual program output
 */
export async function executeScriptStream(
    scriptName: string,
    args: string[],
    outputChannel: vscode.OutputChannel,
    onProgress?: (line: string) => void
): Promise<{ success: boolean; output: string }> {
    const bundledPath = getBundledPath();
    const scriptsPath = path.join(bundledPath, 'scripts');
    const scriptPath = path.join(scriptsPath, scriptName);

    outputChannel.appendLine(`Executing: ${scriptPath} ${args.join(' ')}`);
    outputChannel.appendLine('');

    return new Promise<{ success: boolean; output: string }>((resolve) => {
        let output = '';
        let errorOutput = '';
        let exitCode = 0;
        let stdoutBuffer = '';
        let stderrBuffer = '';
        let inOutputSection = false;

        const env = {
            ...process.env,
            PYTHONUNBUFFERED: '1',
            TERM: 'dumb',
            BASH_ENV: '',
        };

        const childProcess = spawn(scriptPath, args, {
            cwd: bundledPath,
            shell: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: env
        });

        // Process complete lines from buffer
        const processLines = (buffer: string, isStderr: boolean): string => {
            const lines = buffer.split('\n');
            const remaining = lines.pop() || '';
            
            for (const line of lines) {
                const cleanLine = stripAnsiCodes(line);
                
                // Check if we're entering the output section
                if (cleanLine.includes('[4/4] Running')) {
                    inOutputSection = true;
                    outputChannel.append(cleanLine + '\n');
                    if (onProgress) {
                        onProgress(cleanLine);
                    }
                    continue;
                }
                
                // Check if we're at the end marker
                if (cleanLine.includes('[OK] Execution complete') || 
                    cleanLine.includes('[FAIL]')) {
                    inOutputSection = false;
                    outputChannel.append(cleanLine + '\n');
                    if (onProgress) {
                        onProgress(cleanLine);
                    }
                    continue;
                }
                
                // If in output section, show everything
                if (inOutputSection) {
                    outputChannel.append(cleanLine + '\n');
                } else if (line.trim()) {
                    // Otherwise, only show if not empty
                    outputChannel.append(cleanLine + '\n');
                    if (onProgress) {
                        onProgress(cleanLine);
                    }
                }
            }
            
            // Check remaining buffer for progress patterns
            if (remaining && onProgress && !inOutputSection) {
                const cleanRemaining = stripAnsiCodes(remaining);
                if (cleanRemaining.match(/\[\d+\/\d+\]/)) {
                    onProgress(cleanRemaining);
                }
            }
            
            return remaining;
        };

        childProcess.stdout?.on('data', (data: Buffer) => {
            const text = data.toString();
            output += text;
            stdoutBuffer += text;
            stdoutBuffer = processLines(stdoutBuffer, false);
        });

        childProcess.stderr?.on('data', (data: Buffer) => {
            const text = data.toString();
            errorOutput += text;
            stderrBuffer += text;
            stderrBuffer = processLines(stderrBuffer, true);
        });

        childProcess.on('close', (code) => {
            exitCode = code || 0;
            
            // Process any remaining buffered lines
            if (stdoutBuffer.trim()) {
                const cleanLine = stripAnsiCodes(stdoutBuffer);
                outputChannel.append(cleanLine + '\n');
                if (onProgress) {
                    onProgress(cleanLine);
                }
            }
            if (stderrBuffer.trim()) {
                const cleanLine = stripAnsiCodes(stderrBuffer);
                outputChannel.append(cleanLine + '\n');
                if (onProgress) {
                    onProgress(cleanLine);
                }
            }
            
            const fullOutput = output + (errorOutput ? '\n' + errorOutput : '');
            resolve({
                success: exitCode === 0,
                output: fullOutput
            });
        });

        childProcess.on('error', (error) => {
            const errorMsg = error.message || 'Unknown error';
            outputChannel.append(errorMsg);
            resolve({
                success: false,
                output: errorMsg
            });
        });
    });
}
