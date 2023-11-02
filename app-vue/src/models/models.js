
export default class Advertisement{
    #owner_id
    #owner_name
    #owner_tel
    #owner_type
    #name
    #address
    #price
    #description
    #rooms
    #typeOfEstate
    #typeOfService
    #square

    constructor(owner_name, owner_tel, owner_type,
                name, address, price,
                description, rooms=1,
                typeOfEstate, typeOfService, square){
        this.#owner_name = owner_name
        this.#owner_tel = owner_tel
        this.#owner_type = owner_type
        this.#name = name
        this.#address = address
        this.#price = price
        this.#description = description
        this.#rooms = rooms
        this.#typeOfEstate = typeOfEstate
        this.#typeOfService = typeOfService
        this.#square = square
    }

    getInfo(){
        return  {
            owner_name: this.#owner_name,
            owner_tel: this.#owner_tel,
            owner_type: this.#owner_type,
            name: this.#name,
            address: this.#address,
            price: this.#price,
            description: this.#description,
            rooms: this.#rooms,
            typeOfEstate: this.#typeOfEstate,
            typeOfService: this.#typeOfService,
            square: this.#square,
        }
    }
}

