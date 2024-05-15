<script setup>
import { createApp ,ref, watch, computed} from 'vue';
import PopWindows from './components/PopWindows.vue';
import hook from './hook.vue'

const todosList = ref(localStorage.getItem('todosList')!=null?JSON.parse(localStorage.getItem('todosList')):[{name:'nothing',detail:'there is nothing left',date:String(new Date()).slice(0,24)}])
console.log(todosList.value)
const userinput = ref('') // 搜索框内的用户输入
const searchStatus = ref(false) // 是否处于搜索状态
const resTodosList = ref([]) // todos搜索结果
const selectTodo = ref(localStorage.getItem('selectTodo')!=null?JSON.parse(localStorage.getItem('selectTodo')):{}) // 缓存的选中列表
const isShow = ref(false) // 弹窗是否弹窗
const filter = ref(isShow.data ? `blur(3px)` : 'none') // 用于计算bg的filter属性
const editable = ref(false) // todo是否可编辑
const bg = computed({  // 背景的模糊属性
    get(){
        return filter.value
    },
    set(newValue){
        console.log(newValue)
        filter.value = newValue
    }
})

const propsdata = ref({  // 弹窗尺寸颜色信息，以及是否展示弹窗
    width : '36vw', 
    height : '60vh',
    isShow : isShow.value,
    backgroundColor : 'rgb(0, 204, 204)'
})

// 更改被选中todo
function showTodos(item){
    if (editable == true) { 
        modifyTodo() // 默认用户切换时保存内容
    }
    console.log(item.name)
    selectTodo.value = item
    localStorage.setItem('selectTodo',JSON.stringify(selectTodo.value))
}

// 搜索todos
function searchTodos(){
    console.log(userinput.value)
    let todosListVal = todosList.value,
        userinputVal = userinput.value
    // let todo = todosListVal.find(item=>item.name != userinputVal)
    if (userinputVal != '') {
        let res = todosListVal.filter(item=>(item.name.search(userinputVal) != -1))
        searchStatus.value = true
        resTodosList.value = res
        if (res.length != 0) {
            console.log('找到了',resTodosList.value)
            resTodosList.value = res
        } else {
            console.log('没找到',resTodosList.value)
        }
    } else {
        searchStatus.value = false
    }
}

// 修改todo
function modifyTodo(){
    if (editable.value){
        console.log('complate to edit',selectTodo.value.detail)
        localStorage.setItem('todosList',JSON.stringify(todosList.value))
    } else {
        console.log('already to edit',selectTodo.value.detail)
    }
    editable.value = !editable.value
}

// 添加todo
function addTodo(){
    if (isShow.value == false) {
        isShow.value = true
        propsdata.value.isShow = isShow.value
        bg.value = isShow.value ? `blur(3px)` : 'none'
    }
}

// 确认添加todo
function addTodoConfirm(){
    let name = document.getElementsByClassName('newtodo-name')[0].value
    let detail = document.getElementsByClassName('newtodo-detail')[0].value != '' ? document.getElementsByClassName('newtodo-detail')[0].value : '暂无详细内容'
    console.log('new todo name',name,'\nnew todo detail',detail)
    let now = new Date()
    if (name != ''&&name != 'nothing'){
        if (todosList.value[0].name == 'nothing') {
            todosList.value = [{
                name: name,
                detail: detail,
                status: 'unready',
                date: String(now).slice(0,24)
            }]
            selectTodo.value = todosList.value[0]
        }else{
            todosList.value.push({
                name: name,
                detail: detail,
                status: 'unready',
                date: String(now).slice(0,24)
            })
        }
        // 缓存列表
        localStorage.setItem('todosList',JSON.stringify(todosList.value))
        // 关闭弹窗显示
        isShow.value = false
        propsdata.value.isShow = false
        bg.value = isShow.value ? `blur(3px)` : 'none' 
    } else {
        window.alert('请填写合法的事件标题')
    }
}

// 取消添加todo
function cancelAdd(){
    // 关闭弹窗显示
    isShow.value = false
    propsdata.value.isShow = false
    bg.value = isShow.value ? `blur(3px)` : 'none' 
}

// 删除todo
function deleteTodo(){
    todosList.value = todosList.value.filter(item=>item.name!=selectTodo.value.name)
    if (todosList.value.length == 0){
        todosList.value = [{name:'nothing',detail:'there is nothing left',date:String(new Date()).slice(0,24)}]
    }
    selectTodo.value = todosList.value[0]
    localStorage.setItem('selectTodo',JSON.stringify(selectTodo.value))
    localStorage.setItem('todosList',JSON.stringify(todosList.value))
}

// 实现一个定时器 演示部分
const count = ref(0)

const {start,stop,pause,resume} = hook(()=>{
        console.log('hook start')  
        console.log(count.value++)
    },1000)



watch(userinput,()=>{
    if (userinput.value == ''){
        searchStatus.value = false
    }
})

// watch(editable,()=>{
//     if (editable.value == false){
//         console.log('already to load',selectTodo.value.detail)
//     } else {
//         console.log('value is',selectTodo.value.detail)
//     }
// })


</script>

<template >
    <div class='bg' :style="{filter: bg}">
        <div class="title">
            <h1> 待办事项清单 </h1>
        </div>
        <div class='left'>
            <div class="smalltitle">
                <h2 > 事 项 查 询 </h2>
            </div>
            <div class="todos-bg">
                <div class="search">
                    <div class="tips">请输入关键字</div>
                    <div class="search-box">
                        <input class="input" type="text" v-model="userinput">
                    </div>
                    <div class="button-box">
                        <div class="button" @click="searchTodos" >查询</div>
                    </div>
                </div>
                
                <div class="list-box" v-if="(searchStatus == false)">
                    <div class="todo-box" v-for="item in todosList" @click="showTodos(item)">{{ item.name }}</div>
                    <div class="todo-box" @click="addTodo" >+</div>
                </div>
                <div class="list-box" v-else>
                    <div class="todo-box" v-for="item in resTodosList" @click="showTodos(item)">{{ item.name }}</div>
                </div>
                
            </div>
            <div class="modify">

            </div>
        </div>

        <div class="right">
            <div class="smalltitle">
                <h2> 事 项 详 细 </h2> 
            </div>
            <div class="todos-bg">
                <div class="todos-title">
                    <div class="tips">
                        当前事项
                    </div>
                    <div class="name">
                        {{ selectTodo.name }}
                    </div>
                    <div class="button-box">
                        <div class="button" @click="modifyTodo" v-if="!editable">
                            编辑
                        </div>
                        <div class="button" @click="modifyTodo" v-else>
                            确认
                        </div>
                    </div>
                </div>
                <div class="todos-info">
                    <div class="name">事件标题： {{ selectTodo.name }}</div>
                    <div class="detail">
                        <p>事件详细： </p>
                        <p v-if="!editable" class="text">{{ selectTodo.detail }}</p>
                        <textarea v-else v-model="selectTodo.detail" class="text"></textarea>
                    </div>
                    <div class="status-bar" v-if="selectTodo.name == 'nothing'">
                        事件状态： everything is done!
                    </div>
                    <div class="status-bar" v-else>
                        事件状态： {{ selectTodo.status }}
                    </div>
                    <div class="delete-button" v-if="selectTodo.name == 'nothing'">
                        Nothing needs to be removed
                    </div>
                    <div class="delete-button" @click="deleteTodo" v-else>
                        删 除 当 前 事 件
                    </div>  
                    <!-- <input type="text" class="status-bar" :value="'事件状态：' +selectTodo.status "> -->
                </div>
            </div>
        </div>
    </div>

    <!-- <div class="pop-windows">
        <div>

        </div>
    </div> -->
    <pop-windows :data="propsdata">
        <div class="pop-title"> 
            <h2>请完善你的待办事项</h2> 
        </div>
        <div class="newtodo-box">
            <input type="text" class="newtodo-name" placeholder="请输入标题">
        </div>
        <div class="newtodo-box">
            <textarea type="text" class="newtodo-detail" placeholder="请输入内容"></textarea>
        </div>
        <div class="newtodo-box">
            <div @click="addTodoConfirm" class="confirm-button">确 认 提 交</div> 
        </div>
        <div @click="cancelAdd" class="return">返回</div>
    </pop-windows>
    
</template>

<style scoped>
.bg {
    width: 100vw; height: 100vh;
    position: absolute; left: 0; top: 0;
    /* filter: blur(5px); */
    /* background-color: aqua */
}
/* .pop-windows {
    position: absolute; left: 32vw; top: 20vh;
    width: 36vw; height: 60vh;
    background-color: rgb(175, 128, 94);
} */
.pop-title {
    width: 100%; height: 10%;
    display: flex; align-items: center; justify-content: center;
    background-color: aqua;
}
.newtodo-box{
    position: relative; left: 5%;
    margin-top: 2%;;
    width: 86%; 
    padding: 2%;
    font-size: larger;
    background-color: aqua;
    display: flex; flex-direction: row; align-items: center; justify-content: center;
}
.newtodo-box .newtodo-name {
    width: 100%; height: 4vh;
    font-size: 2vh;
    background-color: rgb(151, 253, 253)
}
.newtodo-box .newtodo-detail {
    width: 100%; height: 35vh;
    font-size: 2vh;
    position: relative;
    background-color: rgb(151, 253, 253);
}
.confirm-button {
    width: 100%; height: 5vh;
    display: flex; align-items: center; justify-content: center;
    background-color:  rgb(151, 253, 253);
}
.return {
    width: 10%; height: 3%; 
    margin: 0.5%;
    font-size: small;
    position: absolute; top: 0; right: 0;
    background-color:  rgb(151, 253, 253);
    display: flex; align-items: center; justify-content: center;
}
.title {
    width: 100vw; height: 10vh;
    position: absolute; 
    background-color: chocolate;
}
.left {
    position: absolute; left: 0; top: 10vh;
    width: 50vw; height: 90vh;
    background-color: aqua;
}
.smalltitle {
    position: absolute; left: 5vw; top: 0;
    width: 40vw; height: 10vh;
    display: flex; align-items: center; justify-content: center;
}
.todos-bg{
    position: absolute; left: 5vw; top: 10vh;
    width: 40vw; height: 70vh;
    background-color: beige;
}
.left .search {
    position: absolute; top: 0.5vh; left: 0.5vw;
    width: 39vw; height: 7.5vh;
    display: flex; flex-direction: row;
    background-color: aquamarine;
}
.left .tips {
    width: 4.5vw;
    background-color: azure;
    display: flex; align-items: center; justify-content: center;
}
.left .search-box {
    width: 30vw;
    background-color: bisque;
    display: flex; align-items: center; justify-content: center;
}
.left .search-box .input {
    width: 27vw; height: 5.5vh;
    font-size: 3vh; font-weight: 150;
}
.left .button-box {
    width: 5vw; 
    display: flex; align-items: center; justify-content: center;
}
.left .button-box .button {
    height: 6vh; width: 3.5vw;
    background-color: aliceblue;
    display: flex; align-items: center; justify-content: center;
}
.left .list-box {
    position: absolute; top: 9vh;
    margin-left: 0.5vw;
    width: 39vw; height: 60vh;
    background-color: rgb(226, 226, 201);
    overflow-y: auto;
    overflow-x: hidden;
}
.left .list-box .todo-box {
    position: relative;
    height: 4.5vh; width: 38vw;
    margin-top: 0.5vh;
    margin-inline: 0.5vw;
    background-color: rgb(221, 205, 185);
    display: flex; align-items: center; justify-content: center;
}

.right {
    position: absolute; left: 50vw; top: 10vh;
    width: 50vw; height: 90vh;
    background-color: aquamarine;
}

.right .todos-title {
    position: relative;
    margin-top: 0.5vh; margin-left: 0.5vw;
    width: 39vw; height: 7.5vh;
    background-color: aqua;
    display: flex; flex-direction: row;
}
.right .todos-title .tips {
    width: 4.5vw; height: 7.5vh;
    background-color: aliceblue;
    display: flex; align-items: center; justify-content: center;
}
.right .todos-title .name {
    width: 30vw; height: 7.5vh;
    background-color: rgb(221, 205, 185);
    display: flex; align-items: center; justify-content: center;
}
.right .todos-title .button-box {
    width: 4.5vw; height: 7.5vh;
    background-color: aquamarine;
    display: flex; align-items: center; justify-content: center;
}
.right .todos-title .button-box .button {
    width: 3.5vw; height: 6.5vh;
    background-color: rgb(177, 255, 229);
    display: flex; align-items: center; justify-content: center;
}
.right .todos-info {
    position: relative;
    margin-top: 1vh; margin-left: 0.5vw;
    width: 39vw; height: 60vh;
    background-color: rgb(109, 255, 96);
    font-size: 1.6vh;
}
.right .todos-info .name {
    position: absolute;
    height: 4.5vh; width: 37vw;
    margin-top: 0.5vh; margin-inline: 0.5vw;
    padding-left: 1vw;
    background-color: rgb(221, 205, 185);
    display: flex; align-items: center; 
}
.right .todos-info .detail {
    position: absolute; top: 5vh;
    width: 36vw; height: 40vh;
    margin-top: 0.5vh; margin-inline: 0.5vw;
    padding-inline: 1vw; padding-top: 0.5vh;
    background-color: bisque;
    text-align: start;
}
.right .todos-info .detail .text{
    width: 35.5vw; height: 30vh;
    font-size: 1.6vh;
    background-color: bisque;
    overflow-y: auto;
    /* overflow-x: ; */
}
.right .todos-info .status-bar {
    position: absolute; top: 46vh;
    width: 36vw; height: 5.5vh;
    margin-top: 0.5vh; margin-inline: 0.5vw;
    padding-inline: 1vw; padding-top: 0.5vh;
    background-color: blanchedalmond;
    display: flex; align-items: center; 
    text-align: start;
}
.right .todos-info .delete-button {
    position: absolute; top: 52.5vh;
    width: 36vw; height: 5.5vh;
    margin-top: 0.5vh; margin-inline: 0.5vw;
    padding-inline: 1vw; padding-top: 0.5vh;
    background-color: blanchedalmond;
    display: flex; align-items: center; justify-content: center;
    font-weight: 600;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>