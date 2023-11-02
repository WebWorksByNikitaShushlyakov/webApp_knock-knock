
class User{
    #number=''
    #password=''
    #role=''

    #typeOwner=''
    #name=''
    #surname=''

    constructor(number, password, other){
        this.#number = number
        this.#password = password
        this.#role = 'USER'
        this.#typeOwner = other.typeOwner
        this.#surname = other.surname
        this.#name = other.name
    }

    getUserInfo(){
        return `(NULL,
            '${this.#number}',
            '${this.#password}',
            '${this.#role}',
            '${this.#typeOwner}',
            '${this.#surname}',
            '${this.#name}')`
    }

    getAuthInfo(){
        return {
            number: this.#number,
            typeOwner: this.#typeOwner,
            surname: this.#surname,
            name: this.#name,
        }
    }
}

module.exports = {User}
