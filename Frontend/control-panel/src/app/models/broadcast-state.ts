import { MapState } from "./map-state";

export interface BroadcastState {
    // Teams
    teamAlphaName: string;
    teamBravoName: string;
    alphaIsLeft: boolean;

    // Score
    scoreAlpha: number;
    scoreBravo: number;

    // Casters
    commentator1: string;
    commentator2: string;

    // Overlay Visibility
    showMapScreen: boolean;
    showScoreBox: boolean;
    showCommentatorBox: boolean;
    showInfobox: boolean;

    // Maps
    maps: MapState[];

    // League Information
    season: number;
    division: number;
}
