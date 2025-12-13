import * as vscode from 'vscode';
import * as path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { getConfig, getWorkspaceRoot } from './config';
import { Distribution } from '../types/distro';

const execAsync = promisify(exec);

// Strip ANSI color codes from string
function stripAnsiCodes(str: string): string {
    // Remove all ANSI escape sequences including color codes and other control sequences
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '').replace(/\x1B\][^\x07]*\x07/g, '');
}

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
        // Handle undefined stdout/stderr properties with fallback values (like in setup.ts)
        const errorStdout = error.stdout || '';
        const errorStderr = error.stderr || '';
        const errorMessage = error.message || '';
        
        // Build error output: stdout, then stderr, then message if no stdout/stderr
        let errorOutput = errorStdout;
        if (errorStderr) {
            errorOutput += (errorOutput ? '\n' : '') + errorStderr;
        }
        if (!errorOutput && errorMessage) {
            errorOutput = errorMessage;
        }
        if (!errorOutput) {
            errorOutput = 'Unknown error occurred';
        }
        
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

// Execute script with real-time streaming output and progress callback
export async function executeScriptStream(
    scriptName: string,
    args: string[],
    outputChannel: vscode.OutputChannel,
    onProgress?: (line: string) => void
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

    outputChannel.appendLine(`Executing: ${scriptPath} ${args.join(' ')}`);
    outputChannel.appendLine('');

    return new Promise<{ success: boolean; output: string }>((resolve) => {
        let output = '';
        let errorOutput = '';
        let exitCode = 0;
        let stdoutBuffer = '';
        let stderrBuffer = '';

        // Environment setup for unbuffered output (cross-platform)
        const env = {
            ...process.env,
            PYTHONUNBUFFERED: '1',
            TERM: 'dumb', // Disable color output from scripts
            // Force unbuffered output in bash
            BASH_ENV: '',
        };

        // Direct spawn without script command (works on all platforms)
        const childProcess = spawn(scriptPath, args, {
            cwd: root,
            shell: true, // Use shell for proper bash execution
            stdio: ['ignore', 'pipe', 'pipe'],
            env: env
        });

        // Process complete lines from buffer
        const processLines = (buffer: string, isStderr: boolean): string => {
            const lines = buffer.split('\n');
            const remaining = lines.pop() || ''; // Last incomplete line
            
            for (const line of lines) {
                if (line.trim()) {
                    const cleanLine = stripAnsiCodes(line);
                    outputChannel.append(cleanLine + '\n');
                    
                    // Call progress callback immediately for each complete line
                    if (onProgress) {
                        onProgress(cleanLine);
                    }
                }
            }
            
            // Also check remaining buffer for progress patterns (might be incomplete line)
            if (remaining && onProgress) {
                const cleanRemaining = stripAnsiCodes(remaining);
                // Check if it contains progress indicators (like [1/15])
                if (cleanRemaining.match(/\[\d+\/\d+\]/)) {
                    onProgress(cleanRemaining);
                }
            }
            
            return remaining;
        };

        // Handle stdout with proper line buffering
        childProcess.stdout?.on('data', (data: Buffer) => {
            const text = data.toString();
            output += text;
            stdoutBuffer += text;
            
            // Process complete lines
            stdoutBuffer = processLines(stdoutBuffer, false);
        });

        // Handle stderr with proper line buffering
        childProcess.stderr?.on('data', (data: Buffer) => {
            const text = data.toString();
            errorOutput += text;
            stderrBuffer += text;
            
            // Process complete lines
            stderrBuffer = processLines(stderrBuffer, true);
        });

        // Handle process completion - process any remaining buffered lines
        childProcess.on('close', (code) => {
            exitCode = code || 0;
            
            // Process any remaining buffered lines
            if (stdoutBuffer.trim()) {
                const cleanLine = stripAnsiCodes(stdoutBuffer);
                outputChannel.append(cleanLine);
                if (onProgress) {
                    onProgress(cleanLine);
                }
            }
            if (stderrBuffer.trim()) {
                const cleanLine = stripAnsiCodes(stderrBuffer);
                outputChannel.append(cleanLine);
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

        // Handle errors
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
