/* eslint-disable prettier/prettier */

export interface UserProps{
    id:number
    name:string

}
export class User {

    private id:number
    private name:string

    constructor(props:UserProps){
        Object.assign(this,props)
    }
    
	/**
	 * Get a plain object of the domain entity without directly accessing to it. Useful when you want to convert it to JSON
	 * @returns {Record<string, any>}
	 */
	serialize() {
		return {
			id: this.id,
			name: this.name
		}
	}

}
