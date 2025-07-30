export interface Map {
    title: string;
    name: string;
}

export const allMaps: Map[] = [
    {title: 'Mirage', name: 'de_mirage'},
    {title: 'Dust2', name: 'de_dust2'},
    {title: 'Inferno', name: 'de_inferno'},
    {title: 'Overpass', name: 'de_overpass'},
    {title: 'Nuke', name: 'de_nuke'},
];
export const allMapsForCombobox = allMaps.map(map => ({
    label: map.title,
    value: map.name,
}));
