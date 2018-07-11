function ease(el, key, target, duration) {
    const
        words = WORDS_LIST,
        start = Date.now(),
        startWord = words.indexOf(el[key].toLowerCase()),
        endWord = words.indexOf(target.toLowerCase()),
        caser = getCaser(target);
    console.log(startWord, endWord)
    console.log(getHighPoint(startWord, endWord))
    console.log(getClosestWord(1000, 1030, 15))
    function n() {
        requestAnimationFrame(() => {
            const now = Date.now() - start;
            console.log(words[getWord(
                startWord,
                endWord,
                now,
                duration)]);
            if (now >= duration)
                el[key] = target;
            else {
                el[key] = caser(words[getWord(
                    startWord,
                    endWord,
                    now,
                    duration)]);
                n();
            }
        });
    }
    n();

    // http://www.gizma.com/easing/#quad3
    function easeInOut(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }

    function getCaser(t) {
        return [u, l, s].find(x => t == x(t)) || (x => x);
        function u(x) { return x.toUpperCase(); }
        function l(x) { return x.toLowerCase(); }
        function s(x) { return x[0].toUpperCase() + x.substr(1).toLowerCase(); }
    }

    function getHighPoint(start, end, range = 0.1){
        let y = (end-start)*range,
            x1 = ~~(start+((end-start)*(1-range)*0.5)),
            x2 = ~~(x1+y),
            list = words.slice(x1,x2),
            max = 0,
            maxLen = 0;
        // There's probably a fancier n better way to do this but idk
        for(let i in list){
            if(list[i].length > maxLen){
                max = i;
                maxLen = list[i].length;
            }
        }
        max = +max;
        return x1+max;
    }
    function getClosestWord(start, end, length){
        let list = words.slice(start,end);
        list.sort((a,b)=>{return (length-a.length)-(length-b.length)});
        return words.indexOf(list[0]);
    }
    function getWord(start, end, t, d){
        let mid = getHighPoint(start, end),
            height = words[mid].length,
            y1 = words[start].length,
            y2 = words[end].length,
            range = end - start,
            divs = Math.max(range / d,1),
            x1 = start + ~~(t * divs),
            x2 = ~~(x1 + divs),
            length = easeInOut(
                t,
                t<=d/2 ? y1 : height,
                t<=d/2 ? height - y1 : y2 - height
            );
        return getClosestWord(x1,x2,length);
    }
}
