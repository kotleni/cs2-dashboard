'use client';

import {execCommand} from '@/actions/exec-command';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useState} from 'react';

export default function AdminPage() {
    const [commandLine, setCommandLine] = useState('');
    const [logLines, setLogLines] = useState<string[]>([]);

    const sendCommand = async () => {
        const result = await execCommand(commandLine.trim());
        const newLines = result.split('\n');
        setLogLines(newLines);
        //setLogLines([...logLines, ...newLines]);
        console.log('result is ' + result);
    };

    return (
        <div className="w-full h-full flex flex-col justify-between gap-2">
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
