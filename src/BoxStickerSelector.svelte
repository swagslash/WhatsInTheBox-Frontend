<script>
    import {draggable} from 'svelte-drag'
</script>

<div class="container">
    <div class="container">
        <div class="emoji" use:draggable={{ bounds: '.container' }}>

            🐇
        </div>
    </div>

</div>



<style>
    .container {
        background-color: aquamarine;

        height: 150px;
        width: 150px;
        padding: 0;
        margin: 0;
    }

    .emoji {
        background-color: aquamarine;

        height: 50px;
        width: 50px;
        line-height: 50px;
        font-size: 30px;
    }
</style>
