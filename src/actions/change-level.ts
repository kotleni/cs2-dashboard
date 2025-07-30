'use server';

import {RCONService} from '@/services/rcon-service';

const HOST = 'kotleni.pp.ua';
const PORT = 27015;
const PASSWORD = 'password1K';

export async function changeLevel(levelName: string): Promise<string> {
    console.log('change level to ' + levelName);
    const rconService = new RCONService(HOST, PORT, PASSWORD);
    await rconService.connect();
    const result = await rconService.exec('changelevel ' + levelName);
    await rconService.exec('say Changing map...');
    await rconService.exec('changelevel ' + levelName);
    await rconService.disconnect();
    return result;
}
