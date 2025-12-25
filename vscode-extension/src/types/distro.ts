export const DISTRIBUTIONS = [
    'ubuntu',
    'ubuntu-latest',
    'debian',
    'fedora',
    'alpine',
    'archlinux',
    'centos',
    'opensuse-leap',
    'opensuse-tumbleweed',
    'rocky-linux',
    'almalinux',
    'oraclelinux',
    'amazonlinux',
    'gentoo',
    'kali-linux'
] as const;

export type Distribution = typeof DISTRIBUTIONS[number];

export interface DistroLabConfig {
    defaultDistro: Distribution;
    autoSetup: boolean;
}

