export enum GameMode {
    Casual = 'casual',
    Deathmatch = 'deathmatch',
    Competitive = 'competitive',
    ArmsRace = 'armsrace',
    Training = 'new_user_training',
    // FIXME: Wingmans = 'comptetitive2x2',
}
export const allGameModes = Object.keys(GameMode);
export const allGameModesForCombobox = Object.entries(GameMode).map(
    ([key, value]) => ({
        label: key,
        value: value,
    }),
);
