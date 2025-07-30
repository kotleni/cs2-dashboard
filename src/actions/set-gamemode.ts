'use server';

import {RCONService} from '@/services/rcon-service';

const HOST = 'kotleni.pp.ua';
const PORT = 27015;
const PASSWORD = 'password1K';

export async function setGameMode(gamemodeName: string): Promise<string> {
    console.log('set gamemode to ' + gamemodeName);
    const rconService = new RCONService(HOST, PORT, PASSWORD);
    await rconService.connect();
    const result = await rconService.exec('game_alias ' + gamemodeName);
    await rconService.exec('say Changing gamemode...');
    await rconService.exec('changelevel de_mirage'); // TODO
    await rconService.disconnect();
    return result;
}
