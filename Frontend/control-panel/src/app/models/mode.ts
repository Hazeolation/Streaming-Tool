/**
 * Defines the `Mode` interface, which represents a game mode in the context of the broadcasting tool. Each mode has a unique identifier (`id`) and a human-readable name (`name`). This interface is used to structure the data related to game modes, allowing for consistent handling of mode information throughout the application. The `id` property is typically used for internal logic and referencing, while the `name` property is used for display purposes in the user interface.
 */
export interface Mode {
    id: string,
    name: string,
}
