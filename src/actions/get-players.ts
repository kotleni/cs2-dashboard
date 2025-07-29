'use server';

import {RCONService} from '@/services/rcon-service';

const HOST = 'kotleni.pp.ua';
const PORT = 27015;
const PASSWORD = 'password1K';

export interface PlayerInfo {
    id: number;
    addr: string;
    name: string;
    state: string; // active, spawning
    ping: number;
    time: string;
    isBot: boolean;
}

export async function getPlayers(): Promise<PlayerInfo[]> {
    const rconService = new RCONService(HOST, PORT, PASSWORD);
    await rconService.connect();
    const result = await rconService.exec('status');
    await rconService.disconnect();

    const secondPart = result.split('---------players--------')[1];
    const lines = secondPart.split('\n');
    return lines
        .map(line => {
            const parts = line
                .trim()
                .split(' ')
                .filter(line => line.trim().length > 0);
            // id time ping loss state rate adr name
            // 2 01:16 1 0 active 786432 22.225.7.98:33228 'Telegram'
            // 65535 [NoChan] 0 0 challenging 0unknown ''
            // 7 BOT 0 0 active 0 'Strapper'
            const isValid =
                parts.length > 5 &&
                parts[1] !== '[NoChan]' &&
                parts[1] !== 'time';
            if (!isValid) return undefined;
            const isBot = parts[1] === 'BOT';

            if (isBot) {
                const playerInfo: PlayerInfo = {
                    id: parseInt(parts[0]),
                    addr: '',
                    name: parts[6].slice(1, parts[6].length - 1),
                    state: parts[4],
                    ping: 0,
                    time: '',
                    isBot: true,
                };
                return playerInfo;
            } else {
                const playerInfo: PlayerInfo = {
                    id: parseInt(parts[0]),
                    addr: parts[6],
                    name: parts[7].slice(1, parts[7].length - 1),
                    state: parts[4],
                    ping: parseInt(parts[2]),
                    time: parts[1],
                    isBot: false,
                };
                return playerInfo;
            }
        })
        .filter(playerInfo => {
            return playerInfo !== undefined;
        });
}
