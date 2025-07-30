'use client';

import {execCommand} from '@/actions/exec-command';
import {GameInfo, getGameInfo} from '@/actions/get-gameinfo';
import {getPlayers, PlayerInfo} from '@/actions/get-players';
import {setGameMode} from '@/actions/set-gamemode';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {allGameModesForCombobox} from '@/data/game-mode';
import {cn} from '@/lib/utils';
import {Popover, PopoverTrigger, PopoverContent} from '@radix-ui/react-popover';
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from 'cmdk';
import {ChevronsUpDown, Check} from 'lucide-react';
import React from 'react';
import {useEffect, useState} from 'react';

function GameModeCombobox() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? allGameModesForCombobox.find(
                              gamemode => gamemode.value === value,
                          )?.label
                        : 'Select gamemode...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No gamemode found.</CommandEmpty>
                        <CommandGroup>
                            {allGameModesForCombobox.map(gamemode => (
                                <CommandItem
                                    key={gamemode.value}
                                    value={gamemode.value}
                                    onSelect={currentValue => {
                                        setValue(
                                            currentValue === value
                                                ? ''
                                                : currentValue,
                                        );
                                        setOpen(false);

                                        void setGameMode(gamemode.value);
                                    }}
                                >
                                    {gamemode.label}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === gamemode.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default function AdminPage() {
    const [commandLine, setCommandLine] = useState('');
    const [logLines, setLogLines] = useState<string[]>([]);
    const [players, setPlayers] = useState<PlayerInfo[]>([]);
    const [gameInfo, setGameInfo] = useState<GameInfo | undefined>(undefined);

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
        setCommandLine('');
    };

    const sendCustomCommand = async (command: string) => {
        const result = await execCommand(command.trim());
        const newLines = result.split('\n');
        setLogLines(newLines);
        //setLogLines([...logLines, ...newLines]);
        console.log('result is ' + result);
        setCommandLine('');
    };

    const kickPlayer = async (name: string) => {
        const result = await execCommand('kick ' + name);
        console.log(result);

        await fetchPlayersList();
    };

    const fetchGameInfo = async () => {
        const gameInfo = await getGameInfo();
        console.log(gameInfo);
        setGameInfo(gameInfo);
    };

    useEffect(() => {
        void fetchGameInfo();
        void fetchPlayersList();
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-between gap-2">
            <div
                className="flex flex-row gap-2 p-4"
                hidden={gameInfo === undefined}
            >
                <p>
                    game_mode={gameInfo?.gameMode}, game_type=
                    {gameInfo?.gameType}
                </p>
                <GameModeCombobox />
            </div>
            <div className="flex flex-row gap-2 p-4">
                {['mp_restartgame 1', 'bot_kick', 'bot_add', 'say SERVER'].map(
                    (cmd, index) => {
                        return (
                            <Button
                                key={index}
                                variant="secondary"
                                onClick={() => {
                                    void sendCustomCommand(cmd);
                                }}
                            >
                                {cmd}
                            </Button>
                        );
                    },
                )}
            </div>
            <div className="flex flex-col gap-1 p-4 absolute right-0">
                <h2 className="text-lg font-semibold">Players</h2>
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
                <Button
                    variant="default"
                    className="h-7"
                    onClick={() => {
                        void fetchPlayersList();
                    }}
                >
                    Refresh
                </Button>
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
