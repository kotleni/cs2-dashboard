import {Rcon} from 'rcon-client';

export class RCONService {
    private rcon: Rcon;

    constructor(host: string, port: number, password: string) {
        this.rcon = new Rcon({
            host,
            port,
            password,
        });
    }

    async exec(command: string): Promise<string> {
        try {
            const response = await this.rcon.send(command);
            return response;
        } catch (error) {
            console.error('Failed to send command:', error);
            throw error;
        }
    }

    async connect() {
        await this.rcon.connect();
    }

    async disconnect() {
        await this.rcon.end();
    }
}
