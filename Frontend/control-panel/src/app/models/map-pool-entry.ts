/**
 * Defines the `MapPoolEntry` interface, which represents an entry in the map pool for the broadcasting tool. Each `MapPoolEntry` object contains a unique identifier (`id`), a human-readable name for the map (`mapName`), and a URL to an image representing the map (`imageUrl`). This interface is used to structure the data related to maps that are available in the pool, allowing for consistent handling and display of map information throughout the application. The `id` property is typically used for internal logic and referencing, while the `mapName` and `imageUrl` properties are used for display purposes in the user interface, enabling users to easily identify and visualize the maps available in the pool.
 */
export interface MapPoolEntry {
    id: string;
    mapName: string;
    imageUrl: string;
}
