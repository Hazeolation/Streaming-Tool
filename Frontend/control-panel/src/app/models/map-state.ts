export interface MapState {
    id: string;
    order: number;
    mapId: string;
    mapName: string;
    modeId: string;
    modeName: string;
    imageUrl: string;
    winner?: 'alpha' | 'bravo' | null;
    isVisible: boolean;
}
