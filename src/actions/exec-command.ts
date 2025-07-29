'use server';

import {RCONService} from '@/services/rcon-service';

const HOST = 'kotleni.pp.ua';
const PORT = 27015;
const PASSWORD = 'password1K';

export async function execCommand(command: string): Promise<string> {
    console.log(command);
    const rconService = new RCONService(HOST, PORT, PASSWORD);
    await rconService.connect();
    const result = await rconService.exec(command);
    await rconService.disconnect();
    return result;
}
