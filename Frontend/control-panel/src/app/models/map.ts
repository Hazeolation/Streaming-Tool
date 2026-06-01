/**
 * Defines the `Map` interface, which represents a game map in the context of the broadcasting tool. Each map has a unique identifier (`id`), a human-readable name (`mapName`), and a URL to an image representing the map (`imageUrl`). This interface is used to structure the data related to game maps, allowing for consistent handling of map information throughout the application. The `id` property is typically used for internal logic and referencing, while the `mapName` and `imageUrl` properties are used for display purposes in the user interface, enabling users to easily identify and visualize the maps being used in the broadcast.
 */
export interface Map {
    id: string;
    mapName: string;
    imageUrl: string;
}
