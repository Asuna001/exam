function reverseWords(s) {  
    // 保留长度小于等于8的纯小写字母单词 
    const words = s.match(/\b[a-z]{1,8}\b/g) || [];  

    words.reverse();  
    
    for (let i = 0; i < words.length; i++) {  
        words[i] = i + 1 + words[i]  
    }  

    return words;  
}  
  

const s = "Hello World! This is a Test String. aBC defghij sdffsffggg 123xyz \nsdsd s\tsdjhfh ";  
const result = reverseWords(s);  
console.log(result);