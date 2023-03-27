import LoadRoom from '#util/load_room';
/**
 * @enum {string}
 */
export const GAME_MODES = {

};

// Map is a blueprint for a room
export default class GameMap {
    name = ''; // map's display name
    room_name = ''; // room name in GMS2
    description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    preview = ''; // maybe implement preview images
    max_players = 99;
    
    width = 1344;
    height = 768;
    
    spawn_type = 'random'; // either 'random' or 'distributed'
    start_pos = [{ x: 0, y: 0 }]; // if 'random', it picks a random starting pos for everyone, otherwise - goes in order from 0 to *length*
    
    contents = '[]';
    // content: string; // a JSON string containing all the contents of the room
    
    constructor(options) {
        Object.assign(this, options);
        if (global.config.rooms_enabled) {
            Object.assign(this, LoadRoom(this.room_name));
        }
        
        // trace(this.contents);
    }
    
    getStartPos(idx) {
        if (Array.isArray(this.start_pos)) { // it's an array of positions
            switch (this.spawn_type) {
                case 'random':
                    // a random number between 0 and start_pos.length
                    var index = Math.round(Math.random() * (this.start_pos.length - 1));
                    return this.start_pos[index];
                case 'distributed':
                    // just index clamped to start_pos.length
                    var index = idx % this.start_pos.length;
                    return this.start_pos[index];
                default:
                    console.error('Error: Invalid map type');
                    return undefined;
            }
        }
        else { // it's a single object
            return this.start_pos;
        }
    }
    
    getInfo() {
        return {
            name: this.name,
            room_name: this.room_name,
            description: this.description,
            spawn_type: this.spawn_type,
            max_players: this.max_players,
            start_pos: this.start_pos
        };
    }
}
