import { defineStore } from 'pinia'

export const useBasicStore = defineStore('basic', ()=>{
    const model = ref(false)
    function changeModel(params) {
        model.value = params
    }

    function test(params) {
        return "test"
    }
    return { model, changeModel, test }
})