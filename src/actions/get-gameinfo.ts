'use server';

import {RCONService} from '@/services/rcon-service';

const HOST = 'kotleni.pp.ua';
const PORT = 27015;
const PASSWORD = 'password1K';

export interface GameInfo {
    gameType: number;
    gameMode: number;
}

// Usage: game_alias deathmatch|competitive|...
//       current game_type=0 game_mode=1

export async function getGameInfo(): Promise<GameInfo> {
    const rconService = new RCONService(HOST, PORT, PASSWORD);
    await rconService.connect();
    const result = await rconService.exec('game_alias');
    await rconService.disconnect();
    const lines = result.split('\n');
    const parts = lines[1].trim().split(' ');
    const gameType = parseInt(parts[1].replace('game_type=', ''));
    const gameMode = parseInt(parts[2].replace('game_mode=', ''));
    return {gameType, gameMode};
}
