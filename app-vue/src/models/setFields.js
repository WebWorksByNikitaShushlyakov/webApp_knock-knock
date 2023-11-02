// import Residential from '@/models/models'
export default function(OBJECT_Advertisement, formData){
    const info = OBJECT_Advertisement.getInfo()
    formData.append('owner_name', info.owner_name)
    formData.append('owner_tel', info.owner_tel)
    formData.append('owner_type', info.owner_type)
    formData.append('name', info.name)
    formData.append('address', info.address)
    formData.append('price', info.price)
    formData.append('description', info.description)
    formData.append('rooms', info.rooms)
    formData.append('type_of_estate', info.typeOfEstate)
    formData.append('type_of_service', info.typeOfService)
    formData.append('square', info.square)
}