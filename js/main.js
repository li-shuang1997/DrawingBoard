let canvas = document.getElementById('drawing-board');
// getContext()获得渲染上下文和它的渲染功能
let ctx = canvas.getContext('2d');
let brush = document.getElementById('brush');
let eraser = document.getElementById('eraser');
let empty = document.getElementById('empty');
let undo = document.getElementById('undo');
let save = document.getElementById('save');
let range = document.getElementById('range');
let colorBtn = document.getElementsByClassName('color-item');
let clear = false;
let lineWidth = 4;
let activeColor = 'black';

autoSetSize(canvas);
userOperate(canvas);
chooseColor();

// 设置canvas绘画面板的大小
function autoSetSize(canvas){
    canvasSetSize();
    function canvasSetSize(){
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
    window.onresize = function(){
        canvasSetSize();
    }
}
// 监听鼠标操作
function userOperate(canvas){
    let painting = false;
    let firstPoint = {x: undefined , y: undefined};
    if(document.body.ontouchstart !== undefined){
        canvas.ontouchstart = function(e){
            this.firstData= ctx.getImageData(0, 0, canvas.width, canvas.height);
            saveData(this.firstData);
            painting = true;
            let x = e.touch[0].clientX;
            let y = e.touch[0].clientY;
            firstPoint = {'x': x, 'y': y}
            drawCircle(x, y, 0);
        }
        canvas.ontouchmove = function(e){
            if(painting){
                let x = e.touch[0].clientX;
                let y = e.touch[0].clientY;
                let newPoint = {'x':x, 'y':y};
                drawLine(firstPoint.x, firstPoint.y, newPoint.x, newPoint.y);
                firstPoint = newPoint;
            }
        }
        canvas.ontouchmove = function(){
            painting = false;
        }
    }
    else{
        canvas.onmousedown = function(e){
            this.firstData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            saveData(this.firstData);
            painting = true;
            let x = e.clientX;
            let y = e.clientY;
            firstPoint = {'x': x, 'y': y};
            drawCircle(x, y, 0);
        }
        canvas.onmousemove = function(e){
            if(painting){
                let x = e.clientX;
                let y = e.clientY;
                let newPoint = {'x': x, 'y': y};
                drawLine(firstPoint.x, firstPoint.y, newPoint.x, newPoint.y);
                firstPoint = newPoint;
            }
        }
        canvas.onmouseup =  function(){
            painting = false;
        }
        canvas.onmouseleave = function(){
            painting = false;
        }
    }
}
//画圆函数
function drawCircle(x,y,radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.fill();
}
// 画线函数
function drawLine(x1, y1, x2, y2){
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if(clear){
        ctx.save();
        // globalCompositeOperation 属性说明了绘制到画布上的颜色是如何与画布上已有的颜色组合（或“合成”）的
        ctx.globalCompositeOperation = "destination-out"
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.restore();
    }
    else{
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
}
// 保存绘图
let historyData = [];
function saveData(data){
    (historyData.length === 5) && (historyData.shift());
    historyData.push(data);
}
// 选择颜色
function chooseColor(){
    for(let i = 0; i < colorBtn.length; i++){
        colorBtn[i].onclick = function(){
            for(let i = 0; i < colorBtn.length; i++){
                colorBtn[i].classList.remove('active');
                this.classList.add('active');
                activeColor = this.style.backgroundColor;
                ctx.fillStyle = activeColor;
                ctx.strokeStyle = activeColor;
            }          
        }
    }
}

brush.onclick = function(){
    clear = false;
    this.classList.add('active');
    eraser.classList.remove('active');
    
}
eraser.onclick = function(){
    clear = true;
    this.classList.add('active');
    brush.classList.remove('active');
}
empty.onclick = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
undo.onclick = function(){
    if(historyData.length < 1) return false;
    ctx.putImageData(historyData[historyData.length - 1], 0, 0);
    historyData.pop();
}
save.onclick = function(){
    // toDataURL返回一个包含图片展示的data URL
    let imageUrl = canvas.toDataURL('image/png');
    let saveA = document.createElement('a');
    // document.body.appendChild(A)在文档body对象上挂载元素A
    document.body.appendChild(saveA);
    saveA.href = imageUrl;
    saveA.download = 'zspic' + (new Date).getTime();
    saveA.target = '_blank';
    saveA.click();
}
range.onchange = function(){
    lineWidth = this.value;
}