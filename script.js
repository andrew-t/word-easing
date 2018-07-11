function ease(el, key, target, duration) {
    const
        words = WORDS_LIST,
        start = Date.now(),
        startWord = words.indexOf(el[key].toLowerCase()),
        endWord = words.indexOf(target.toLowerCase()),
        caser = getCaser(target);
    console.log(startWord, endWord)
    function n() {
        requestAnimationFrame(() => {
            const now = Date.now() - start;
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
    function getClosestWord(start, length){
        length = ~~length;
        let i = words.length-1,
            j = start,
            k = 0,
            l = j;
        while(j+(k/2)<i || j-k>=0){
            l = Math.min(j+k,i);
            if(words[l] && words[l].length == length) break;
            l = Math.max(j-k,0);
            if(words[l] && words[l].length == length) break;
            k++;
        }
        return l;
    }
    function getWord(start, end, t, d){
        let mid = getHighPoint(start, end),
            height = words[mid].length,
            y1 = words[start].length,
            y2 = words[end].length,
            range = Math.abs(end - start),
            divs = Math.max(range / d,1),
            neg = start > end,
            x1 = Math.min(start + (~~((t+0.5) * divs)*(neg?-1:1)),words.length-1),
            length = ~~easeInOut(
                t,
                t<=d/2 ? (neg?y2:y1) : height,
                t<=d/2 ? height - (neg?y2:y1) : (neg?y1:y2) - height,
                d
            );
        return Math.min(neg?start:end,getClosestWord(x1,length));
    }
}
