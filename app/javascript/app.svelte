<script>
 export let counter = 0;
 export let name;
 export let message;

 function onClickCounter() {
     counter = counter + 1;
 }
</script>

<style>
 h1 {
     color: #FF3E00;
 }
</style>

<h1>Hello me too {name} via {message} - {counter}!</h1>

<button on:click="{onClickCounter}">Click me</button>
