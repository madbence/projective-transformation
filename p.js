function mul(v, m) {
    var r = [0, 0, 0, 0];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            r[i] += v[j] * m[j][i];
        }
    }
    return r;
}

function project(v) {
    var fov = 60;
    fov = fov * 3.1415 / 180;
    var S = 1 / Math.tan(fov * 0.5);
    var f = 100;
    var n = 1;
    var pm = [
        [S, 0, 0, 0],
        [0, S, 0, 0],
        [0, 0, -f / (f - n), -1],
        [0, 0, -f * n / (f - n), 0]
    ];
    var t = mul(v, pm);
    for (var i = 0; i < 4; i++) {
        t[i] /= t[3];
    }
    return t;
}

function rotateY(v, a) {
    return mul(v, [
        [Math.cos(a), 0, Math.sin(a), 0],
        [0, 1, 0, 0],
        [-Math.sin(a), 0, Math.cos(a), 0],
        [0, 0, 0, 1]
    ]);
}

function moveZ(v, a) {
    v[2] -= a;
    return v;
}

window.onload = function() {
    ctx = document.getElementById('canvas').getContext('2d');
    ctx.translate(300, 300);
    ctx.scale(1, -1);
    var scale = 100;
    var vs = [
        [-scale, -scale, -scale, 1],
        [-scale, scale, -scale, 1],
        [scale, scale, -scale, 1],
        [scale, -scale, -scale, 1],
        [-scale, -scale, scale, 1],
        [-scale, scale, scale, 1],
        [scale, scale, scale, 1],
        [scale, -scale, scale, 1], ];
    function myfun(u,v) {
        return Math.sin(u/2)*Math.cos(v/2);
    }
    var v2 = [];
    for(var i=0;i<10;i++){
        for(var j=0;j<10;j++){
            var a = [];
            a.push([(i-5)/5*scale, myfun(i,j)*scale/2,(j-5)/5*scale,1]);
            a.push([(i-4)/5*scale, myfun(i+1,j)*scale/2,(j-5)/5*scale,1]);
            a.push([(i-4)/5*scale, myfun(i+1,j+1)*scale/2,(j-4)/5*scale,1]);
            a.push([(i-5)/5*scale, myfun(i,j+1)*scale/2,(j-4)/5*scale,1]);
            a.push([(i-5)/5*scale, myfun(i,j)*scale/2,(j-5)/5*scale,1]);
            v2.push(a);
        }
    }
    var v = [0, 1, 2, 3, 0, 3, 7, 6, 2, 6, 5, 1, 5, 4, 0, 4, 7];
    var move = 300;
    var ang = 0;
    window.webkitRequestAnimationFrame(function sunamuna() {
        ang += 0.01;
        ctx.clearRect(-300, -300, 600, 600);
        ctx.beginPath();
        for (var i = 0; i < v.length; i++) {
            var p = project(moveZ(rotateY(vs[v[i]], ang), move));
            ctx.lineTo(p[0] * 100, p[1] * 100);
        }
        ctx.stroke();
        for (var i = 0; i < v2.length; i++) {
            ctx.beginPath();
            for(var j=0;j<5;j++){
                var p = project(moveZ(rotateY(v2[i][j], ang), move));
                ctx.lineTo(p[0] * 100, p[1] * 100);
            }
            ctx.stroke();
        }
        window.webkitRequestAnimationFrame(sunamuna)
    });
}
