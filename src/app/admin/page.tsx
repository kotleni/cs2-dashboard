'use client';

import {execCommand} from '@/actions/exec-command';
import {getPlayers, PlayerInfo} from '@/actions/get-players';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useEffect, useState} from 'react';

export default function AdminPage() {
    const [commandLine, setCommandLine] = useState('');
    const [logLines, setLogLines] = useState<string[]>([]);
    const [players, setPlayers] = useState<PlayerInfo[]>([]);

    const fetchPlayersList = async () => {
        const playersList = await getPlayers();
        setPlayers(playersList);
    };

    const sendCommand = async () => {
        const result = await execCommand(commandLine.trim());
        const newLines = result.split('\n');
        setLogLines(newLines);
        //setLogLines([...logLines, ...newLines]);
        console.log('result is ' + result);
    };

    const kickPlayer = async (name: string) => {
        const result = await execCommand('kick ' + name);
        console.log(result);

        await fetchPlayersList();
    };

    useEffect(() => {
        void fetchPlayersList();
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-1 p-4">
                {players.map(player => {
                    return (
                        <div
                            key={player.id}
                            className="w-60 bg-primary hover:bg-accent bg-primary-foreground rounded-sm px-2 flex flex-row items-center justify-between gap-1"
                        >
                            <p>{player.name}</p>
                            <p>{player.isBot ? 'BOT' : player.ping + ' ms'}</p>
                            <Button
                                variant="destructive"
                                className="h-5 cursor-pointer"
                                onClick={() => {
                                    void kickPlayer(player.name);
                                }}
                            >
                                Kick
                            </Button>
                        </div>
                    );
                })}
            </div>
            <div className="p-4">
                {logLines.map((line, index) => {
                    return <div key={index}>{line}</div>;
                })}
            </div>
            <div className="w-full flex flex-row gap-2 p-4">
                <Input
                    type="text"
                    placeholder="command"
                    value={commandLine}
                    onChange={e => {
                        setCommandLine(e.target.value);
                    }}
                />
                <Button
                    variant="default"
                    onClick={() => {
                        void sendCommand();
                    }}
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
