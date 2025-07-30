'use server';

import {RCONService} from '@/services/rcon-service';

const HOST = 'kotleni.pp.ua';
const PORT = 27015;
const PASSWORD = 'password1K';

async function getMapName(rconService: RCONService) {
    const result = await rconService.exec('status');
    const secondPart = result.split('spawngroup(  1)  : SV:  [1: ')[1];
    return secondPart.split(' ')[0];
}

export async function setGameMode(gamemodeName: string): Promise<string> {
    console.log('set gamemode to ' + gamemodeName);
    const rconService = new RCONService(HOST, PORT, PASSWORD);
    await rconService.connect();
    const result = await rconService.exec('game_alias ' + gamemodeName);
    await rconService.exec('say Changing gamemode...');
    const mapName = await getMapName(rconService);
    console.log('preserved map ' + mapName);
    await rconService.exec('changelevel ' + mapName);
    await rconService.disconnect();
    return result;
}
