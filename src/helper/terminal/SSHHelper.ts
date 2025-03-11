import { Client, ConnectConfig } from 'ssh2';

export class SshHelper {
    private client: Client;
    private isConnected: boolean = false;

    constructor() {
        this.client = new Client();
    }

    /**
     * Establish SSH Connection
     * @param config - SSH connection details
     */
    public async setUpSshSession(config: ConnectConfig): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client
                .on('ready', () => {
                    console.log('SSH Connection Established');
                    this.isConnected = true;
                    resolve();
                })
                .on('error', (err) => {
                    console.error('SSH Connection Error:', err);
                    reject(err);
                })
                .connect(config);
        });
    }

    /**
     * Run Command on Remote Linux Machine
     * @param command - Command to execute
     * @returns Command output as a string
     */
    public async runCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                return reject(new Error('SSH session is not connected'));
            }

            this.client.exec(command, (err, stream) => {
                if (err) return reject(err);

                let output = '';
                stream
                    .on('close', (code:string, signal:string) => {
                        console.log(`Command execution completed. Exit code: ${code}, Signal: ${signal}`);
                        resolve(output);
                    })
                    .on('data', (data:string) => {
                        output += data.toString();
                    })
                    .stderr.on('data', (data) => {
                        console.error('Error:', data.toString());
                    });
            });
        });
    }

    /**
     * Close the SSH Connection
     */
    public closeConnection(): void {
        if (this.isConnected) {
            this.client.end();
            this.isConnected = false;
            console.log('SSH Connection Closed');
        }
    }
}

//Example code

// import { SSHHelper } from './SSHHelper';

// async function main() {
//     const sshHelper = new SSHHelper();

//     const config = {
//         host: '192.168.1.100', // Replace with your Linux device's IP
//         port: 22,              // Default SSH port
//         username: 'your-username',
//         password: 'your-password', // Use SSH keys for better security
//     };

//     try {
//         // Step 1: Establish SSH Connection
//         await sshHelper.setUpSshSession(config);

//         // Step 2: Run Commands
//         const output = await sshHelper.runCommand('ls -l');
//         console.log('Command Output:', output);

//     } catch (error) {
//         console.error('Error:', error);
//     } finally {
//         // Step 3: Close Connection
//         sshHelper.closeConnection();
//     }
// }

// main();
