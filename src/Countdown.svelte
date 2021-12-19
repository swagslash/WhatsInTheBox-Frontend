<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';

    export let countdown = 0;
    const dispatch = createEventDispatcher();

    let timer = null;
    $: seconds = countdown % 60;

    onMount(() => {
        timer = setInterval(() => {
            countdown -= 1;
        }, 1000);
    })

    $: {
        if (countdown === 0) {
            clearInterval(timer);
            timer = null;
            dispatch('completed');
        }
    }

    function countDownToEmoji(x: number):string {
        let stringParsed = x.toString();
        stringParsed = stringParsed.split("0").join("0️⃣");
        stringParsed = stringParsed.split("1").join("1️⃣");
        stringParsed = stringParsed.split("2").join("2️⃣");
        stringParsed = stringParsed.split("3").join("3️⃣");
        stringParsed = stringParsed.split("4").join("4️⃣");
        stringParsed = stringParsed.split("5").join("5️⃣");
        stringParsed = stringParsed.split("6").join("6️⃣");
        stringParsed = stringParsed.split("7").join("7️⃣");
        stringParsed = stringParsed.split("8").join("8️⃣");
        stringParsed = stringParsed.split("9").join("9️⃣");
        // console.log(stringParsed);
        // console.log("9️⃣");
        return stringParsed;
    }

    // const stringToEmoji: Record<string, string> = {
    //     "0": "0️⃣",
    //     "1": "1️⃣",
    //     "2": "2️⃣",
    //     "3": "3️⃣",
    //     "4": "4️⃣",
    //     "5": "5️⃣",
    //     "6": "6️⃣",
    //     "7": "7️⃣",
    //     "8": "8️⃣",
    //     "9": "9️⃣",
    // };

</script>

<style>
    h3 {
        font-size: 50px;
    }
    /*@media (min-width: 950px){*/
    /*    h3 {*/
    /*        font-size: 50px;*/
    /*        position: absolute;*/
    /*        left: 40px;*/
    /*    }*/
    /*}*/
    /*@media (min-width: 1150px){*/
    /*    h3 {*/
    /*        font-size: 60px;*/
    /*        position: absolute;*/
    /*        left: 80px;*/
    /*    }*/
    /*}*/
    /*@media (min-width: 1450px){*/
    /*    h3 {*/
    /*        font-size: 80px;*/
    /*        position: absolute;*/
    /*        left: 250px;*/
    /*    }*/
    /*}*/

    .num {
        font-size: 94px;
    }
</style>

<h3>
    {#if timer !== null}{countDownToEmoji(countdown)}{:else}Time is up!{/if}
</h3>
