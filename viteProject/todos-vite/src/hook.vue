<script>
import { ref, onUnmounted, onMounted } from 'vue';  
  
  function hook(fn, delay, immediate = false) {  
    const intervalId = ref(null);  
    let paused = false;  
    let timeoutId = null;  
     
    const start = function (){  
      if (immediate) {  
        fn();  
        immediate = false; // 防止多次立即执行  
      }  
    
      if (!intervalId.value && !paused) {  
        intervalId.value = setInterval(fn, delay);  
      }  
    };  
    
    const stop = function (){  
      clearInterval(intervalId.value);  
      intervalId.value = null;  
      paused = false;  
      clearTimeout(timeoutId);  
    };  
    
    const pause = function (){  
      paused = true;  
      clearTimeout(timeoutId);  
    };  
     
    const resume = function (){  
      if (paused) {  
        paused = false;  
        start(); // 重新开始定时器  
      }  
    };  
     
    onUnmounted(() => {  
      stop();  
    });  
    
    onMounted(() => {  
      if (immediate) {  
        timeoutId = setTimeout(start, 0);  
      }  
    });  
    
    return {  
      start,  
      stop,  
      pause,  
      resume  
    };  
  }  
    
  export default hook;
  
</script>