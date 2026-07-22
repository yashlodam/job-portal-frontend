
const setItem = (key,value)=>{
    localStorage.setItem(key,value);
}

const getItem = (key)=>{
    return JSON.parse(localStorage.getItem(key))
}

const removeItem = (key)=>{
    localStorage.removeItem(key)
}

export {setItem,getItem,removeItem};