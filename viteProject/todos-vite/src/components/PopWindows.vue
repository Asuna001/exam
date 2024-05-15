<script setup>
import { ref , computed, watch} from 'vue';

const props = defineProps(['data'])
console.log(props.data)
const height = ref(props.data.height)
const width = ref(props.data.width)
const backgroundColor = ref(props.data.backgroundColor)
const left = computed(()=>{
    return `calc((100vw - ${width.value}) / 2)`
})
const top = computed(()=>{
    return `calc((100vh - ${height.value}) / 2)`
})
const isShow = ref(props.data.isShow)

watch(props,()=>{
    isShow.value = props.data.isShow
})
</script>

<template>
    <div class="pop-windows" :style="{'width': width, 'height': height, 'top': top, 'left': left, 'background-color': backgroundColor}" v-if="isShow">
        <slot></slot>
    </div>

</template>

<style scoped>
.pop-windows {
    position: absolute; 
    background-color: rgb(175, 128, 94);
}
</style>